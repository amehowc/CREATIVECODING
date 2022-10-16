// august 2019 - Updated september 2021

const canvasSize = 640;
const loop = 3 * 60;
const size = 50;
const grid = {
  x: 16,
  y: 16
};
grid.offset = {
  x: size * (-grid.x / 2),
  y: size * (-grid.y / 2)
};
const boxes = [];
let i = 0;
let worldY = 0;

function setup() {
  createCanvas(360, 640, WEBGL);
  pixelDensity(1);
  smooth();
  fill(255);
  stroke(0);
  strokeWeight(1);
  for (let x = 0; x < grid.x; x++) {
    for (let y = 0; y < grid.y; y++) {
      boxes.push(new Box(x * size + grid.offset.x, y * size + grid.offset.y));
    }
  }

  boxes.sort(() => randomWithSeed() - 0.5);
}

// Draw tick
function draw() {
  clear();
  // Set camera position
  rotateX(PI * 0.5);

  // Styles
  background(0);

  if (i < boxes.length) {
    boxes[i].fall();
    i++;
  } else if (boxes[boxes.length - 1].transition === 0) {
    boxes.forEach(b => {
      b.z = 1;
      b.rotation = {
        x: random(b.pick),
        y: random(b.pick),
        z: random(b.pick)
      };
    });
    i = 0;
    worldY = 0;
    boxes.sort(() => randomWithSeed() - 0.5);
  }

  // Move world Y axis
  worldY += (1 / loop) * 265;

  // Update & Render
  boxes.forEach(b => {
    b.update();
    b.render();
  });
}

// Random with seed
var seed = 0;
function randomWithSeed() {
  var x = Math.sin(seed++);
  return x - Math.floor(x);
}
