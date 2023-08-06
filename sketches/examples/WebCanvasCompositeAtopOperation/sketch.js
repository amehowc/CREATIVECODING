// August 2019
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing

let renderer;
let ctx;
let canvas;
let img;
let pg;
let disp;
let centerX, centerY;

function setup() {
  renderer = createCanvas(600, 600);
  pg = createGraphics(600, 600);
  disp = createGraphics(600, 600);
  ctx = renderer.drawingContext;
  background(255);

  centerX = width / 2;
  centerY = height / 2;

  pg.background("BLUE");
  pg.fill("WHITE");
  pg.noStroke();
  pg.push();
  pg.fill(255);
  // pg.ellipse(pg.width/2,pg.height/2,300);
  pg.pop();
  pg.rect(0, 0, pg.width / 2, pg.height);

  disp.background(0);
  disp.fill(255);
  disp.noStroke();
  disp.rect(0, 0, pg.width, pg.height);

  canvas = createGraphics(width, height);
  canvas.noStroke();
  canvas.translate(centerX, centerY);
  canvas.scale(-1, 1);
  canvas.translate(-centerX, -centerY);
  canvas.image(pg, 0, 0);
}

function draw() {
  let angle = (TWO_PI / mouseX) * width;

  let space = (mouseY / height) * 30 + 15;
  const start = 100;
  let maskImage = createGraphics(width, height);
  maskImage.rectMode(CENTER);
  maskImage.ellipse(centerX, centerY, start, start);
  maskImage.noFill();
  maskImage.strokeWeight(space);
  for (let i = start + space; i < width; i += space * 4) {
    maskImage.ellipse(centerX, centerY, i, i);
  }

  let maskPg = createGraphics(width, height);
  maskPg.rectMode(CENTER);
  maskPg.ellipse(centerX, centerY, start, start);
  maskPg.noFill();
  maskPg.strokeWeight(space);
  for (let i = 0; i < width; i += space * 4) {
    maskPg.ellipse(centerX, centerY, i, i);
  }

  ctx.save();
  ctx.globalCompositeOperation = "source-in";
  translate(width / 2, height / 2);
  rotate(angle);
  translate(-width / 2, -height / 2);
  image(maskImage, 0, 0);
  image(canvas, 0, 0);
  ctx.globalCompositeOperation = "destination-atop";
  translate(width / 2, height / 2);
  rotate(-angle * 2);
  translate(-width / 2, -height / 2);
  image(pg, 0, 0);
  ctx.restore();
}

function ease(t) {
  return t * t * t * t * t * t * t;
}
