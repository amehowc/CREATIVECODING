var color01 = "#eb6163";
var color02 = "#111427";
var color03 = "#ffffff";

var n = 1;
var c = 10;
var o = 0;

function setup() {
  createCanvas(360, 640);
  resetSketch();
  frameRate(24);
  angleMode(DEGREES);
}

function draw() {
  var a = n * (137.5 + o);
  var r = c * sqrt(n);
  var d = r / 5 + n / 5;
  var x = r * cos(a) + width / 2;
  var y = r * sin(a) + height / 2;
  fill(color01);
  stroke(color02);
  ellipse(x, y, d, d);

  n += 1;
  if (n > 200) {
    resetSketch();
    o = (o + 10) % 180;
  }
}
function resetSketch() {
  
  background(color01);
  n = 1;
  
}

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
//   resetSketch();
// }
