!(function(d3)
{
  var circle = {};
  var _timeFormat = d3.time.format('%H:%M:%S');
  var _dateFormat = d3.time.format('%Y-%m-%d');
  var _displayDateFormat = d3.time.format('%m/%d');
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
    svg.append('rect')
      .attr('x',0).attr('y',0).attr('width', width).attr('height',height).attr('fill','#FFF').attr('stroke','none');
    var baseLayer = svg.append('g').attr('transform','translate('+(width/2)+','+(height/2)+')');
    var plotLayer = svg.append('g').attr('transform','translate('+(width/2)+','+(height/2)+')');
    var axisLayer = svg.append('g').attr('transform','translate('+(width/2)+','+(height/2)+')');
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
      var radius = 0.36*Math.min(width,height);

      var xScale = d3.time.scale().range([-Math.PI/2,3/2*Math.PI]).domain([_timeFormat.parse('00:00:00'), new Date(_timeFormat.parse('00:00:00').getTime()+86400000)]);
      var yScale = d3.scale.linear().range([0, radius]).domain([0,100]).domain(d3.dataHandler.heartRateExtent);

      var line = d3.svg.line()
        .interpolate('basis-closed')
        .x(function(d,i) { return (d.value==null)?yScale(50)*Math.cos(xScale(d.time)):yScale(d.value)*Math.cos(xScale(d.time));})
        .y(function(d,i) { return (d.value==null)?yScale(50)*Math.sin(xScale(d.time)):yScale(d.value)*Math.sin(xScale(d.time));});

      var centerXScale = d3.scale.ordinal().rangePoints([-(width-2*radius)/2, (width-2*radius)/2]).domain(days);
      var centerYScale = d3.scale.ordinal().rangePoints([-(height-2*radius)/2, (height -2*radius)/2]).domain([0,1]);

      var colorPalette = d3.scale.ordinal().range(d3.range(0,360,360/days.length).map(function(d){return ""+d3.hsl(d, 1.0, 0.5);})).domain(d3.keys(dat));

      baseLayer.selectAll('g')
        .data(d3.entries(dat))
        .enter().append('g')
        .attr('transform', function(d,i){return 'translate('+centerXScale(d.key)+','+centerYScale(i%2)+')';})
        .append('path')
        .each(function(data)
        {
          d3.select(this).attr('fill', colorPalette(data.key)).attr('opacity', 1)
            .datum(data.value).attr('d',line);
        });
      plotLayer.selectAll('g')
        .data(d3.entries(dat))
        .enter().append('g')
        .attr('transform', function(d,i){return 'translate('+centerXScale(d.key)+','+centerYScale(i%2)+')';})
        .append('path')
        .each(function(data)
        {
          d3.select(this).attr('fill', colorPalette(data.key)).attr('opacity', 0.5).attr('stroke', '#FFF').attr('stroke-wdith',4)
            .datum(data.value).attr('d',line);
        });
      axisLayer.selectAll('g')
        .data(d3.entries(dat))
        .enter().append('g')
        .attr('transform', function(d,i){return 'translate('+centerXScale(d.key)+','+centerYScale(i%2)+')';})
        .append('circle')
        .attr('cx', 0).attr('cy', 0).attr('r', yScale(45)).attr('fill', 'none').attr('stroke', 'rgba(255,255,255,1)').attr('stroke-width', 2);
      axisLayer.selectAll('g')
        .append('text')
        .text(function(d){return _displayDateFormat(_dateFormat.parse(d.key));})
        .attr('fill','rgba(255,255,255,1)').attr('font-family','Impact')
        .attr('stroke', 'rgba(0,0,0,0.1)').attr('stroke-width', 2)
        .attr('dominant-baseline','middle').attr('text-anchor', 'middle')
        .attr('font-size', yScale(36));
      svg.on('click', function()
        {
          svg2canvas(svg.node(),root.node(), function(err,canvas)
          {
            var tag = d3.select('body').append('a')
              .attr('type','application/octet-stream')
              .attr('href', canvas.toDataURL('image/png'))
              .attr('download','image.png');
            tag.node().click();
            tag.remove();
            canvas.remove();
          });
        });


    });
  }
  d3.circle = circle;
}(d3));
