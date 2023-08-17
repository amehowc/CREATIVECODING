const c = document.getElementById("canvas");
const container = document.getElementById("canvas-container");

let img;
let buffer;
let gl;
let t;

const setScene = () => {
  options = {
    blend: {
      enable: true,
      func: {
        source: gl.ONE,
        dest: gl.ONE_MINUS_SRC_ALPHA,
      },
    },
    depth: {
      enable: true,
      func: gl.LESS,
    },
    cull: {
      enable: true,
      func: gl.FRONT_AND_BACK,
    },
    premult: { unpack: true },
    flipY: { enable: false },
    extensions: {
      lazyload: false,
      ext: ["OES_texture_float_linear"],
    },
  };
  setRenderer(gl, options);
};

const setImage = () => {
  const scalefactor = scaleTo(
    flower.width,
    flower.height,
    width + 5,
    height + 5
  );
  pg = createGraphics(width, height);
  pg.translate(pg.width / 2, pg.height / 2);
  pg.imageMode(CENTER);
  pg.scale(scalefactor);
  pg.image(flower, 0, 0);
};

function preload() {
  flower = loadImage("botanic.png");
}

function setup() {
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
  createCanvas(canvasWidth, canvasHeight, WEBGL, c);
  importGUIComponents();
  const elt = document.getElementById("gui");
  imageMode(CENTER);
  slider("refraction", [0, 1, 0.5, 0.001]);
  slider("aberration", [0, 2, 0.5, 0.001]);
  slider("fresnel", [0, 1, 0.5, 0.001]);
  sliders("colors-range", [
    {
      name: "red",
      settings: [0, 1, 0.5, 0.001],
      callback: () => {},
    },
    {
      name: "blue",
      settings: [0, 1, 0.5, 0.001],
      callback: () => {},
    },
    {
      name: "green",
      settings: [0, 1, 0.5, 0.001],
      callback: () => {},
    },
    {
      name: "yellow",
      settings: [0, 1, 0.5, 0.001],
      callback: () => {},
    },
    {
      name: "cyan",
      settings: [0, 1, 0.5, 0.001],
      callback: () => {},
    },
    {
      name: "magenta",
      settings: [0, 1, 0.5, 0.001],
      callback: () => {},
    },
  ]);
  noStroke();
  setAttributes("antialias", true);
  pixelDensity(2);
  rectMode(CENTER);
  imageMode(CENTER);
  gl = this._renderer.GL;
  setScene();
  setImage();
  buffer = new p5.Framebuffer(this, { format: "float", filter: "linear" });
  buffer_shader = createShader(vert, buffer_frag);
}

const numframes = 10 * 60;

function draw() {
  t = InOutQuadratic((frameCount % numframes) / numframes) * PI;
  clear();
  background("#f0f0f0");
  fbo();

  push();
  texture(pg);
  rect(0, 0, pg.width, pg.height);
  pop();

  push();
  if (buffer.color) {
    texture(buffer.color);
    rect(0, 0, width, -height);
  }
  pop();
}

const fbo = () => {
  const w = width;
  const h = height;
  buffer.draw(() => {
    clear();
    push();

    const uniforms = {
      uIorR: gui["colors-range-red"].value() * 2.5,
      uIorY: gui["colors-range-yellow"].value() * 2.5,
      uIorG: gui["colors-range-green"].value() * 2.5,
      uIorC: gui["colors-range-cyan"].value() * 2.5,
      uIorB: gui["colors-range-blue"].value() * 2.5,
      uIorP: gui["colors-range-magenta"].value() * 2.5,
      uSaturation: 1,
      uChromaticAberration: gui["aberration"].value(),
      uRefractPower: gui["refraction"].value(),
      uFresnelPower: gui["fresnel"].value() * 4,
      uShininess: 80,
      uDiffuseness: 10,
      uLight: [0.5, -0.5, 1.0],
      resolution: [w * pixelDensity(), h * pixelDensity()],
      texture: pg,
      time: t,
    };

    shader(buffer_shader);
    createUniforms(buffer_shader, uniforms);
    // cylinder(100,100,48,48)
    // sphere(140,48,48)
    scale(0.85);
    torus(200, 100, 48, 48);
    // box(200,200,48,48)
    pop();
  });
};

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
  setImage();
}

function InOutQuadratic(p) {
  var m = p - 1,
    t = p * 2;
  if (t < 1) return p * t;
  return 1 - m * m * 2;
}
