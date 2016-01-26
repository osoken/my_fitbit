!(function(d3)
{
  var constant = function(d)
  {
    return function constant()
    {
      return d;
    }
  }
  var _angle = function(d){return d[0];}
  var _angleExtent = d3.extent;
  var _radius = function(d){return d[1];}
  var _radiusExtent = d3.extent;
  var _innerRadius = constant(0);
  var _outerRadius = constant(1);
  var _startAngle = constant(0);
  var _endAngle = constant(Math.PI * 2);
  var _interpolate = constant('basis-closed');

  var _radialline = function()
  {
    function radialline(data)
    {
      var r0 = +_innerRadius.apply(this, arguments);
      var r1 = +_outerRadius.apply(this, arguments);
      var a0 = +_startAngle.apply(this, arguments);
      var a1 = +_endAngle.apply(this, arguments);
      var i = ''+_interpolate.apply(this, arguments);
      var af = _angle;
      var rf = _radius;

      var angleScale = d3.scale.linear()
        .range([a0, a1])
        .domain(_angleExtent(data, af));
      var radiusScale = d3.scale.linear()
        .range([r0, r1])
        .domain(_radiusExtent(data, rf));

      return d3.svg.line()
        .x(function(d){return radiusScale(rf(d))*Math.cos(angleScale(af(d)));})
        .y(function(d){return radiusScale(rf(d))*Math.sin(angleScale(af(d)));})
        .interpolate(i)(data);
    };
    radialline.angle = function(_) {
      return arguments.length ? (_angle = typeof _ === "function" ? _ : constant(+_), radialline) : _angle;
    };
    radialline.angleExtent = function(_) {
      return arguments.length ? (_angleExtent = typeof _ === "function" ? _ : constant(+_), radialline) : _angleExtent;
    };
    radialline.radius = function(_) {
      return arguments.length ? (_radius = typeof _ === "function" ? _ : constant(+_), radialline) : _radius;
    };
    radialline.radiusExtent = function(_) {
      return arguments.length ? (_radiusExtent = typeof _ === "function" ? _ : constant(+_), radialline) : _radiusExtent;
    };
    radialline.innerRadius = function(_) {
      return arguments.length ? (_innerRadius = typeof _ === "function" ? _ : constant(+_), radialline) : _innerRadius;
    };
    radialline.outerRadius = function(_) {
      return arguments.length ? (_outerRadius = typeof _ === "function" ? _ : constant(+_), radialline) : _outerRadius;
    };
    radialline.startAngle = function(_) {
      return arguments.length ? (_startAngle = typeof _ === "function" ? _ : constant(+_), radialline) : _startAngle;
    };
    radialline.endAngle = function(_) {
      return arguments.length ? (_endAngle = typeof _ === "function" ? _ : constant(+_), radialline) : _endAngle;
    };
    radialline.interpolate = function(_) {
      return arguments.length ? (_interpolate = typeof _ === "function" ? _ : constant(''+_), radialline) : _interpolate;
    };
    return radialline;
  }

  d3.radialline = _radialline;
}(d3));
