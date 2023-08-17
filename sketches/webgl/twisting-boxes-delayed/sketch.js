// october 2019

let counter = 0;
const numframes = 3 * 60;
const blocks = 13;
const blockWidth = 180;
const blockHeight = 20;
const spacer = 24;

function setup() {
  createCanvas(360, 640, WEBGL);
  pixelDensity(1);
  fill(255);
  stroke(0);
  strokeWeight(1);
  smooth();
}

function draw() {
  clear();
  background(40);
  translate(0, -((blocks - 1) * spacer) / 2, 0);
  const t = ((frameCount / numframes) % 1) * PI;
  for (let i = 0; i < blocks; i++) {
    push();
    let r = t - i * (1 / blocks);
    r = constrain(r, 0, 1);
    r = easeInOutBack(r, 0, 1, 1);
    translate(0, spacer * i, 0);
    rotateY(r * HALF_PI);
    box(blockWidth, blockHeight, blockWidth);
    pop();
  }
}

function easeInOutBack(t, b, c, d, s) {
  if (s == undefined) s = 1.70158;
  if ((t /= d / 2) < 1)
    return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
  return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
}
