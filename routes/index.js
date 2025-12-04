// var express = require('express');
// var router = express.Router();
// var resumeController = require('../controllers/resumeController');

// /* home page. */
// // router.get('/', function(req, res, next) {
// //   res.render('index', { title: 'CV', buttonText: 'Get Started' });
// // });

// /* create resume page */
// router.get('/create', function(req, res, next) {
//   res.redirect('/resumes/new', {title: 'Create Resume'});
// })

// /* LANDING-PAGE (Controller) */
// router.get("/", resumeController.home_page);

// module.exports = router;

// routes/index.js
const express = require("express");
const router = express.Router();

// GET /api - API info
router.get("/", function (req, res) {
  res.json({
    message: "Resume Builder API",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      resumes: "/api/resumes",
    },
  });
});

module.exports = router;
