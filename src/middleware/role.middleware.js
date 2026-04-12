export const requireRole = (...roles) => {
  return (req, res, next) => {
    // req.user comes from authMiddleware
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    next();
  };
};