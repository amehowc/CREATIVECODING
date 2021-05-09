function setup() {
  createCanvas(windowWidth, windowHeight, SVG );
  pixelDensity(1)
  rectMode(CENTER)

}

function draw() {
  background(200);
  noStroke()
  fill('blue')
  const t = sin(frameCount*0.03)*width/2
  rect(width/2+t, height/2, 200, 200);

}

function mousePressed() {
  if (keyIsDown(SHIFT)) {
    save('ex.svg');

  }}
