var express = require('express');
var admin = require('firebase-admin');
var app = express();
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(3000, function () {
  console.log('Application running on port 3000!');
});
