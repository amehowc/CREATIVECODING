// august 2019

let cols;
function setup() {
  createCanvas(640, 640, WEBGL);
  noFill();
  strokeWeight(w);
  cols = [color("CYAN"), color("PINK"), color("ROYALBLUE")];
}

function InOutQuadratic(p) {
  var m = p - 1,
    t = p * 2;
  if (t < 1) return p * t;
  return 1 - m * m * 2;
}

const nframes = 6 * 60;
const num = 3;
const twists = 3;
const w = 10;
const n = 30;
const r = 120;
function draw() {
  clear();
  background(0);
  let radius = width / 4;
  const t = (frameCount / nframes) % 1;
  const spiralIn = map(t, 0.025, 0.475, 0, 1, true);
  const spiralOut = map(t, 0.575, 0.925, 0, 1, true);
  const progress = InOutQuadratic(spiralIn - spiralOut);

  rotateY(t * TWO_PI);
  rotateZ(-t * TWO_PI);

  for (let j = 0; j < num; j++) {
    const index = j / (num - 1);
    const r = radius - index * w * 3;
    rotateY((PI / 2) * index * progress);
    rotateX((PI / 2) * index * progress);
    const col = cols[j % cols.length];
    stroke(col);

    for (let k = 0; k < 2; k++) {
      beginShape(TRIANGLE_STRIP);
      vertex(0, r, 0);
      for (let i = 0; i < n; i++) {
        let deg = (i / (n - 2)) * PI;
        let x = 0,
          y = r,
          z = 0;
        let tx = x;
        x = x * cos(deg) + y * sin(deg);
        y = y * cos(deg) - tx * sin(deg);
        deg = map(i, 0, n - 1, 0, TWO_PI * progress * twists) + k * PI;
        tx = x;
        x = x * cos(deg) + z * sin(deg);
        z = z * cos(deg) - tx * sin(deg);
        curveVertex(x, y, z);
      }
      vertex(0, -r, 0);
      endShape();
    }
  }
}
