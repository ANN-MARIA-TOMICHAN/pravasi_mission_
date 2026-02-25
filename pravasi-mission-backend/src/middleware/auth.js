// Replace with real JWT verification later
function requireAuth(req, res, next) {
  // Example: set user id from header for now
  const userId = req.headers["x-user-id"];
  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

  req.user = { id: userId };
  next();
}

module.exports = { requireAuth };
