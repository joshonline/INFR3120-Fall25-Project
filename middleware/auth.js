// middleware/auth.js

// Check if user is authenticated
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
};

// Check if user is guest (not authenticated)
exports.ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/resumes");
  }
  next();
};
