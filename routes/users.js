var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var MongoClient=db.MongoClient;
var mongourl = db.mongourl;
var URL = require('url');

var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/*', function (req, res) {
  var arg = URL.parse(req.url,true).query;
  var path = req.path.substring(1);
  var body = req.body;
  handleUserRequest(path,body,res);
});

module.exports = router;



function handleUserRequest(path,data,res){
  if(path=="register"){
    register(data,res);
  }else if(path=="login"){
    login(data,res);
  }else{
    ret = {r:100};
    res.send(JSON.stringify(ret));
  }
}

function register(data,res){
  var em = data.em;
  var pwd = data.pwd;
  var name = data.n;
  var query = {email:em};
  var nowts = new Date().getTime();
  MongoClient.connect(mongourl, function(err, db) {
    var cl_vfy = db.collection('cl_vfy');
    cl_vfy.findOne(query, function(err, vfydata) {
      if(vfydata==undefined){
        var cl_index = db.collection('cl_index');
        cl_index.findAndModify({}, [], {$inc:{d:1}}, {new:true}, function(err, indexdata) {
          var newid = indexdata.value.d;
          console.log(indexdata.value);
          var newvfydata = {'_id':newid,email:em,pwd:pwd,ts:nowts};
          cl_vfy.insertOne(newvfydata,function(err, insertvfyresult){
            var cl_user = db.collection('cl_user');
            initUserData = {'_id':newid,name:name,resourse:{},lastlogin:nowts,score:0,diamond:0}
            cl_user.insertOne(initUserData,function(err, insertuserresult){
              var ret = initUserData;
              ret.r=0;
              var session = createsession(id);
              ret.s=session;
              db.close();
              res.send(JSON.stringify(ret));
            });
          });
        })
      }else{
        var id = vfydata._id;
        var pwddata = vfydata.pwd;
        if(pwd==pwddata){
          handlelogin(db,id,res);
        }else{
          db.close();
          ret = {"r":119};
          res.send(JSON.stringify(ret));
        }
      }
    });
  });
}

function login(data,res){
  var em = data.em;
  var pwd = data.pwd;
  var query = {email:em};
  var nowts = new Date().getTime();
  MongoClient.connect(mongourl, function(err, db) {
    var cl_vfy = db.collection('cl_vfy');
    cl_vfy.findOne(query, function(err, vfydata) {
      if(vfydata==undefined){
        ret = {"r":119};
        res.send(JSON.stringify(ret));
      }else{
        var id = vfydata._id;
        var pwddata = vfydata.pwd;
        if(pwd==pwddata){
          handlelogin(db,id,res);
        }else{
          db.close();
          ret = {"r":119};
          res.send(JSON.stringify(ret));
        }
      }
    });
  });
}


function handlelogin(db,id,res){
  var cl_user = db.collection('cl_user');
  var query = {_id:id};
  cl_user.findOne(query, function(err, userdata) {
    var ret = userdata;
    ret.r=0;
    var session = createsession(id);
    ret.s=session;
    db.close();
    res.send(JSON.stringify(ret));
  });
}



function createsession(id){
  var key = 987654321;
  return parseInt(id)^key;
}
