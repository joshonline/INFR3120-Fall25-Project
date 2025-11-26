const User = require("../models/user");
const passport = require("passport");

// GET users/register
exports.register_get = (req, res) => {
  res.render("users/register", { title: "Register", error: null });
};

// POST users/register
exports.register_post = async (req, res) => {
  const { username, email, password, password2 } = req.body;

  // Validation
  if (!username || !email || !password || !password2) {
    return res.render("users/register", {
      title: "Register",
      error: "Please fill in all fields",
    });
  }

  if (password !== password2) {
    return res.render("users/register", {
      title: "Register",
      error: "Passwords do not match",
    });
  }

  if (password.length < 6) {
    return res.render("users/register", {
      title: "Register",
      error: "Password must be at least 6 characters",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      return res.render("users/register", {
        title: "Register",
        error: "Username or email already exists",
      });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    // Auto-login after registration
    req.login(newUser, (err) => {
      if (err) {
        console.error(err);
        return res.redirect("/users/login");
      }
      res.redirect("/resumes");
    });
  } catch (err) {
    console.error(err);
    res.render("users/register", {
      title: "Register",
      error: "Error creating account. Please try again.",
    });
  }
};

// Get users/login
exports.login_get = (req, res) => {
  res.render("users/login", {
    title: "Login",
    error: req.flash("error"),
  });
};

// POST users/login
exports.login_post = passport.authenticate("local", {
  successRedirect: "/resumes",
  failureRedirect: "/users/login",
  failureFlash: true,
});

// POST users/logout
exports.logout = (req, res) => {
  //TASK: Add session destrution on logout
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect("/");
  });
};

// GET /profile
exports.profile_get = (req, res) => {
  try {
    res.render("users/profile", { title: "Profile Page", error: error });
  } catch (err) {}
};
// POST /profile
