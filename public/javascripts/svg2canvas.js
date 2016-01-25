!(function()
{
  var svg2canvas = function(dom, targetDom, cb)
  {
    try
    {
      var ns = dom.getAttribute('xmlns');
      dom.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      var canvasParent = targetDom;
      if (targetDom == void 0)
      {
        canvasParent = dom.parentNode;
      }
      var canvas = document.createElement('canvas');
      canvasParent.appendChild(canvas);
      canvas.setAttribute('width', dom.clientWidth);
      canvas.setAttribute('height', dom.clientHeight);
      var ctx = canvas.getContext('2d');
      var data = new Blob([dom.outerHTML], {type: 'image/svg+xml; charset=utf-8'});
      var img = new Image();
      var blobReader = new FileReader();
      blobReader.onload = function()
      {
        img.onload = function()
        {
          ctx.drawImage(img, 0, 0);
          dom.setAttribute('xmlns', ns)
          if (cb !== void 0)
          {
            cb(null, canvas);
          }
        }
        img.src = this.result;
      }
      blobReader.readAsDataURL(data);
    }
    catch (e)
    {
      if (cb !== void 0)
      {
        cb(e, null);
      }
      else
      {
        throw e;
      }
    }
  };

  if (typeof define === "function" && define.amd) define(svg2canvas); else if (typeof module === "object" && module.exports) module.exports = svg2canvas;
  this.svg2canvas = svg2canvas;
}());
