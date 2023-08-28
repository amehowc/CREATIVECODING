import * as dom from "./gui.js";
import { scaleTo } from "./helpers.js";

const c = document.getElementById("canvas");
const container = document.getElementById("canvas-container");
const setupGUI = () => {
    dom.initializeGUI();
    dom.slider("width", [0, 2, 1, 0.001]);
    dom.slider("height", [0, 2, 0.5, 0.001]);
    dom.dropdown(
        "anchors",
        ["bottom", "left", "top", "right", "none"],
        () => {}
    );
    dom.checkbox("animate-checkbox", "Animator", true);
};

const colors = ["#f4d730", "#f44e24", "#2a76d3", "#f398c3", "#23b247"];
const easing = (p, pow) => {
  if( pow === undefined ) pow = 2;
  if (pow) pow < 2 ? pow = 2 : pow;
  const a = p - 1,
    b = p * 2;
  if (b < 1) return p * Math.pow(b, pow - 1);
  const c = pow % 2 == 0 ? 1 - Math.pow(a, pow) * Math.pow(2, pow - 1) :
    1 + Math.pow(a, pow) * Math.pow(2, pow - 1);
  return c;
};

const sketch = (p) => {
    const margins = 40;
    const canvasRatio = { width: 360, height: 640 };
    let pg, rects, img;

    p.preload = () => {
        img = p.loadImage("flowers_03.png");
    };

    p.setup = () => {
        const scalefactor = scaleTo(
            canvasRatio.width,
            canvasRatio.height,
            container.clientWidth - margins * 2,
            container.clientHeight - margins * 2
        );
        const canvasWidth = Math.floor(canvasRatio.width * scalefactor);
        const canvasHeight = Math.floor(canvasRatio.height * scalefactor);
        p.createCanvas(canvasWidth, canvasHeight, p.WEBGL, c);
        p.textureMode(p.NORMAL);
        pg = p.createGraphics(p.width, p.height);
        pg.background("red");
        pg.noStroke();
        img.resize(0, p.height);
        pg.image(img, 0, 0, pg.width, pg.height);
        // pg.ellipse(pg.width/2,pg.height/2,100)
        setupGUI();
        p.noStroke();
        rects = new Array(10).fill(0).map((rect) => {
            return new RoundedRect(p.width / 2, p.height, 100);
        });
        // console.log(rects)
    };

    p.draw = () => {
        p.background(220);
        const animate = gui["animate-checkbox"].checked();
        if (animate) {
            const numframes = 6 * 60;

            const progress = (p.frameCount % numframes) / numframes;
            const animateIn = p5.map(progress, 0, 0.5, 0, 1, true);
            const animateOut = p5.map(progress, 0.5, 1, 0, 1, true);
            let width = 0;
            let height = 0;

            rects.forEach((rect, id) => {
                const step = 0.5 / rects.length;
                const startIn = step * id;
                const endIn = step * (id + 5);

                const staggerIn = easing(
                    p5.map(animateIn, startIn, endIn, 0, 1, true),2
                );
                const startOut = step * (rects.length-id);
                const endOut = step * ((rects.length-id + 5));
                const staggerOut = easing(
                  p5.map(animateOut, startOut, endOut, 0, 1, true),2
              );
                
                const stagger = staggerIn - staggerOut;
                const anchor = gui["anchors"].value();
                switch (anchor) {
                    case "top":
                        width = gui["width"].value() * p.width;
                        height = stagger * (p.height + p.width / 2);
                        break;
                    case "bottom":
                        width = gui["width"].value() * p.width;
                        height = stagger * (p.height + p.width / 2);
                        break;
                    case "left":
                        height = gui["height"].value() * p.height;
                        width = stagger * (p.width+ p.width);
                        break;
                    case "right":
                        height = gui["height"].value() * p.height;
                        width = stagger * (p.width+ p.width);
                        break;
                    case "none":
                        height = stagger * (p.height + p.width / 2);
                        width = stagger * (p.width+ p.width / 2);
                        break;
                }

                p.push();
                rect.update(width, height, anchor);
                p.fill(colors[id % colors.length]);
                rect.show();
                p.pop();
            });
        } else {
            rects[0].update(
                gui["width"].value() * p.width,
                gui["height"].value() * p.height,
                gui["anchors"].value()
            );
            p.push();
            p.texture(pg);
            rects[0].show();
            p.pop();
        }
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
