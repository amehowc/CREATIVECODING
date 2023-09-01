import * as dom from "./gui.js";
import { uploadedImage } from "./components/imageUpload.js";
import { scaleTo } from "./helpers.js";

const c = document.getElementById("canvas");
const container = document.getElementById("canvas-container");

const setupGUI = () => {
  // dom.initializeGUI();
  // dom.slider("sphere-radius", [0, 1, 0.5, 0.001]);
};

const sketch = (p) => {
  const margins = 40;
  const canvasRatio = { width: 600, height: 900 };
  let pg,circleSystem;
  let colors = []
  
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

    circleSystem = new CirclePathSystem();
    circleSystem.initialize(p.width / 2, p.height / 2, 8);
    setupGUI()
  };

  p.draw = () => {
    //const r = gui["sphere-radius"].value() * 200;
    p.background('antiquewhite');
    circleSystem.run();
    circleSystem.show();
    // p.noLoop()
    if ( circleSystem.canAddMoreCircles === false) p.noLoop()
    
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
  p.keyTyped= () =>  {
    if (key === "t") cp.show = !cp.show;
  }
  
  p.mousePressed= () => {
    if (!circleSystem.allDone) {
      console.log("computer is still computing");
      return;
    } else {
      // save()
      circleSystem.paths = [];
      circleSystem.colors = [];
      circleSystem.allDone = false;
      const x = p.mouseX
      const y = p.mouseY
      circleSystem.initialize(x, y, Math.floor(p.random(4, 8)));
    }
  }
};
p5 = new p5(sketch);

