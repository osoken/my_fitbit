var express = require('express');
var router = express.Router();

var config = require('../config');
var https = require('https');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.passport === void 0 || req.session.passport.user === void 0)
  {
    res.render('index', { title: 'Express' });
  }
  else
  {
    res.render('index', { title: 'Fitbit'});
  }
});

module.exports = router;
