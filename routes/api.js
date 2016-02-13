var express = require('express');
var router = express.Router();

var config = require('../config');

var passport = require('passport');
var FitbitStrategy = require( 'passport-fitbit-oauth2' ).FitbitOAuth2Strategy;
var fs = require('fs');

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
    res.sendStatus(401).end();
  }
  else
  {
    next();
  }
}

var makeSureCacheDir = function(req,res,next)
{
  fs.access('cache', fs.F_OK, function(err)
  {
    if (err != null)
    {
      fs.mkdir('cache', function(err)
      {
        if (err != null)
        {
          res.sendStatus('500').end();
        }
        else {
          next();
        }
      });
    }
    else
    {
      next();
    }
  });
}

var createCacheName = function(req)
{
  return 'cache/' + req.session.passport.user.id+'_'+req.params.date+'.json';
}

var checkCache = function(req, res, next)
{
  fs.access( createCacheName(req), fs.F_OK, function(err)
  {
    if (err != null)
    {
      next();
    }
    else
    {
      fs.readFile(createCacheName(req), 'utf-8', function(err,dat)
      {
        if (err != null)
        {
          next();
        }
        else
        {
          return res.end(dat);
        }
      });
    }
  });
}

router.get('/heartrate/:date(\\d{4}-\\d{2}-\\d{2})', authCheck, makeSureCacheDir, checkCache, function(req, res, next)
{
  console.log('requested!');
  var options = {
    host: config.apiRoot,
    path: config.heartrate1dURI(req.params.date),
    headers:{
      Authorization: 'Bearer ' + req.session.passport.user.accessToken
    }
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
        err.statusCode = res2.statusCode;
        return res.end(err);
      }
      fs.writeFile(createCacheName(req), body, function(err)
      {
        return res.end(body);
      });
    })
  });
  req2.on('error', function(e) {
    return res.send(e, null).end();
  });
  req2.end();
});

router.get('/activities-list', authCheck, function(req, res, next)
{
  var options = {
    host: config.apiRoot,
    path: '/1/user/-/activities.json',
    headers:{
      Authorization: 'Bearer ' + req.session.passport.user.accessToken
    }
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
        err.statusCode = res2.statusCode;
        return res.end(err);
      }
      fs.writeFile(createCacheName(req), body, function(err)
      {
        return res.end(body);
      });
    })
  });
  req2.on('error', function(e) {
    return res.send(e, null).end();
  });
  req2.end();
});

router.get('/test', authCheck, function(req, res, next)
{
  var options = {
    host: config.apiRoot,
    path: config.activityURI(1653997983),
    headers:{
      Authorization: 'Bearer ' + req.session.passport.user.accessToken
    }
  };
  console.log(options);
  var req2 = https.request(options, function(res2)
  {
    var body = '';
    res2.on('data', function (chunk) {
      console.log(body);
      body += chunk;
    });
    res2.on('end', function() {
      if (res2.statusCode !== 200)
      {
        var err = new Error(res2.statusMessage);
        err.statusCode = res2.statusCode;
        return res.end(err);
      }
      fs.writeFile(createCacheName(req), body, function(err)
      {
        return res.end(body);
      });
    })
  });
  req2.on('error', function(e) {
    return res.send(e, null).end();
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
