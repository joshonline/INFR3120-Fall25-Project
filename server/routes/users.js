// var express = require("express");
// var router = express.Router();
// const userController = require("../controllers/userController");
// const { requireAuth, requireGuest } = require("../middleware/auth");

// // GET users/
// // router.get("/", (req, res) => {
// //   let visits = req.session.visits;
// //   if (!visits) {
// //     visits = 0;
// //   }
// //   visits++;
// //   // res.send(`You have visited ${visits} times`);
// //   res.redirect('/login')
// // });

// // REGISTRATION
// // router.get("/register", userController.register_get);
// router.post("/register", userController.register_post);

// // LOGIN
// // router.get("/login", userController.login_get);
// router.post("/login", userController.login_post);

// // LOGOUT
// // router.get("/logout", requireAuth, userController.logout);
// router.post("/logout", requireAuth, userController.logout);
// router.get("/profile", requireAuth, userController.getProfile);
// router.put("/profile", requireAuth, userController.updateProfile);

// module.exports = router;

//------------------------------------------------

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { requireAuth, requireGuest } = require("../middleware/auth");

// Public routes (no authentication required)
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes (authentication required)
router.post("/logout", requireAuth, userController.logout);
router.get("/profile", requireAuth, userController.getProfile);
router.put("/profile", requireAuth, userController.updateProfile);
router.put('/password', requireAuth, userController.changePassword);

module.exports = router;