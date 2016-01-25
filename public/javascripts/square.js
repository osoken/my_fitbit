!(function(d3)
{
  var square = {};
  var _timeFormat = d3.time.format('%H:%M:%S');
  var _dateFormat = d3.time.format('%Y-%m-%d');
  var _hourFormat = d3.time.format('%H');
  square.selection = null;
  square.clear = function()
  {
    if (square.selection != null)
    {
      square.selection.select('*').remove();
      square.selection = null;
    }
  }
  square.init = function(root, from, to)
  {
    square.selection = root;
    var width = root.node().getBoundingClientRect().width;
    var height = root.node().getBoundingClientRect().height;
    var svg = square.selection.append('svg')
      .attr({width: width, height: height});
    var plotLayer = svg.append('g').attr('transform', 'translate('+(width/2)+','+(height/2)+')');
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
      var satScale = d3.scale.linear().range([0.0,1.0]).domain(d3.dataHandler.heartRateExtent);
      var horizontal = d3.max(d3.values(dat),function(d){return d.length;});
      var vertical = days.length;
      var dim = Math.min(width/horizontal, height/vertical);
      var xScale = d3.scale.ordinal().rangeBands([ -dim*horizontal/2, dim*horizontal/2 ],0.1,0.1).domain(d3.range(horizontal));
      var yScale = d3.scale.ordinal().rangeBands([ -dim*vertical/2, dim*vertical/2 ],0.1,0.1).domain(days);
      var colorPalette = d3.scale.ordinal().range(d3.range(0,360,360/days.length).map(function(d){return function(dd){return ""+d3.hsl(d, satScale(dd.value), 0.5);};})).domain(d3.keys(dat));
      plotLayer.selectAll('g')
        .data(d3.entries(dat))
        .enter().append('g')
        .attr('transform', function(d){return 'translate(0,'+yScale(d.key)+')';})
        .each(function(data)
        {
          d3.select(this)
            .selectAll('rect')
            .data(data.value).enter().append('rect')
            .attr('x', function(d,i){return xScale(i);}).attr('y', 0).attr('width', xScale.rangeBand())
            .attr('height', yScale.rangeBand()).attr('stroke', 'none')
            .attr('fill',function(d){return colorPalette(data.key)(d);});
        });
    });
  }
  d3.square = square;
}(d3));
