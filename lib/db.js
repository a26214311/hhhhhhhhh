var MongoClient = require('mongodb').MongoClient;
var mongourl = 'mongodb://localhost:27020/db';
module.exports = {
  MongoClient:MongoClient,
  mongourl:mongourl
};