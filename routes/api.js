var express = require('express');
var router = express.Router();

var config = require('../config');

var passport = require('passport');
var FitbitStrategy = require( 'passport-fitbit-oauth2' ).FitbitOAuth2Strategy;

var https = require('https');
var querystring = require('querystring');

passport.use(new FitbitStrategy(
  {
    clientID:     config.fbOauth2ClientId,
    clientSecret: config.fbConsumerSecret,
    callbackURL: "http://localhost:3000/api/auth/callback"
  },
  function(accessToken, refreshToken, profile, done)
  {
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    return done(null, profile);
  }
));

var authCheck = function(req, res, next)
{
  if (req.session.passport === void 0 || req.session.passport.user === void 0)
  {
    return res.sendStatus(401);
  }
  next();
}

router.get('/heartrate/:date(\\d{4}-\\d{2}-\\d{2})', authCheck, function(req, res, next)
{
  var options = {
    host: config.apiRoot,
    path: config.heartrate1dURI(req.params.date),
    headers:{
      Authorization: 'Bearer ' + req.session.passport.user.accessToken
    },

  };
  var req2 = https.request(options, function(res2)
  {
    var body = '';
    res2.on('data', function (chunk) {
      body += chunk;
    });
    res2.on('end', function() {
      if (res2.statusCode !== 200)
      {
        var err = new Error(res2.statusMessage);
        err.status = res2.statusCode;
        return res.sendStatus(err.status).send(err);
      }
      try {
        body = JSON.parse(body);
      } catch (e) {
        e.status = 500;
        return res.sendStatus(e.status).send(e);
      }
      return res.json(body);
    })
  });
  req2.on('error', function(e) {
    return res.send(e, null);
  });
  req2.end();
});

router.get('/auth', passport.authenticate('fitbit', { scope: ['activity','heartrate','location','profile'] }));

router.get('/auth/callback', passport.authenticate( 'fitbit', {
  successRedirect: '/',
  failureRedirect: '/'
}));

router.get('/auth/logout', function(req,res,next)
{
  if (req.session.passport !== void 0 && req.session.passport.user !== void 0)
  {
    req.logout();
  }
  res.redirect('/');
});

module.exports = router;
