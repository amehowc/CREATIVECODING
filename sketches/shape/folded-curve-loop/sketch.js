//september 2019

let loop, canvas;
let time = 0;
let tlength = 10;

// cosine easing function for tapered ends
function ease_cosine(t) {
  return 0.5 - 0.5 * cos(constrain(t, 0, 1) * TWO_PI);
}
// p = 1 gives cosine easing, higher p makes it more like
function eco2(t, p = 2) {
  return ease_cosine(p * (t - 0.5) + 0.5);
}

class Line {
  constructor(y) {
    this.y = y;
    this.color = "#000";
    this.weight = 10 * eco2(y / W, 0.5);
  }
  show(time) {
    if (this.weight == 0) return;
    noFill();
    stroke(this.color);
    strokeWeight(this.weight);
    beginShape();
    let t = time;
    for (let x = -250; x < W + 250; x += 1) {
      let xt = x / W;
      let yt = this.y / W;
      let a = xt * 23 - yt * 7 + 3 * sin(-2 * t - xt * 8 - yt * 4) - t * 5;
      let m = 100 - 20 * sin(yt * 9 + t * 3 - xt * 5);
      m *= ease_cosine(xt);
      vertex(x + m * cos(a), this.y + m * sin(a));
    }
    endShape();
  }
}

let lines = [],
  N = 1;
const W = 640,
  W2 = W / 2;
function setup() {
  createCanvas(W, W);
  frameRate(60);
  for (let i = 0; i < N; i++) {
    let y = (i - N / 2) / N;
    lines.push(new Line(W / 2));
  }
}

function draw() {
  background(220);
  push();
  const numframes = 2 * 60;
  const progress = (frameCount / numframes) % 10;
  for (let line of lines) line.show(progress);
  pop();
}
