const jwt = require("jsonwebtoken");

function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TTL || "15m",
  });
}

function signRefreshToken(payload) {
  // keep refresh TTL long; expiry also tracked in DB
  const days = Number(process.env.JWT_REFRESH_TTL_DAYS || 30);
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: `${days}d`,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
