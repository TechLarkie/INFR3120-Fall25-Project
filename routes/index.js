var express = require('express');
var router = express.Router();

/* the path to home :) */
router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'Home' });
});

/* this one tells u where to find stores near u  */
router.get('/store', function(req, res, next) {
  res.render('store.ejs', { title: 'Store' });
});

/* this one tells u where to find tournaments */
router.get('/tournament', function(req, res, next) {
  res.render('tournament.ejs', { title: 'Tournaments' });
});

module.exports = router;
