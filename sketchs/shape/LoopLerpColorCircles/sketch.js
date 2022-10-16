function setup() {
  colorMode(RGB, 155);
  createCanvas(360, 640);
  textAlign(CENTER, CENTER);
  noStroke(255);
  col1 = color(0, 150, 250);
  col2 = color(250, 0, 100);
  col3 = color(255, 255, 0);
  col4 = color(250, 0, 100);
}

const numFrames = 10 * 60;
const m = 480;
const r = 160;

function draw() {
  const t = ((frameCount % numFrames) / numFrames) * TWO_PI;
  clear();
  background(0);
  push();
  translate(width / 2, height / 2);
  for (let i = m; i > 0; i--) {
    const tt = i / m;
    const cola = lerpColor(col1, col4, sin(t + tt * 8) * 0.5 + 0.5);
    const colb = lerpColor(col3, col2, cos(t + tt * 2) * 0.5 + 0.5);
    const col = lerpColor(cola, colb, sin(t + tt));

    const x =
      (sin(t * 2 - i / 120) * width) / 5 +
      (cos(tt * TWO_PI + i / 100) * width) / 24;
    const y = (sin(i / 180) * cos(t * 4 - i / 64) * height) / 4;
    push();
    translate(x, y);
    fill(col);
    circle(0, 0, r);
    pop();
  }
  pop();
}
