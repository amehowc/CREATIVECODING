const delay = 3 * 60;
const count = 14;
let t = 0;
let time = 0;
let scl = 75;

function setup() {
  createCanvas(500, 500);
  noStroke();
  rectMode(CENTER);
  inc = createSlider(0, 1, 0.02, 0.01);
  inc.position(10, height + 10);
  xoff = createSlider(-width / 2, width / 2, 0, 1);
  xoff.position(150, height + 10);
  yoff = createSlider(-width / 2, width / 2, 0, 1);
  yoff.position(150, height + 50);
}

function draw() {
  clear();
  let dinc = inc.value();
  let doffx = xoff.value();
  let doffy = yoff.value();
  const t = (frameCount / delay) % 1;
  strokeWeight(2);
  background(248);
  for (let i = -count; i < count; i++) {
    for (let j = -count; j < count; j++) {
      const u = width / 2 + (i + 0.5) * 12.5;
      const v = height / 2 + (j + 0.5) * 12.5;
      const n =
        noise(
          dinc * dist(u, v, width / 2 + doffx, height / 2 + doffy) - TWO_PI * t,
          t * TWO_PI
        ) * TWO_PI;
      const f = map(n, 0, TWO_PI, 0, 255);

      fill(f);
      stroke(f);
      noStroke();
      rect(u, v, count, count);
    }
  }
}
