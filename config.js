
var config = {
  'fbOauth2AuthURI': 'https://www.fitbit.com/oauth2/authorize',
  'fbOauth2RefreshURI': 'https://api.fitbit.com/oauth2/token'
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
