!(function(d3)
{
  var dataHandler = {};
  dataHandler.heartRateRaw = {};
  dataHandler.heartRate = {};
  dataHandler.heartRateExtent = [0,1];
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
      return cb(null, dataHandler.heartRateRaw);
    }
    if ( dataHandler.heartRateRaw[_dateFormat(from)] === void 0 )
    {
      _getHeartRate1d(_dateFormat(from), function(err, dat)
      {
        if (err != null)
        {
          return cb(err,null);
        }
        if (dat['activities-heart-intraday'] === void 0 || dat['activities-heart-intraday']['dataset'] === void 0)
        {
          return cb(new Error('invalid data'),null);
        }
        var rec = d3.set();
        dataHandler.heartRateRaw[_dateFormat(from)] = [];
        dat['activities-heart-intraday']['dataset'].forEach(function(d)
        {
          d.time = _timeFormat.parse(d.time);
          rec.add(d.time);
          dataHandler.heartRateRaw[_dateFormat(from)].push(d);
        });
        var s = _timeFormat.parse('00:00:00').getTime();
        for ( var i = s; i < s+86400000; i+=60000 )
        {
          if (!rec.has(_timeFormat(new Date(i))))
          {
            dataHandler.heartRateRaw[_dateFormat(from)].push( {time: new Date(i), value: null} );
          };
        }
        dataHandler.heartRateRaw[_dateFormat(from)].sort(function(a,b){return (a.time < b.time)?-1:1;});
        dataHandler.heartRateExtent[1] = Math.max( dataHandler.heartRateExtent[1], d3.max(dataHandler.heartRateRaw[_dateFormat(from)], function(d){return d.value;}) );
        dataHandler.getHeartRate( new Date(from.getTime() + 86400000), to, cb );
      });
    }
    else
    {
      dataHandler.getHeartRate( new Date(from.getTime() + 86400000), to, cb );
    }
  }
  d3.dataHandler = dataHandler;
}(d3));
