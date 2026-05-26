const jwt = require("jsonwebtoken");

function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Admin token required." });
  }

  try {
    const secret = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || "dev_admin_secret";
    const decoded = jwt.verify(token, secret);
    req.admin = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired admin token." });
  }
}

module.exports = { requireAdminAuth };

