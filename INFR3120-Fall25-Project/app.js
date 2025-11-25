var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//mongoose connection lines
require('dotenv').config();
require("./MongoConfig/mongoDB-Config")

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const storeRouter = require('./routes/store');
<<<<<<< HEAD
const cityRouter = require('./routes/city');
=======
>>>>>>> fabbc98787dfc7cb3f7a0c51734ccf75ddfbc2d8
const tournamentRouter = require('./routes/tournament');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/store', storeRouter);
<<<<<<< HEAD
app.use('/findastore', cityRouter);
=======
>>>>>>> fabbc98787dfc7cb3f7a0c51734ccf75ddfbc2d8
app.use('/tournament', tournamentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
