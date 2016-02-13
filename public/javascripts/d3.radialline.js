!(function(d3)
{
  var constant = function(d)
  {
    return function constant()
    {
      return d;
    }
  }
  var _angle = function(d){return d[0];};
  var _radius = function(d){return d[1];};
  var _radiusRange = constant([0,1]);
  var _angleRange = constant([0, Math.PI*2]);
  var _clockwise = constant(true);
  var _interpolate = constant('basis-closed');
  var _angleDomain = d3.extent;
  var _radiusDomain = d3.extent;
  var _angleScale = function(){return d3.scale.linear();};
  var _radiusScale = function(){return d3.scale.linear();};

  var _radialline = function()
  {
    function radialline(data)
    {
      var c = !!_clockwise.apply(this, arguments);
      var i = ''+_interpolate.apply(this, arguments);
      var af = _angle;
      var rf = _radius;
      var as = _angleScale.apply(this, arguments).range(_angleRange.apply(this,arguments)).domain(_angleDomain(data,af));
      var rs = _radiusScale.apply(this, arguments).range(_radiusRange.apply(this,arguments)).domain(_radiusDomain(data,rf));
      if (c)
      {
        return d3.svg.line()
          .x(function(d){return rs(rf(d))*Math.cos(as(af(d)));})
          .y(function(d){return rs(rf(d))*Math.sin(as(af(d)));})
          .interpolate(i)(data);
      }
      else
      {
        return d3.svg.line()
          .x(function(d){return rs(rf(d))*Math.cos(-as(af(d)));})
          .y(function(d){return rs(rf(d))*Math.sin(-as(af(d)));})
          .interpolate(i)(data);
      }
    };
    radialline.angle = function(_) {
      return arguments.length ? (_angle = typeof _ === "function" ? _ : constant(+_), radialline) : _angle;
    };
    radialline.angleScale = function(_) {
      return arguments.length ? (_angleScale = typeof _ === "function" ? _ : constant(+_), radialline) : _angleScale;
    };
    radialline.radius = function(_) {
      return arguments.length ? (_radius = typeof _ === "function" ? _ : constant(+_), radialline) : _radius;
    };
    radialline.radiusScale = function(_) {
      return arguments.length ? (_radiusScale = typeof _ === "function" ? _ : constant(+_), radialline) : _radiusScale;
    };
    radialline.interpolate = function(_) {
      return arguments.length ? (_interpolate = typeof _ === "function" ? _ : constant(''+_), radialline) : _interpolate;
    };
    radialline.clockwise = function(_) {
      return arguments.length ? (_clockwise = typeof _ === "function" ? _ : constant(!!_), radialline ): _clockwise;
    };
    radialline.radiusDomain = function(_)
    {
      return arguments.length ? (_radiusDomain = typeof _ === 'function' ? _ : constant(_), radialline ): _radiusDomain;
    };
    radialline.radiusRange = function(_)
    {
      return arguments.length ? (_radiusRange = typeof _ === 'function' ? _ : constant(_), radialline ): _radiusRange;
    };
    radialline.angleDomain = function(_)
    {
      return arguments.length ? (_angleDomain = typeof _ === 'function' ? _ : constant(_), radialline ): _angleDomain;
    };
    radialline.angleRange = function(_)
    {
      return arguments.length ? (_angleRange = typeof _ === 'function' ? _ : constant(_), radialline ): _angleRange;
    };
    return radialline;
  }

  d3.radialline = _radialline;
}(d3));
