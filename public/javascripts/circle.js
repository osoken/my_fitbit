!(function(d3)
{
  var circle = {};
  var _timeFormat = d3.time.format('%H:%M:%S');
  var _dateFormat = d3.time.format('%Y-%m-%d');
  var _hourFormat = d3.time.format('%H');
  circle.selection = null;
  circle.clear = function()
  {
    if (circle.selection != null)
    {
      circle.selection.select('*').remove();
      circle.selection = null;
    }
  }
  circle.init = function(root, from, to)
  {
    circle.selection = root;
    var width = root.node().getBoundingClientRect().width;
    var height = root.node().getBoundingClientRect().height;
    var svg = circle.selection.append('svg')
      .attr({width: width, height: height});
    var radius = Math.min(width,height)/2;
    var plotLayer = svg.append('g').attr('transform','translate('+(width/2)+','+(height/2)+')');
    var axisLayer = svg.append('g').attr('transform','translate('+(width/2)+','+(height/2)+')');
    var xScale = d3.time.scale().range([-Math.PI/2,3/2*Math.PI]).domain([_timeFormat.parse('00:00:00'), new Date(_timeFormat.parse('00:00:00').getTime()+86400000)]);
    var yScale = d3.scale.linear().range([0, radius]).domain([0,100]);
    var centerScale = d3.scale.ordinal().rangePoints([radius-width/2,width/2-radius]);
    var line = d3.svg.line()
      .x(function(d,i) { return (d.value==null)?yScale(50)*Math.cos(xScale(d.time)):yScale(d.value)*Math.cos(xScale(d.time));})
      .y(function(d,i) { return (d.value==null)?yScale(50)*Math.sin(xScale(d.time)):yScale(d.value)*Math.sin(xScale(d.time));});
    d3.dataHandler.getHeartRate(from, to, function(err,dat)
    {
      console.log(dat);
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
      centerScale.domain(days);
      yScale.domain(d3.dataHandler.heartRateExtent)
      var colorPalette = d3.scale.ordinal().range(d3.range(0,360,360/days.length).map(function(d){return ""+d3.hsl(d, 1.0, 0.5);})).domain(d3.keys(dat));
      plotLayer.selectAll('g')
        .data(d3.entries(dat))
        .enter().append('g')
        .attr('transform', function(d){console.log(d);return 'translate('+centerScale(d.key)+',0)';})
        .append('path')
        .each(function(data)
        {
          d3.select(this).attr('fill', colorPalette(data.key)).attr('opacity', 0.5)
            .datum(data.value).attr('d',line);
        });
/*
      axisLayer.selectAll('text')
        .data( d3.range( _timeFormat.parse('00:00:00').getTime(), new Date( _timeFormat.parse('00:00:00').getTime() + 86400000 ).getTime(), 3600000 ).map(function(d){return new Date(d);}) )
        .enter().append('text')
        .text(function(d){return _hourFormat(d);})
        .attr('x', function(d){return (radius-12) * Math.cos(xScale(d));})
        .attr('y', function(d){return (radius-12) * Math.sin(xScale(d));})
        .attr('text-anchor', 'middle' )
        .attr('fill', 0)
        .attr('stroke', 'none')
        .attr('font-size', 10)
        .attr('font-family', 'Meiryo');
*/
    });
  }
  d3.circle = circle;
}(d3));
