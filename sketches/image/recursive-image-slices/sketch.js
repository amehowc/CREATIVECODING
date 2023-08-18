let totalDomUnits = 0;
const c = document.getElementById("canvas");
const container = document.getElementById("canvas-container");

let img;
let otherimg;
function preload() {
  otherimg = loadImage("flower_02.png");
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
  const canvasWidth = Math.floor(canvasRatio.width * scalefactor);
  const canvasHeight = Math.floor(canvasRatio.height * scalefactor);
  createCanvas(canvasWidth, canvasHeight, P2D, c);
  importGUIComponents();
  const elt = document.getElementById("gui");
  // imageMode(CENTER);

  slider("recursions", [1, 8, 5, 1]);
  checkbox('show-grid','Show Grid')
  dropdown('display-mode',['Fill','Fit'])
  dropdown('animation-mode',['Noise','Sine'])
  sliders("dimensions", [
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
    {
      name: "z",
      settings: [0, 1, 1, 0.001],
      callback: () => {},
    },
    {
      name: "speed",
      settings: [0, 1, 0.1, 0.001],
      callback: () => {},
    },
    {
      name: "strength",
      settings: [0, 1, 0.5, 0.001],
      callback: () => {},
    },
    {
      name: "magenta",
      settings: [0, 1, 0.5, 0.001],
      callback: () => {},
    },
  ]);
  imageUploadButton('upload-image')
  // sliders("sliders");
  // sliders("sliders02");
  // sliders("sliders03");
  // slider("slider02", [0, 1, 0.5, 0.001]);
  // button("button");
  // dropdown("dropdown");
  // imageUploadButton("Add Image");
  // buttons("buttons");
  // colorpicker("colorpicker", ["#ffff00", "#ff00ff", "#00ffff", "#000"]);
  // textinput("text-input");
  // textarea("text-area");
  noStroke();
  // console.log(gui)
}

function draw() {
  background(0);
  const recursions = gui['recursions'].value()
  selectedImg = img ? img : otherimg
  divide(0, 0, width, height, recursions, 0, 0, selectedImg.width, selectedImg.height);
}

function divide(x, y, w, h, depth, ix, iy, iw, ih) {
  const influenceX = Math.floor(gui['dimensions-x'].value()*12)
  const influenceY =  Math.floor(gui['dimensions-y'].value()*12)
  const influenceZ = gui['dimensions-z'].value()/10
  const speed =  gui['dimensions-speed'].value()
  const animation = gui['animation-mode'].value()
  const strength = gui['dimensions-strength'].value()
  if (depth > 0) {
    const n = animation === 'Noise' ?
      0.5 + (2*noise((w / width) * influenceX , (h / height) * influenceY , frameCount/60 * speed * depth * influenceZ)-1.)*.5*strength :
      0.5 + (sin((w / width) * influenceX + (h / height) * influenceY + frameCount/60 * speed * depth * influenceZ*TWO_PI))*.5*strength

    if (depth-- % 2 === 1) {
      divide(x, y, w * n, h, depth, ix, iy, iw / 2, ih);
      divide(x + w * n, y, w - w * n, h, depth, ix + iw / 2, iy, iw / 2, ih);
    } else {
      divide(x, y, w, h * n, depth, ix, iy, iw, ih / 2);
      divide(x, y + h * n, w, h - h * n, depth, ix, iy + ih / 2, iw, ih / 2);
    }
  } else {
    push();
    noFill();
    y = Math.ceil(y)
    x = Math.ceil(x)
    w = Math.ceil(w)
    h = Math.ceil(h)
    x = Math.ceil(x)
    ix = Math.ceil(ix)
    iy = Math.ceil(iy)
    iw = Math.ceil(iw)
    ih = Math.ceil(ih)
    if(gui['display-mode'].value()==='Fill'){
      image(selectedImg, x, y, w, h, ix, iy, iw, ih);
    }else{
      image(selectedImg, x, y, w, h,);
    }
    if(gui['show-grid'].checked()){
    stroke(255);
    rect(x, y, w, h);
    }
    pop();
    //text(index, x, y + 10)
  }
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
