const c = document.getElementById("canvas");
const container = document.getElementById("canvas-container");

let img;
function setup() {
  const canvasRatio = { width: 360, height: 640 };
  const margins = 40;
  const scalefactor = scaleTo(
    canvasRatio.width,
    canvasRatio.height,
    container.clientWidth - margins * 2,
    container.clientHeight - margins * 2
  );
  pixelDensity(1)
  const canvasWidth = canvasRatio.width * scalefactor;
  const canvasHeight = canvasRatio.height * scalefactor;
  createCanvas(canvasWidth, canvasHeight, WEBGL, c);
  // importGUIComponents();
  const elt = document.getElementById("gui");
  imageMode(CENTER);
  noStroke();
  textureMode(NORMAL);
  ortho(-width / 2, width / 2, height / 2, -height / 2, -5000, 5000)
  const t = "everything falls into place ";
  pg = createGraphics(1, 8 * 4); // ribbonWidth multiplied by 4
  pg.textAlign(CENTER, CENTER);
  pg.textSize(24);
  pg.resizeCanvas(pg.textWidth(t) + 2, pg.height);
  pg.background("blue");
  pg.fill(255);
  pg.text(t, pg.width / 2, pg.height / 2);
}

function knot(time, halfWidth, tightness) {
  const denom = 1 + sin(time) * sin(time);
  const x = (halfWidth * cos(time)) / denom;
  const y = (halfWidth * sin(time) * cos(time)) / denom;
  return createVector(x, y + ((time / TWO_PI) * halfWidth) / tightness, 0);
}

function draw() {
  clear();
  background('antiquewhite');
  orbitControl()
  const progress = (frameCount % (12 * 60)) / (12 * 60);
  const radius = width/2.5-20;
  const loops = InOutQuadratic(cos(progress * PI * 2) * 0.5 + 0.5) * 7;
  const tightness = 1.85;
  const step = TWO_PI / 240;
  const ribbonWidth = radius/10

  const scrollSpeed = 1;
  const scrollOffset = (((progress+.5)%1) * pg.width * scrollSpeed) % pg.width;
  push();
  translate(0, ((-loops / 2) * radius) / tightness);
  // texture(pg);
  beginShape(TRIANGLE_STRIP);

  for (let i = 0; i < TWO_PI * loops; i += step) {
    const distanceTravelled = i * radius;
    const progressOnPG =
      ((distanceTravelled + scrollOffset) % pg.width) / pg.width;
    const nextU =
      ((distanceTravelled + step * radius + scrollOffset) % pg.width) /
      pg.width;
    const willRepeat = nextU < progressOnPG;
    const actual = knot(i, radius, tightness);
    const next = knot(i + step, radius, tightness);
    const a = -atan2(next.y - actual.y, next.x - actual.x);
    const z = -sin((i % TWO_PI) * 4)*10;
    const A = fromAngle(a, -ribbonWidth, { x: actual.x, y: actual.y }); // using 8 as ribbonWidth
    const B = fromAngle(a, ribbonWidth, { x: actual.x, y: actual.y });

    fill(
      noise(i / loops + (scrollOffset/pg.width)) * 255 + z * 10,
      noise(i / loops + step * 6 + (scrollOffset/pg.width)) * 255 + z * 10,
      noise(i / loops + step * 12 + (scrollOffset/pg.width)) * 255 + z * 10
    );
    vertex(A.x, A.y, z, progressOnPG, 0);
    vertex(B.x, B.y, z, progressOnPG, 1);

    if (willRepeat) {
      vertex(A.x, A.y, z, 0, 0);
      vertex(B.x, B.y, z, 0, 1);
    }
  }

  endShape();
  pop();
}

function fromAngle(angle, radius, center) {
  const c = center || { x: 0, y: 0 };
  const x = c.x + radius * Math.sin(angle);
  const y = c.y + radius * Math.cos(angle);
  return { x: x, y: y };
}

function InOutQuadratic(p) {
  var m = p - 1,
    t = p * 2;
  if (t < 1) return p * t;
  return 1 - m * m * 2;
}

function windowResized() {
  const canvasRatio = { width: 360, height: 640 };
  const margins = 40;
  const scalefactor = scaleTo(
    canvasRatio.width,
    canvasRatio.height,
    container.clientWidth - margins * 2,
    container.clientHeight - margins * 2
  );
  const canvasWidth = canvasRatio.width * scalefactor;
  const canvasHeight = canvasRatio.height * scalefactor;
  resizeCanvas(canvasWidth, canvasHeight);
}
