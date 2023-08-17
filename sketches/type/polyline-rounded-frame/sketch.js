// july 2019

let points = [];
let poly;
const txt1 = "THE MORE YOU KNOW.";
const txt2 = "THE MORE YOU CAN DO.";

const neutral = ["#060606", "#e7e7e7"];
const colors = ["#FACD1E", "#FAB4E6", "#F02814", "#057846", "#0A8CFF"];

function setup() {
  createCanvas(1080, 1080);
  textAlign(CENTER, CENTER);
  const DOMoff = 20;
  radiusSlider = createSlider(0, 100, 0, 1);
  radiusSlider.position(10, 15 + DOMoff);
  ftsSlider = createSlider(5, 100, 18, 1);
  ftsSlider.position(10, 15 + DOMoff * 2);
  wSlider = createSlider(1, width, 160, 0.5);
  wSlider.position(10, 15 + DOMoff * 4);
  hSlider = createSlider(1, height, 250, 0.5);
  hSlider.position(10, 15 + DOMoff * 5);
  incSlider = createSlider(0, 320, 25, 1);
  incSlider.position(10, 15 + DOMoff * 7);
  countSlider = createSlider(1, 8, 1, 1);
  countSlider.position(10, 15 + DOMoff * 8);

  pickedColor = random(colors);
}

function getAngle(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  return theta;
}

function draw() {
  clear();
  background("LIGHTGRAY");
  noStroke(0);
  fill("white");
  rect(width / 2 - 320, height / 2 - 500, 640, 1000);
  fill(pickedColor);
  const fts = ftsSlider.value();
  const cornerRadius = radiusSlider.value();
  const wS = constrain(wSlider.value(), fts / 2, width / 2);
  const hS = constrain(hSlider.value(), cornerRadius + 1, height / 2);
  const x = width / 2;
  const y = height / 2;
  let inc = constrain(incSlider.value(), 0, width);
  let count = countSlider.value();
  for (let j = 0; j < count; j++) {
    const w = wS + j * inc;
    const h = hS + j * inc;
    const pickText = j % 2 == 0 ? txt1 : txt2;
    const numPts = pickText.length;
    const rounded = roundedRect(x, y, w, h, cornerRadius);
    poly = new Polyline(rounded);
    beginShape();
    for (let i = 0; i <= numPts; i++) {
      let percent = (i / numPts + frameCount * 0.001) % 1;
      let prepercent;
      if (i != 0) {
        prepercent = ((i - 1) / numPts + frameCount * 0.001) % 1;
      } else {
        prepercent = percent;
      }
      const pt2 = poly.getPointAtPercent(prepercent);
      const pt = poly.getPointAtPercent(percent);

      let px = pt[0];
      let py = pt[1];
      let pxx = pt2[0];
      let pyy = pt2[1];
      let angle = getAngle(px, py, pxx, pyy);
      push();
      translate(x, y);
      rotate(angle);
      // vertex(x,y);
      textSize(fts);
      text(pickText.charAt(numPts - i), 0, 0);
      pop();
    }
    endShape(CLOSE);
  }
}
