!(function(d3)
{
  var dataHandler = {};
  dataHandler.heartRate = {};
  var _dateFormat = d3.time.format('%Y-%m-%d');
  var _timeFormat = d3.time.format('%H:%M:%S');
  var _getHeartRate1d = function(dateStr, cb)
  {
    d3.json('/api/heartrate/' + dateStr, cb);
  }

  dataHandler.getHeartRate = function(from, to, cb)
  {
    if ( from >= to )
    {
      return cb(null, dataHandler.heartRate);
    }
    if ( dataHandler.heartRate[_dateFormat(from)] === void 0 )
    {
      _getHeartRate1d(_dateFormat(from), function(err, dat)
      {
        if (err != null)
        {
          console.log(err);
          return;
        }
        if (dat['activities-heart-intraday'] === void 0 || dat['activities-heart-intraday']['dataset'] === void 0)
        {
          console.log('invalid data');
          return;
        }
        var rec = d3.set();
        dataHandler.heartRate[_dateFormat(from)] = [];
        dat['activities-heart-intraday']['dataset'].forEach(function(d)
        {
          rec.add(d.time);
          dataHandler.heartRate[_dateFormat(from)].push(d);
        });
        var s = _timeFormat.parse('00:00:00').getTime();
        for ( var i = s; i < s+86400000; i+=60000 )
        {
          if (!rec.has(_timeFormat(new Date(i))))
          {
            dataHandler.heartRate[_dateFormat(from)].push( {time: _timeFormat(new Date(i)), value: null} );
          };
        }
        dataHandler.getHeartRate( new Date(from.getTime() + 86400000), to, cb );
      });
    }
    else
    {
      dataHandler.getHeartRate( new Date(from.getTime() + 86400000), to, cb );
    }
  }
  if (typeof define === "function" && define.amd) define(dataHandler); else if (typeof module === "object" && module.exports) module.exports = dataHandler;
  this.dataHandler = dataHandler;
}(d3));
