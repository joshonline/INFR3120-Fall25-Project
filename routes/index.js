var express = require('express');
var router = express.Router();

/* home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CV', buttonText: 'Get Started' });
});

/* create resume page */
router.get('/create', function(req, res, next) {
  res.render('create', {title: 'Create Resume'});
})

module.exports = router;
