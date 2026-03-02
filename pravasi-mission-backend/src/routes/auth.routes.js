const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const crypto = require("crypto");
const authDB = require("../repos/auth.db");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/jwt");

const OTP_EXPIRY_MINUTES = 10;
const pendingSignupOtps = new Map();

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function maskEmail(email) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  if (user.length <= 2) return `${user[0]}***@${domain}`;
  return `${user.slice(0, 2)}***@${domain}`;
}

function maskPhone(phone) {
  if (!phone) return "";
  const last4 = phone.slice(-4);
  return `******${last4}`;
}

function getRefreshExpiryDate() {
  const days = Number(process.env.JWT_REFRESH_TTL_DAYS || 30);
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function issueAuthTokens({ user, req }) {
  const roles = (user.roles || []).map((r) => r.role_code).filter(Boolean);
  const accessToken = signAccessToken({
    sub: user.id,
    roles,
    email: user.email,
    name: `${user.first_name} ${user.last_name}`,
    mobile: `${user.phone_country_code}-${user.phone_number}`,
  });

  const refreshToken = signRefreshToken({ sub: user.id });
  await authDB.saveRefreshToken({
    userId: user.id,
    tokenHash: sha256(refreshToken),
    expiresAt: getRefreshExpiryDate(),
    userAgent: req.headers["user-agent"],
    ip: getClientIp(req),
  });

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: "Bearer",
    expires_in: process.env.JWT_ACCESS_TTL || "15m",
  };
}

async function sendEmailOtp({ email, otp }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("Email OTP service is not configured");
  }

  const nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
    to: email,
    subject: "Your OTP Verification Code",
    text: `Your OTP is ${otp}. It is valid for ${OTP_EXPIRY_MINUTES} minutes.`,
  });
  return true;
}

async function sendSmsOtp({ phoneCountryCode, phoneNumber, otp }) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_FROM_NUMBER) {
    throw new Error("SMS OTP service is not configured");
  }

  const twilio = require("twilio");
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  await client.messages.create({
    body: `Your OTP is ${otp}. Valid for ${OTP_EXPIRY_MINUTES} minutes.`,
    from: process.env.TWILIO_FROM_NUMBER,
    to: `${phoneCountryCode}${phoneNumber}`,
  });
  return true;
}
// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone_country_code = "+91",
    phone_number,
    password,
    role_ids,        // array of role IDs e.g. [1,3]
    assigned_by = null
  } = req.body || {};

  if (!first_name || !last_name || !email || !phone_number || !password) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  if (!Array.isArray(role_ids) || role_ids.length === 0) {
    return res.status(400).json({ success: false, message: "role_ids must be a non-empty array" });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const data = await authDB.saveUserWithRoles(first_name,
      last_name,
      email,
      phone_country_code,
      phone_number,
      password_hash,
      role_ids,
      assigned_by);
    return res.status(201).json({ success: true, data });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ success: false, message: "Email or phone already exists" });
    }
    return res.status(500).json({ success: false, message: "Signup failed", error: err.message });
  }
});

// POST /api/auth/signup/init
router.post("/signup/init", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone_country_code = "+91",
    phone_number,
    password,
    role_ids,
    assigned_by = null,
  } = req.body || {};

  if (!first_name || !last_name || !email || !phone_number || !password) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  if (!Array.isArray(role_ids) || role_ids.length === 0) {
    return res.status(400).json({ success: false, message: "role_ids must be a non-empty array" });
  }

  try {
    const existingUser = await authDB.findUserWithRoles({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    const verificationId = crypto.randomUUID();
    const emailOtp = generateOtp();
    const phoneOtp = generateOtp();
    const password_hash = await bcrypt.hash(password, 10);

    const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
    pendingSignupOtps.set(verificationId, {
      first_name,
      last_name,
      email,
      phone_country_code,
      phone_number,
      password_hash,
      role_ids,
      assigned_by,
      emailOtp,
      phoneOtp,
      expiresAt,
    });

    try {
      await sendEmailOtp({ email, otp: emailOtp });
      await sendSmsOtp({ phoneCountryCode: phone_country_code, phoneNumber: phone_number, otp: phoneOtp });
    } catch (sendErr) {
      pendingSignupOtps.delete(verificationId);
      return res.status(500).json({ success: false, message: "Failed to send OTP", error: sendErr.message });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent to email and phone.",
      data: {
        verification_id: verificationId,
        email: maskEmail(email),
        phone: maskPhone(phone_number),
        expires_in_minutes: OTP_EXPIRY_MINUTES,
        email_sent: true,
        sms_sent: true,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to initialize signup OTP", error: err.message });
  }
});

// POST /api/auth/signup/verify
router.post("/signup/verify", async (req, res) => {
  const { verification_id, email_otp, phone_otp } = req.body || {};
  if (!verification_id || !email_otp || !phone_otp) {
    return res.status(400).json({ success: false, message: "verification_id, email_otp, phone_otp required" });
  }

  const pending = pendingSignupOtps.get(verification_id);
  if (!pending) {
    return res.status(400).json({ success: false, message: "Invalid or expired verification session" });
  }

  if (Date.now() > pending.expiresAt) {
    pendingSignupOtps.delete(verification_id);
    return res.status(400).json({ success: false, message: "OTP expired. Please request a new OTP." });
  }

  if (String(email_otp) !== String(pending.emailOtp) || String(phone_otp) !== String(pending.phoneOtp)) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  try {
    await authDB.saveUserWithRoles(
      pending.first_name,
      pending.last_name,
      pending.email,
      pending.phone_country_code,
      pending.phone_number,
      pending.password_hash,
      pending.role_ids,
      pending.assigned_by
    );

    const createdUser = await authDB.findUserWithRoles({ email: pending.email });
    if (!createdUser) {
      return res.status(500).json({ success: false, message: "User creation succeeded but user retrieval failed" });
    }

    delete createdUser.password_hash;
    const tokens = await issueAuthTokens({ user: createdUser, req });

    pendingSignupOtps.delete(verification_id);

    return res.status(201).json({
      success: true,
      message: "Signup verified and account created successfully.",
      data: {
        user: createdUser,
        ...tokens,
      },
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ success: false, message: "Email or phone already exists" });
    }
    return res.status(500).json({ success: false, message: "Failed to verify signup OTP", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const {
    email = null,
    password,
  } = req.body || {};

  if (!password) {
    return res.status(400).json({ success: false, message: "password required" });
  }
  if (!email) {
    return res.status(400).json({ success: false, message: "email required" });
  }

  try {
    const user = await authDB.findUserWithRoles({ email});
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const tokens = await issueAuthTokens({ user, req });

    // remove password_hash from response
    delete user.password_hash;

    return res.json({
      success: true,
      data: {
        user,
        ...tokens,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
});

// POST /api/auth/refresh
// body: { refresh_token }
router.post("/refresh", async (req, res) => {
  const { refresh_token } = req.body || {};
  if (!refresh_token) return res.status(400).json({ success: false, message: "refresh_token required" });

  try {
    // verify JWT signature + expiry
    const payload = verifyRefreshToken(refresh_token);
    const userId = payload.sub;

    // check token exists and not revoked/expired in DB
    const tokenHash = sha256(refresh_token);

    const tokenRow = await authDB.findRefreshTokenRow({ userId, tokenHash });
    if (!tokenRow || tokenRow.revoked_at) {
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }

    // Get latest roles for access token
    const u = await authDB.loadUserRoles({ userId });
    if (!u) return res.status(404).json({ success: false, message: "User not found" });

    const accessToken = signAccessToken({
      sub: u.id,
      roles: u.roles || [],
      email: u.email,
      name:`${u.first_name} ${u.last_name}`,
      mobile:`${u.phone_country_code}-${u.phone_number}`
    });

    // (Optional but recommended) rotate refresh token:
    // revoke old + issue new
    const newRefreshToken = signRefreshToken({ sub: userId });
    const days = Number(process.env.JWT_REFRESH_TTL_DAYS || 30);
    const newExpiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await authDB.rotateRefreshToken({
      oldTokenRowId: tokenRow.id,
      userId,
      newTokenHash: sha256(newRefreshToken),
      newExpiresAt,
      userAgent: req.headers["user-agent"],
      ip: getClientIp(req),
    });

    return res.json({
      success: true,
      data: {
        access_token: accessToken,
        refresh_token: newRefreshToken,
        token_type: "Bearer",
        expires_in: process.env.JWT_ACCESS_TTL || "15m",
      },
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid refresh token", error: err.message });
  }
});

// POST /api/auth/logout
// body: { refresh_token }
router.post("/logout", async (req, res) => {
  const { refresh_token } = req.body || {};
  if (!refresh_token) return res.status(400).json({ success: false, message: "refresh_token required" });

  try {
    // verify to get sub, but even if verify fails we can still try delete by hash (up to you)
    const payload = verifyRefreshToken(refresh_token);
    const userId = payload.sub;

    await authDB.revokeRefreshToken({
      userId: userId,
      tokenHash: sha256(refresh_token),
    });

    return res.json({ success: true, message: "Logged out" });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
});

function sha256(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function getClientIp(req) {
  return (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket.remoteAddress || null;
}
module.exports = router;

