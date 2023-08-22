import * as dom from "./gui.js";
import { uploadedImage } from "./components/imageUpload.js";
import { scaleTo } from "./helpers.js";

const c = document.getElementById("canvas");
const container = document.getElementById("canvas-container");

const setupGUI = () => {
  dom.initializeGUI();
  dom.slider("sphere-radius", [0, 1, 0.5, 0.001]);
  dom.sliders("dimensions");
  dom.button("button", "hello", () => {
    console.log("prout");
  });
  dom.buttons("time-control");
  dom.dropdown("dropdown");
  dom.colorpicker("color-picker");
  dom.textarea('text-area')
  dom.paragraph('paragraph','this is pretty cool')
  dom.imageUpload('image-upload')
};

const sketch = (p) => {
  const margins = 40;
  const canvasRatio = { width: 360, height: 640 };
  let pg; 
  
  p.setup = () => {
    const scalefactor = scaleTo(
      canvasRatio.width,
      canvasRatio.height,
      container.clientWidth - margins * 2,
      container.clientHeight - margins * 2
    );
    const canvasWidth = Math.floor(canvasRatio.width * scalefactor);
    const canvasHeight = Math.floor(canvasRatio.height * scalefactor);
    p.createCanvas(canvasWidth, canvasHeight, p.P2D, c);
    pg = p.createGraphics(p.width,p.height)
    pg.reset()
    pg.background('blue')
    pg.translate(pg.width / 2, pg.height / 2);
    pg.ellipse(0, 0, 200);
    // setupGUI()
  };

  p.draw = () => {
    // const r = gui["sphere-radius"].value() * 200;
    p.image(pg,0,0,p.width,p.height)
  };

  p.windowResized = () => {
    const scalefactor = scaleTo(
      canvasRatio.width,
      canvasRatio.height,
      container.clientWidth - margins * 2,
      container.clientHeight - margins * 2
    );
    const canvasWidth = Math.floor(canvasRatio.width * scalefactor);
    const canvasHeight = Math.floor(canvasRatio.height * scalefactor);
    p.resizeCanvas(canvasWidth, canvasHeight);
  };
};
p5 = new p5(sketch);

