//july 2019

let p = 0;

function setup() {
  createCanvas(640, 640);
  noFill();
  stroke(255);
  strokeWeight(2);
}

function draw() {
  clear();
  background(0);
  const x = width / 2;
  const y = height / 2;

  translate(-50, -height / 2 - 20);
  let inc = 0.01;
  for (let j = 0; j < 8; j++) {
    beginShape();
    for (let i = 0; i < TWO_PI; i += inc * 6) {
      const ninc = map(i, 0, TWO_PI, 0, 100);
      const rad = 50 + j * 10;
      const xoff = map(cos(i + p), -1, 1, 0, 1);
      const yoff = map(sin(i + p), -1, 1, 0, 1);
      const n = noise(xoff, yoff) * 100;
      const xx = x + rad * sin(i) + n;
      const yy = y - rad * cos(i) + n * 8;

      if (i == 0) {
        curveVertex(xx, yy);
        curveVertex(xx, yy);
      } else {
        curveVertex(xx, yy);
      }
      if (i == 0) {
        curveVertex(xx, yy);
        curveVertex(xx, yy);
      }
    }
    endShape(CLOSE);
    p += inc / 2;
  }
}
