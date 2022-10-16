// august 2019

function ease(p, g) {
  if (p < 0.5) return 0.5 * pow(2 * p, g);
  else return 1 - 0.5 * pow(2 * (1 - p), g);
}

function setup() {
  createCanvas(360, 640);
}

function draw() {
  clear();
  background("#FFF");
  const rows = 7;
  const cols = 14;
  const spacer = 40;
  const t = frameCount * 0.0125;
  translate(
    width / 2 - ((rows - 1) * spacer) / 2,
    height / 2 - ((cols - 1) * spacer) / 2
  );
  for (let j = 0; j < cols; j++) {
    for (let i = 0; i < rows; i++) {
      const id = i + j * rows;
      let off = ease(noise(i, j * 4, t), 2);
      push();
      translate(i * spacer, j * spacer);
      noStroke();
      fill(off * 255, (1 - off) * 255, 128 + off * 128);
      ellipse(0, 0, 30);
      pop();
      push();
      translate(i * spacer - off * 10, j * spacer - off * 10);
      stroke("#0000ff");
      fill("#fff");
      ellipse(0, 0, 30);
      pop();
    }
  }
}
