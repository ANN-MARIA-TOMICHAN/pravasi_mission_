const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const crypto = require("crypto");
const authDB = require("../repos/auth.db");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/jwt");
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

    return authDB.saveUserWithRoles(first_name,
      last_name,
      email,
      phone_country_code,
      phone_number,
      password_hash,
      role_ids,
      assigned_by,
      res);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Signup failed", error: err.message });
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

    // Build JWT payload
    const roles = (user.roles || []).map((r) => r.role_code);
    const accessToken = signAccessToken({
      sub: user.id,
      roles,
      email: user.email,
      name:`${user.first_name} ${user.last_name}`,
      mobile:`${user.phone_country_code}-${user.phone_number}`
    });

    const refreshToken = signRefreshToken({ sub: user.id });

    // Store refresh token hash in DB
    const hours = Number(process.env.JWT_REFRESH_TTL_DAYS || 4);
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
    await authDB.saveRefreshToken({
      userId: user.id,
      tokenHash: sha256(refreshToken),
      expiresAt,
      userAgent: req.headers["user-agent"],
      ip: getClientIp(req),
    });

    // remove password_hash from response
    delete user.password_hash;

    return res.json({
      success: true,
      data: {
        user,
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: "Bearer",
        expires_in: process.env.JWT_ACCESS_TTL || "15m",
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
    const hours = Number(process.env.JWT_REFRESH_TTL_DAYS || 4);
    const newExpiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

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

