
var config = {
  fbOauth2AuthURI: 'https://www.fitbit.com/oauth2/authorize',
  fbOauth2RefreshURI: 'https://api.fitbit.com/oauth2/token',
  apiRoot: 'api.fitbit.com',
  heartrate1dURI: function(startDate){return '/1/user/-/activities/heart/date/'+ startDate +'/1d/1min.json'}
};

try
{
  var f = require('./config.json');
  Object.keys(f).forEach(function(d)
  {
    config[d] = f[d];
  });
}
catch (e)
{
}

module.exports = config;
