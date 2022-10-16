// august 2019

function setup() {
  createCanvas(360, 640);
  textAlign(CENTER);
  textSize(10);
  fill(255);
}
const nx = 10;
const ny = 15;
function draw() {
  background(0);
  const ratio = width / height;
  const spaceX = width / (nx - 2);
  const spaceY = height / (ny - 2);
  for (let i = 0; i < ny; i++) {
    const yPos = spaceY * i + spaceY * ratio;
    for (let j = 0; j < nx; j++) {
      const xPos = spaceX * j + spaceX * 0.5;
      const angle = atan2(yPos - mouseY, xPos - mouseX);
      const dis = dist(xPos, yPos, mouseX, mouseY);
      push();
      translate(xPos, yPos);
      rotate(angle);
      text("FOLLOW", 0, 0);
      pop();
    }
  }
}
