const { verifyAccessToken } = require("../utils/jwt");

function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    console.log("auth==",auth)
    const [type, token] = auth.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ success: false, message: "Missing Bearer token" });
    }

    const payload = verifyAccessToken(token);
    req.user = payload; // { sub, roles, ... }
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid/expired token" });
  }
}

module.exports = { requireAuth };
