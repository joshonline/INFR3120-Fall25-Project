var express = require('express');
var router = express.Router();
var resumeController = require('../controllers/resumeController');

/* home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'CV', buttonText: 'Get Started' });
// });

/* create resume page */
router.get('/create', function(req, res, next) {
  res.redirect('/resume/new', {title: 'Create Resume'});
})

/* LANDING-PAGE (Controller) */
router.get("/", resumeController.home_page);

module.exports = router;
