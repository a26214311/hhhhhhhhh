var MongoClient = require('mongodb').MongoClient;
var mongourl = 'mongodb://localhost:27017/db';
module.exports = {
  MongoClient:MongoClient,
  mongourl:mongourl
};