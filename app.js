var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var URL = require('url');
var MongoClient = require('mongodb').MongoClient;
var mongourl = 'mongodb://localhost:27019/db_BG';
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', function (req, res) {
  res.send('');
});

var users = require('./routes/users');
app.use('/users', users);

app.get('/*', function (req, res) {
  var arg = URL.parse(req.url,true).query;
  handlereq(req.path.substring(1),arg,req,res);
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.listen('3333', function () {
  console.log('server started');
});




function handlereq(path,arg,req,res){
  try{
    var ret = {"r":100};
    if(path=='user'){

    }else{
      ret = {"r":100};
      res.send(JSON.stringify(ret));
    }
  }catch(e){
    console.log(e);
    var ret = {"r":121};
    res.send(JSON.stringify(ret));
  }
}















