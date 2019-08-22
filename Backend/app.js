var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var mysql = require('mysql');
var fileUpload = require('express-fileupload')
var config = require('./config/main')
var mongoose = require('mongoose')
var passport = require('passport')

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var topicRouter = require('./routes/topic');
var questionRouter = require('./routes/question');
var answerRouter = require('./routes/answer');
var messageRouter = require('./routes/message');

// var studentRouter = require('./routes/student')
// var facultyRouter = require('./routes/faculty')
// var courseRouter = require('./routes/course')
// var assignmentRouter = require('./routes/assignment')

require('./config/passport')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(fileUpload());

// For CORS
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(session({
  secret              : 'secret',
  httponly            : false,
  resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
  saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
  duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
  activeDuration      :  5 * 60 * 1000
}));
//Allow Access Control
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

mongoose.connect(config.database,{useNewUrlParser: true,
  poolSize:100
})
  .then(() => console.log("Connected to Mongo"))
  .catch((err) => console.log("Error is::::::::::::::::::::::::::::::::::::::",err))

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/topic', topicRouter);
app.use('/question', questionRouter);
app.use('/answer', answerRouter);
app.use('/message', messageRouter);
// app.use('/student',studentRouter)
// app.use('/faculty',facultyRouter)
// app.use('/course',courseRouter)
// app.use('/assignment',assignmentRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(passport.initialize());
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
