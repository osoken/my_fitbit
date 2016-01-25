!(function(d3)
{
  var dataHandler = {};
  var requested = d3.set();
  var ready = d3.set();
  dataHandler.heartRateRaw = {};
  dataHandler.heartRate = {};
  dataHandler.heartRateExtent = [0,1];
  var _dateFormat = d3.time.format('%Y-%m-%d');
  var _timeFormat = d3.time.format('%H:%M:%S');
  var _getHeartRate1d = function(dateStr, cb)
  {
    if (!requested.has(dateStr))
    {
      requested.add(dateStr);
      d3.json('/api/heartrate/' + dateStr, function(err,dat)
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
        dataHandler.heartRateRaw[dateStr] = [];
        dat['activities-heart-intraday']['dataset'].forEach(function(d)
        {
          d.time = _timeFormat.parse(d.time);
          rec.add(d.time);
          dataHandler.heartRateRaw[dateStr].push(d);
        });
        var s = _timeFormat.parse('00:00:00').getTime();
        for ( var i = s; i < s+86400000; i+=60000 )
        {
          if (!rec.has(new Date(i)))
          {
            dataHandler.heartRateRaw[dateStr].push( {time: new Date(i), value: null} );
          };
        }
        dataHandler.heartRateRaw[dateStr].sort(function(a,b){return (a.time < b.time)?-1:1;});
        var len = dataHandler.heartRateRaw[dateStr].length;
        var unit = 2;
        dataHandler.heartRate[dateStr] = d3.range( 0, len, unit ).map(function(d)
        {
          var ave = 0.0;
          var cnt = 0;
          for (var i = d; i < d+unit; ++i)
          {
            if (dataHandler.heartRateRaw[dateStr][i].value != null)
            {
              ave += dataHandler.heartRateRaw[dateStr][i].value;
              ++cnt;
            }
          }
          return {
            time: dataHandler.heartRateRaw[dateStr][d].time,
            value: (cnt===0)?null:(ave/cnt)
          };
        });
        dataHandler.heartRateExtent[1] = Math.max( dataHandler.heartRateExtent[1], d3.max(dataHandler.heartRate[dateStr], function(d){return d.value;}) );
        ready.add(dateStr);
        cb(null, dataHandler.heartRate[dateStr]);
      });
    }
    else
    {
      if (!ready.has(dateStr))
      {
        setTimeout(_getHeartRate1d, 200, dateStr, cb);
      }
      else
      {
        cb(null, dataHandler.heartRate[dateStr]);
      }
    }
  }

  dataHandler.getHeartRate = function(from, to, cb)
  {
    if ( from >= to )
    {
      return cb(null, dataHandler.heartRate);
    }
    if ( !ready.has(_dateFormat(from)) )
    {
      _getHeartRate1d(_dateFormat(from), function(err, dat)
      {
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
