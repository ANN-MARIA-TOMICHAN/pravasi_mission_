const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const crypto = require("crypto");
const authDB = require("../repos/auth.db");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/jwt");

const OTP_EXPIRY_MINUTES = 3;
const OTP_RATE_LIMIT_COUNT = 3;
const OTP_RATE_LIMIT_WINDOW_MINUTES = 5;
const OTP_PURPOSE = {
  SIGNUP: "signup",
  FORGOT_PASSWORD: "forgot_password",
};

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
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
function normalizeIdentifier(identifier) {
  return String(identifier || "").trim().toLowerCase();
}

function isEmail(identifier) {
  return identifier.includes("@");
}

function normalizePhoneIdentifier(phoneCountryCode, phoneNumber) {
  return `${String(phoneCountryCode || "").trim()}${String(phoneNumber || "").replace(/\s+/g, "")}`;
}

function isEmailOtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function isSmsOtpConfigured() {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER);
}

function canUseDevOtpFallback() {
  if (process.env.OTP_DEV_FALLBACK === "true") return true;
  return process.env.NODE_ENV !== "production";
}

function splitPhoneIdentifier(identifier) {
  const normalized = String(identifier || "").replace(/\s+/g, "");
  if (!normalized.startsWith("+")) return null;
  const digits = normalized.slice(1);
  if (!/^\d{8,15}$/.test(digits)) return null;
  // Assumes country code max 3 digits.
  const ccLength = digits.length > 10 ? digits.length - 10 : 2;
  const countryCode = `+${digits.slice(0, ccLength)}`;
  const phoneNumber = digits.slice(ccLength);
  return { countryCode, phoneNumber };
}

async function createAndSendOtp({ identifier, purpose }) {
  const requestCount = await authDB.countRecentOtpRequests({ identifier, purpose });
  if (requestCount >= OTP_RATE_LIMIT_COUNT) {
    const message = `Too many OTP requests. Max ${OTP_RATE_LIMIT_COUNT} requests in ${OTP_RATE_LIMIT_WINDOW_MINUTES} minutes.`;
    const err = new Error(message);
    err.statusCode = 429;
    throw err;
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  await authDB.createOtpVerification({
    identifier,
    otpCode: otp,
    purpose,
    expiresAt,
  });

  if (isEmail(identifier)) {
    if (isEmailOtpConfigured()) {
      await sendEmailOtp({ email: identifier, otp });
      return { delivery: "email" };
    }
  } else {
    const phoneParts = splitPhoneIdentifier(identifier);
    if (!phoneParts) throw new Error("Invalid phone identifier. Use E.164 format, e.g. +919876543210");
    if (isSmsOtpConfigured()) {
      await sendSmsOtp({
        phoneCountryCode: phoneParts.countryCode,
        phoneNumber: phoneParts.phoneNumber,
        otp,
      });
      return { delivery: "sms" };
    }
  }

  if (canUseDevOtpFallback()) {
    console.warn(`[OTP DEV FALLBACK] identifier=${identifier} purpose=${purpose} otp=${otp}`);
    return { delivery: "dev_fallback", devOtp: otp };
  }

  if (isEmail(identifier)) {
    throw new Error("Email OTP service is not configured");
  } else {
    throw new Error("SMS OTP service is not configured");
  }
}

async function handleSignupOtpInit(req, res) {
  const {
    email,
    phone_country_code = "+91",
    phone_number,
    identifier,
  } = req.body || {};

  if (!email || !phone_number) {
    return res.status(400).json({ success: false, message: "email and phone_number are required" });
  }

  const normalizedIdentifier = normalizeIdentifier(identifier || email);
  if (!normalizedIdentifier) {
    return res.status(400).json({ success: false, message: "identifier is required" });
  }

  try {
    const existingUser = await authDB.findUserByEmailOrPhone({
      email: normalizeIdentifier(email),
      phoneCountryCode: phone_country_code,
      phoneNumber: phone_number,
    });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email or phone already exists" });
    }

    const verificationId = crypto.randomUUID();
    const phoneIdentifier = normalizePhoneIdentifier(phone_country_code, phone_number);

    const emailOtpDelivery = await createAndSendOtp({
      identifier: normalizeIdentifier(email),
      purpose: OTP_PURPOSE.SIGNUP,
    });
    const phoneOtpDelivery = await createAndSendOtp({
      identifier: phoneIdentifier,
      purpose: OTP_PURPOSE.SIGNUP,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
      data: {
        verification_id: verificationId,
        identifier: normalizedIdentifier,
        email: normalizeIdentifier(email),
        phone: phoneIdentifier,
        purpose: OTP_PURPOSE.SIGNUP,
        expires_in_minutes: OTP_EXPIRY_MINUTES,
        email_delivery: emailOtpDelivery.delivery,
        sms_delivery: phoneOtpDelivery.delivery,
        ...(emailOtpDelivery.devOtp ? { dev_email_otp: emailOtpDelivery.devOtp } : {}),
        ...(phoneOtpDelivery.devOtp ? { dev_phone_otp: phoneOtpDelivery.devOtp } : {}),
      },
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message || "Failed to send signup OTP" });
  }
}

// POST /api/auth/signup
// backward-compatible alias for OTP init
router.post("/signup", handleSignupOtpInit);

// POST /api/auth/signup/init
// body: { email, phone_country_code, phone_number, identifier }
router.post("/signup/init", handleSignupOtpInit);

// POST /api/auth/signup/verify
// body: { identifier, otp_code, first_name, last_name, email, phone_country_code, phone_number, password, role_ids, assigned_by }
router.post("/signup/verify", async (req, res) => {
  const {
    identifier,
    otp_code,
    email_otp,
    phone_otp,
    first_name,
    last_name,
    email,
    phone_country_code = "+91",
    phone_number,
    password,
    role_ids,
    assigned_by = null,
  } = req.body || {};

  const usingDualOtp = Boolean(email_otp && phone_otp);
  if (!usingDualOtp && (!identifier || !otp_code)) {
    return res.status(400).json({ success: false, message: "Provide email_otp and phone_otp, or identifier and otp_code" });
  }
  if (!first_name || !last_name || !email || !phone_number || !password) {
    return res.status(400).json({ success: false, message: "Missing required signup fields" });
  }
  if (!Array.isArray(role_ids) || role_ids.length === 0) {
    return res.status(400).json({ success: false, message: "role_ids must be a non-empty array" });
  }

  try {
    if (usingDualOtp) {
      const emailIdentifier = normalizeIdentifier(email);
      const phoneIdentifier = normalizePhoneIdentifier(phone_country_code, phone_number);

      const verifiedEmailOtp = await authDB.verifyOtpCode({
        identifier: emailIdentifier,
        otpCode: String(email_otp),
        purpose: OTP_PURPOSE.SIGNUP,
      });
      if (!verifiedEmailOtp) {
        return res.status(400).json({ success: false, message: "Invalid or expired email OTP" });
      }

      const verifiedPhoneOtp = await authDB.verifyOtpCode({
        identifier: phoneIdentifier,
        otpCode: String(phone_otp),
        purpose: OTP_PURPOSE.SIGNUP,
      });
      if (!verifiedPhoneOtp) {
        return res.status(400).json({ success: false, message: "Invalid or expired phone OTP" });
      }
    } else {
      const normalizedIdentifier = normalizeIdentifier(identifier);
      const verifiedOtp = await authDB.verifyOtpCode({
        identifier: normalizedIdentifier,
        otpCode: String(otp_code),
        purpose: OTP_PURPOSE.SIGNUP,
      });
      if (!verifiedOtp) {
        return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
      }
    }

    const existingUser = await authDB.findUserByEmailOrPhone({
      email: normalizeIdentifier(email),
      phoneCountryCode: phone_country_code,
      phoneNumber: phone_number,
    });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email or phone already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    await authDB.saveUserWithRoles(
      first_name,
      last_name,
      normalizeIdentifier(email),
      phone_country_code,
      phone_number,
      password_hash,
      role_ids,
      assigned_by
    );

    const createdUser = await authDB.findUserWithRoles({ email: normalizeIdentifier(email) });
    if (!createdUser) {
      return res.status(500).json({ success: false, message: "Failed to load created user" });
    }

    delete createdUser.password_hash;
    const tokens = await issueAuthTokens({ user: createdUser, req });

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

// POST /api/auth/forgot-password/init
// body: { identifier }
router.post("/forgot-password/init", async (req, res) => {
  const { identifier } = req.body || {};
  const normalizedIdentifier = normalizeIdentifier(identifier);
  if (!normalizedIdentifier) {
    return res.status(400).json({ success: false, message: "identifier is required" });
  }

  try {
    const user = await authDB.findUserByIdentifier({ identifier: normalizedIdentifier });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otpDelivery = await createAndSendOtp({
      identifier: normalizedIdentifier,
      purpose: OTP_PURPOSE.FORGOT_PASSWORD,
    });

    return res.json({
      success: true,
      message: "OTP sent successfully.",
      data: {
        identifier: normalizedIdentifier,
        purpose: OTP_PURPOSE.FORGOT_PASSWORD,
        expires_in_minutes: OTP_EXPIRY_MINUTES,
        delivery: otpDelivery.delivery,
        ...(otpDelivery.devOtp ? { dev_otp: otpDelivery.devOtp } : {}),
      },
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, message: err.message || "Failed to send forgot-password OTP" });
  }
});

// POST /api/auth/forgot-password/verify
// body: { identifier, otp_code }
router.post("/forgot-password/verify", async (req, res) => {
  const { identifier, otp_code } = req.body || {};
  const normalizedIdentifier = normalizeIdentifier(identifier);

  if (!normalizedIdentifier || !otp_code) {
    return res.status(400).json({ success: false, message: "identifier and otp_code are required" });
  }

  try {
    const verifiedOtp = await authDB.verifyOtpCode({
      identifier: normalizedIdentifier,
      otpCode: String(otp_code),
      purpose: OTP_PURPOSE.FORGOT_PASSWORD,
    });
    if (!verifiedOtp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    return res.json({
      success: true,
      message: "OTP verified successfully.",
      data: {
        identifier: normalizedIdentifier,
        purpose: OTP_PURPOSE.FORGOT_PASSWORD,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to verify OTP", error: err.message });
  }
});

// POST /api/auth/forgot-password/reset
// body: { identifier, new_password }
router.post("/forgot-password/reset", async (req, res) => {
  const { identifier, new_password } = req.body || {};
  const normalizedIdentifier = normalizeIdentifier(identifier);

  if (!normalizedIdentifier || !new_password) {
    return res.status(400).json({ success: false, message: "identifier and new_password are required" });
  }

  try {
    const verifiedOtp = await authDB.getLatestVerifiedOtp({
      identifier: normalizedIdentifier,
      purpose: OTP_PURPOSE.FORGOT_PASSWORD,
    });
    if (!verifiedOtp) {
      return res.status(400).json({ success: false, message: "OTP verification required before password reset" });
    }

    const user = await authDB.findUserByIdentifier({ identifier: normalizedIdentifier });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const passwordHash = await bcrypt.hash(new_password, 10);
    await authDB.updatePasswordByIdentifier({
      identifier: normalizedIdentifier,
      passwordHash,
    });
    await authDB.expireVerifiedOtp({
      identifier: normalizedIdentifier,
      purpose: OTP_PURPOSE.FORGOT_PASSWORD,
    });

    return res.json({ success: true, message: "Password reset successful." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to reset password", error: err.message });
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

