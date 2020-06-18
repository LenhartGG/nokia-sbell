var createError = require('http-errors');
var express = require('express');
var ejs = require('ejs');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var resultSearchRouter = require('./routes/resultSearch');
var checkInRouter = require('./routes/checkin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, './views'));
app.set('css', path.join(__dirname, './public/css'));
app.set('lib', path.join(__dirname, './public/libs'));
app.set('javascripts', path.join(__dirname, './public/javascripts'));
app.set('fonts', path.join(__dirname, './public/fonts'));
app.set('images', path.join(__dirname, './public/images'));
app.set('controller', path.join(__dirname, './public/controller'));
app.set('download', path.join(__dirname, './public/download'));
app.set('upload', path.join(__dirname, './upload'));
// app.set('view engine', 'ejs');
app.engine("html", ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'upload')));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

//设置跨域访问
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With, tokenId");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header("X-Powered-By", ' 3.2.1')
  next();
});

// //登录拦截器
// app.use(function (req, res, next) {
//   var path = req.path;
//   var headers = req.headers;
//   if ( path != "/" && path != '/users' && path != '/logout' && !headers["Authorization"] ) {
//         return res.redirect("/users");
//   }
//   next();
// });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/resultSearch', resultSearchRouter);
app.use('/checkin', checkInRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   console.log(err);
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


// when status is 404, error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if( 404 === err.status  ){
      res.format({
          'text/plain': () => {
              res.send({message: 'not found Data'});
          },
          'text/html': () => {
              res.render('404.html');
          },
          'application/json': () => {
              res.send({message: 'not found Data'});
          },
          'default': () => {
              res.status(406).send('Not Acceptable');
          }
      })
  }

  // when status is 500, error handler
  if(500 === err.status) {
      return res.send({message: 'error occur'});
  }
});

module.exports = app;
