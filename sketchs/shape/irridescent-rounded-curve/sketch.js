// August 2019 -- defining moment, first time trying irridescent colors and to build a rounded curve

let r = 10;
let off;
let inc = Math.PI / 25;
let coloff = 2;
let colsp = 1.0;
let points = [];
let t = 0;

function ease(p, g) {
  if (p < 0.5) return 0.5 * pow(2 * p, g);
  else return 1 - 0.5 * pow(2 * (1 - p), g);
}

function setup() {
  createCanvas(360, 640);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  noFill();
}

const numframes = 6 * 60;
function draw() {
  clear();
  points = [];
  background(0);
  r = 26;
  pr = 100;
  const t = ((frameCount / numframes) % 1) * TWO_PI;
  let offset = 180;
  let corr = sin(t);
  let ox = r - width / 2;
  let oy = 0;

  translate(width / 2 - r / 2, height / 2 - corr * (r / 2));
  for (let j = 0; j < 6; j++) {
    offset -= sin(j * 8 + t) * 60;
    if (j != 0) {
      const prevoffset = offset - sin((j - 2) * 8 + t) * 60;
      for (let i = TWO_PI - PI / 2; i < TWO_PI + PI / 2 + inc; i += inc) {
        let x = ox - r / 2 + 2 * r * j + (r / 2) * sin(i);
        let y = oy + prevoffset + (r / 2) * cos(i);
        points.push(createVector(x, y));
      }
    }
    if (j === 0) {
      for (let i = 0; i < PI + inc; i += inc) {
        let x = ox - r / 2 + 2 * r * j + (r / 2) * sin(TWO_PI + PI / 2);
        let y1 = oy + offset + (r / 2) * cos(TWO_PI + PI / 2);
        let y2 = oy - offset + (r / 2) * cos(TWO_PI - PI / 2);
        let yinc = map(i, 0, PI + inc, 0, 1);
        let y = lerp(y1, y2, yinc);
        points.push(createVector(x, y));
      }
    }
    for (let i = TWO_PI - PI / 2; i > PI / 2 - inc; i -= inc) {
      let x = ox + r / 2 + 2 * r * j + (r / 2) * sin(i);
      let y = oy - offset + (r / 2) * cos(i);
      points.push(createVector(x, y));
    }

    for (let i = 0; i < PI + inc; i += inc) {
      let x = ox + r / 2 + 2 * r * j + (r / 2) * sin(PI / 2);
      let y2 = oy + offset + (r / 2) * cos(TWO_PI + PI / 2);
      let y1 = oy - offset + (r / 2) * cos(TWO_PI - PI / 2);
      let yinc = map(i, 0, PI + inc, 0, 1);
      let y = lerp(y1, y2, yinc);
      // vertex(x,y);
      points.push(createVector(x, y));
    }
  }

  let ind = map(pr, 0, 100, 0, points.length);
  push();
  for (let k = 1; k < TWO_PI / 2.5; k += inc / 1.5) {
    translate(k, corr * k);
    let colr = map(sin(t * colsp + k * coloff), -1, 1, 255, 50, true);
    let colg = map(cos(t * colsp + k * coloff), -1, 1, 120, 255, true);
    let colb = map(sin(t * colsp + k * coloff), -1, 1, 200, 255, true);
    let cola = map(k, 1, TWO_PI / 3, 0, 255);
    strokeWeight(10);
    stroke(colr, colg, colb, cola);
    beginShape();
    points.forEach(pt => vertex(pt.x, pt.y));
    endShape();
  }
  pop();
}
