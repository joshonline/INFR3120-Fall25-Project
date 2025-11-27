// Check if user is authenticated
exports.ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/users/login");
};

// Check if user is guest (not authenticated)
exports.ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/resumes");
  }
  next();
};
