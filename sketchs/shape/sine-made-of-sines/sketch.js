// august 2019

const numFrames = 9 * 60;
const numPts = 240;
const numLines = 25;
let cols;
const colbg = "#FDF6F0";

function setup() {
  createCanvas(360, 640);
  noFill();
  strokeWeight(8);
  cols = ["#C3342B", "#1D3E38", "#624C8C", "#B18034", "#E43379"];
}

function draw() {
  translate(width / 2, 0);
  const t = ((frameCount / numFrames) % 1) * TWO_PI;
  clear();
  background(colbg);
  for (let y = numLines; y > 0; y--) {
    stroke(cols[y % cols.length]);
    beginShape();
    for (let i = numPts; i > 0; i--) {
      let xx = i - numPts / 2 + (cos(y / 4 - 2 * t) * width) / 8;
      let yy = 20 + y * 23 + sin(xx / 8 - 4 * t) * 10;
      vertex(xx, yy);
    }
    endShape();
  }
}
