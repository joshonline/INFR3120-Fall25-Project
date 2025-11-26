var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");
// GET users/
router.get("/", (req, res) => {
  visits = req.session.visits;
  if (!visits) {
    visits = 0;
  }
  visits++;
  res.send(`You have visited ${visits} times`);
});

// REGISTRATION
router.post("/register", userController.register_get);
router.post("/register", userController.register_post);

// LOGIN
router.get("/login", userController.login_get);
router.post("/login", userController.login_post);

// LOGOUT
router.get("/logout", userController.logout);

module.exports = router;
