// August 2019 - Should probably be a shader

function setup() {
  createCanvas(640, 640);
  noStroke();
  rectMode(CENTER);
  fill(0);
}
const numframes = 3 * 60;

const numx = 40;
const numy = 40;
const lx = 600;
const ly = 600;
const off = 0.02;
const ratio = 360 / 640;
function draw() {
  const t = (frameCount / numframes) % 1;
  background(255);
  for (let i = 0; i < numx; i++) {
    const idx = i / (numx - 1) - 0.5;
    for (let j = 0; j < numy; j++) {
      const idy = j / (numy - 1) - 0.5;
      const x = width / 2 + idx * lx;
      const y = height / 2 + idy * ly;
      const d = map(
        sin(off * dist(x, y, width / 2, height / 2) - TWO_PI * t),
        -1,
        1,
        0,
        8
      );
      ellipse(x, y, abs(d) + 1);
    }
  }
}
