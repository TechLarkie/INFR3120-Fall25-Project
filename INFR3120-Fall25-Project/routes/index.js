var express = require('express');
var router = express.Router();

/*requiring the models for store, tournament and player */
const Store = require("../models/Store");
const Tournament = require("../models/Tournament");
const Player = require("../models/Player");


/* GET Home Page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'DrawThree' });
});

/*GET Store Page */
//router.get('/store', function(req, res, next) {
  //res.render('store', { title: 'DrawThree | Find a Store' });
//});

/*Get Tournament Page */
//router.get('/tournament', function(req, res, next) {
  //res.render('tournament', { title: 'DrawThree \ Tournaments' });
//});

module.exports = router;
