var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'DrawThree' });
});
router.get('/store', function(req, res, next) {
  res.render('store', { title: 'DrawThree | Find a Store' });
});
router.get('/tournament', function(req, res, next) {
  res.render('tournament', { title: 'DrawThree \ Tournaments' });
});

module.exports = router;
