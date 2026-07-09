const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error(`Access denied. Requires role: ${roles.join(" or ")}`));
    }
    next();
  };
};

module.exports = { authorize };
