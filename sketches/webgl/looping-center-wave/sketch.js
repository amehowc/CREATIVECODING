//september 2019

function setup() {
  createCanvas(800, 600, WEBGL);
  smooth(8);
  rectMode(CENTER);
  stroke(70, 150, 200);
  noFill();
  strokeWeight(2);
}

let x, y, z, tt;
const N = 24,
  M = 16;
const l = 500,
  w = 320;
const n = 120;
const h = 120;
const q = 0.00011,
  ll = 0.000035;

function draw() {
  let t = map(sin(frameCount * 0.001), -1, 1, 0, 50);
  background(250);
  translate(-width / 2, -height / 2);
  push();
  translate(width / 2, height / 2 - 25);
  rotateX(PI * 0.12);
  for (let i = 0; i < N; i++) {
    x = map(i, 0, N - 1, -l / 2, l / 2);
    strokeWeight(1.6);
    if (i == 0 || i == N - 1) strokeWeight(4);
    beginShape();
    for (let j = 0; j < n; j++) {
      y = map(j, 0, n - 1, -w / 2 - 1, w / 2 + 1);
      z =
        h * sin(TWO_PI * t - q * (x * x + y * y)) * exp(-ll * (x * x + y * y));
      vertex(x, y, z);
    }
    endShape();
  }
  for (let i = 0; i < M; i++) {
    y = map(i, 0, M - 1, -w / 2, w / 2);
    strokeWeight(1.6);
    if (i == 0 || i == M - 1) strokeWeight(4);
    beginShape();
    for (let j = 0; j < n; j++) {
      x = map(j, 0, n - 1, -l / 2 - 1, l / 2 + 1);
      z =
        h * sin(TWO_PI * t - q * (x * x + y * y)) * exp(-ll * (x * x + y * y));
      vertex(x, y, z);
    }
    endShape();
  }
  pop();
}
