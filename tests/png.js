QUnit.module("png");

QUnit.test("png format with a worker", function(assert) {
  var done = assert.async();
  
  var worker = new Worker("./worker.js");
  
  worker.onmessage = function(e) {
    var image = Viz.svgXmlToPngImageElement(e.data);
    assert.ok(image instanceof Image, "image should be an Image");
    done();
  }
  
  worker.onerror = function(e) {
    throw e;
  }
  
  worker.postMessage({ src: "digraph { a -> b; }", options: { format: "svg" } });
});
