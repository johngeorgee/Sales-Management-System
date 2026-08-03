// middlewares/isDashboardAdmin.js

function isDashboardAdmin(req, res, next) {
  // checkToken should have already set req.user
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Assuming the JWT payload includes something like { id, role: "admin" }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: admin access required" });
  }

  next();
}

module.exports = isDashboardAdmin;