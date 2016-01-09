var express = require('express');
var router = express.Router();

var fitbit = require("fitbit-node");
var config = require('../config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/fitbit', function(req, res, next)
{
  res.json({});
});

module.exports = router;
