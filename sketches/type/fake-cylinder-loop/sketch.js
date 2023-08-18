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
  const canvasHeight = Math.floor(canvasRatio.height * scalefactor);
  createCanvas(canvasWidth, canvasHeight, P2D, c);
  importGUIComponents();
  textAlign(CENTER,CENTER)
  slider("copies", [1, 20, 8, 1]);
  slider("radius", [50, width/2, 100, 1]);
  slider("text-size", [12, 100, 48, 1]);
  slider("spacing", [0, 2, 0.8, 0.01]);
  textarea('text-area','hey\nyou')
  colorpicker("colorpicker", ["black", "white"]);
  noStroke();
}

function draw() {
  clear();
  
  const textsize = gui['text-size'].value()
  textSize(textsize);
  const numframes = 8 * 60;
  const t = cos(InOutQuadratic((frameCount % numframes) / numframes) * PI);
  const num = gui['copies'].value();
  const radius = gui['radius'].value();
  const verticalSpacing = textsize*gui['spacing'].value();
  const colB = color(gui['colorpicker'].value());
  const colA = color(gui['colorpicker1'].value());
  background(colA);

  translate(width / 2, -(num - 1) * (verticalSpacing));
  for (let i = 0; i < num; i++) {
    const words = gui['text-area'].value().split('\n').forEach((word,id,arr)=>{
    const px = sin(t * TWO_PI + i + (TWO_PI/arr.length)*id) * radius;
    const py = height / 2;
    const s = InOutQuadratic(cos(t * TWO_PI + i + (TWO_PI/arr.length)*id) * 0.5 + 0.5);
   
    push();
    colB.setAlpha(s*255)
    fill(colB);
    translate(px, py + i * (verticalSpacing)*2);
    scale(0.5 + s);
    text(word, 0, 0);
    pop();
    
    })
  }
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
  const canvasWidth = Math.floor(canvasRatio.width * scalefactor);
  const canvasHeight = Math.floor(canvasRatio.height * scalefactor);
  resizeCanvas(canvasWidth, canvasHeight);
}
