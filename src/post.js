  var graphviz;
  
  function render(src, format, engine) {
    if (typeof graphviz === "undefined") {
      graphviz = Module();
    }
    
    var resultPointer = graphviz["ccall"]("vizRenderFromString", "number", ["string", "string", "string"], [src, format, engine]);
    var resultString = graphviz["Pointer_stringify"](resultPointer);
    graphviz["_free"](resultPointer);
    
    var lastError = graphviz["ccall"]("aglasterr", "string", [], []);
    
    if (lastError) {
      throw lastError;
    }
    
    return resultString;
  }
  
  function svgXmlToPngImage(svgXml) {
    var svgImage = new Image();
    svgImage.src = "data:image/svg+xml;utf8," + svgXml;

    var pngImage = new Image();

    svgImage.onload = function() {
      var canvas = document.createElement("canvas");
      canvas.width = svgImage.width;
      canvas.height = svgImage.height;

      var context = canvas.getContext("2d");
      context.drawImage(svgImage, 0, 0);

      pngImage.src = canvas.toDataURL("image/png");
    }
    
    return pngImage;
  }
  
  function Viz(src) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var format = options.format === undefined ? "svg" : options.format;
    var engine = options.engine === undefined ? "dot" : options.engine;
    
    if (format == "png-image-element") {
      return svgXmlToPngImage(render(src, "svg", engine));
    } else {
      return render(src, format, engine);
    }
  }
  
  if (typeof module === "object" && module.exports) {
    module.exports = Viz;
  } else {
    global.Viz = Viz;
  }
  
})(this);
