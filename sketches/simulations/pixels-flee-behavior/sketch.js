
const vehicles = [];
const points = [];
let vect;
const s = 8;

function preload() {
  img = loadImage("./src/flower.jpg");
}
let xMin = 999, xMax = -999
function setup() {
  createCanvas(img.width, img.height);
  background(0);
  pixelDensity(1);
  img.loadPixels();
 
  for (let j = 0; j < img.height; j += s) {
    for (let i = 0; i < img.width; i += s) {
      let index = (i + j * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let a = img.pixels[index + 3];
      let c1 = color(r, g, b, a);
      let r1 = red(c1);
      let k = floor(map(r1, 255, 0, 0, s,true));
      if(k>1)points.push(createVector(i, j, k));
      
    }
  }
  console.log(points.length)
  img.updatePixels()

  for (var i = 0; i < points.length; i++) {
    var pt = points[i];
    var vehicle = new Vehicle(pt.x, pt.y, pt.z);
    vehicles.push(vehicle);
  }
}

Vehicle.prototype.show = function () {
  noStroke();
  fill(0);
  // if (this.dist > 0.5) {
  //   fill(35, 50, 100);
  // } else {
  //   fill(35, 50, 100);
  // }
  ellipse(this.pos.x, this.pos.y, this.rad);
};

function draw() {
  background(220);

  for (var i = 0; i < vehicles.length; i++) {
    var v = vehicles[i];
    v.update();
    v.edges();
    v.behaviors();
    v.show();
  }
  // noLoop()
  // save()
}


