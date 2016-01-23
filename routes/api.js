var express = require('express');
var router = express.Router();

var config = require('../config');

var passport = require('passport');
var FitbitStrategy = require( 'passport-fitbit-oauth2' ).FitbitOAuth2Strategy;

passport.use(new FitbitStrategy(
  {
    clientID:     config.fbOauth2ClientId,
    clientSecret: config.fbConsumerSecret,
    callbackURL: "http://localhost:3000/api/auth/callback"
  },
  function(accessToken, refreshToken, profile, done)
  {
    passport.session.fitbitAccessToken = accessToken;
    passport.session.fitbitRefreshToken = refreshToken;
    return done(null, profile);
  }
));

router.get('/heartrate', function(req, res, next)
{

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
