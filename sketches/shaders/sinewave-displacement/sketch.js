let totalDomUnits = 0;
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
  const canvasWidth = Math.floor(canvasRatio.width * scalefactor);
  const canvasHeight =  Math.floor(canvasRatio.height * scalefactor);
  createCanvas(canvasWidth, canvasHeight, WEBGL, c);
  importGUIComponents();
  slider("repeats", [1, 8, 3, 1], () => {});
  sliders("distance", [
    {
      name: "x",
      settings: [0, 0.5, 0.1, 0.001],
      callback: () => {},
    },
    {
      name: "y",
      settings: [0, 0.5, 0.1, 0.001],
      callback: () => {},
    },
  ]);
  sliders("strength", [
    {
      name: "x",
      settings: [0, 5, 2.5, 0.001],
      callback: () => {},
    },
    {
      name: "y",
      settings: [0, 5, 2.5, 0.001],
      callback: () => {},
    },
  ]);
  sliders("speed", [
    {
      name: "x",
      settings: [0, 1, 0.5, 0.001],
      callback: () => {},
    },
    {
      name: "y",
      settings: [0, 1, 0.5, 0.001],
      callback: () => {},
    },
  ]);
  sliders("slope", [
    {
      name: "x",
      settings: [0.9, 8, 1, 0.01],
      callback: () => {},
    },
    {
      name: "y",
      settings: [0.9, 8, 1, 0.01],
      callback: () => {},
    },
  ]);
  slider("text-size", [24, 200, 140, 1], () => {});

  imageUploadButton("upload-image");
  colorpicker("colorpicker", ["antiquewhite", "black"]);
  textarea("text-area", "brownies\nchocolate\ncookies\nmuffins");
  noStroke();
  setAttributes("antialias", true);
  imageMode(CENTER);
  pixelDensity(1);
  pg = createGraphics(1, 1);
  pg.textFont("helvetica");
  pg.textAlign(CENTER, CENTER);
  shade = createShader(vert, frag);
}

function draw() {
  clear();
  background(15);

  const numframes = 6 * 60
  const progress = frameCount * 0.03

  if (pg.width !== width) {
    pg.resizeCanvas(width, height);
  }
  pg.background(gui["colorpicker"].value());
  pg.fill(gui["colorpicker1"].value());
  pg.textSize(gui["text-size"].value());
  pg.text(gui["text-area"].value(), pg.width / 2, pg.height / 2);
  const uniforms = {
    distance: [gui["distance-x"].value(), gui["distance-y"].value()],
    strength: [gui["strength-x"].value(), gui["strength-y"].value()],
    speed: [gui["speed-x"].value(), gui["speed-y"].value()],
    slope: [gui["slope-x"].value(), gui["slope-y"].value()],
    texture: img ? img : pg,
    resolution: [width * pixelDensity(), height * pixelDensity()],
    time: progress,
    repeats: gui["repeats"].value(),
  };
  createUniforms(shade, uniforms);
  push();
  shader(shade);
  plane(width, height);
  pop();
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
  const canvasWidth = Math.floor(canvasRatio.width * scalefactor);
  const canvasHeight = Math.floor(canvasRatio.height * scalefactor);
  resizeCanvas(canvasWidth, canvasHeight);
}
