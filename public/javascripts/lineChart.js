!(function(d3)
{
  var lineChart = {};
  var _timeFormat = d3.time.format('%H:%M:%S');
  var _dateFormat = d3.time.format('%Y-%m-%d');
  lineChart.selection = null;
  lineChart.clear = function()
  {
    if (lineChart.selection != null)
    {
      lineChart.selection.select('*').remove();
      lineChart.selection = null;
    }
  }
  lineChart.init = function(root, from, to)
  {
    lineChart.selection = root;
    var width = root.node().getBoundingClientRect().width;
    var height = root.node().getBoundingClientRect().height;
    var svg = lineChart.selection.append('svg')
      .attr({width: width, height: height});

    var plotLayer = svg.append('g');
    var axisLayer = svg.append('g');
    var xScale = d3.time.scale().range([0,width]).domain([_timeFormat.parse('00:00:00'), _timeFormat.parse('23:59:59')]);
    var yScale = d3.scale.linear().range([height, 0]).domain([0,100]);
    var area = d3.svg.area()
      .x(function(d,i) { return xScale(d.time);})
      .y0(function(d,i) { return yScale(0);})
      .y1(function(d,i) { return (d.value==null)?yScale(50):yScale(d.value);});
    d3.dataHandler.getHeartRate(from, to, function(err,dat)
    {
      if (err != null)
      {
        svg.remove();
        root.append('div').text(err);
        return;
      }
      var days = d3.keys(dat);
      if (days.length == 0)
      {
        svg.remove();
        root.append('div').text('empty data');
        return;
      }
      yScale.domain(d3.dataHandler.heartRateExtent)
      var colorPalette = d3.scale.ordinal().range(d3.range(0,360,360/days.length).map(function(d){return ""+d3.hsl(d, 1.0, 0.5);})).domain(d3.keys(dat));
      plotLayer.selectAll('path')
        .data(d3.entries(dat))
        .enter().append('path')
        .each(function(data)
        {
          d3.select(this).attr('fill', colorPalette(data.key)).attr('opacity', 0.2)
            .datum(data.value).attr('d',area);
        });

    });
  }
  d3.lineChart = lineChart;
}(d3));
