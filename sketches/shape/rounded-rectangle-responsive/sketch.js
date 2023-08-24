import * as dom from "./gui.js";
import { scaleTo } from "./helpers.js";

const c = document.getElementById("canvas");
const container = document.getElementById("canvas-container");
// let p5;
const setupGUI = () => {
    dom.initializeGUI();
    dom.slider("width", [0, 2, 0.5, 0.001]);
    dom.slider("height", [0, 2, 0.5, 0.001]);
    dom.slider("radius", [0, 1, 0.5, 0.001]);
    dom.dropdown(
        "anchors",
        ["bottom", "left", "top", "right", "none"],
        () => {}
    );
};

function RoundedRect(x, y, r, anchor = "bottom") {
    this.pos = p5.createVector(x, y);
    this.width = r;
    this.height = r;
    this.anchor = anchor;
    this.centers = new Array(4).fill(0).map((center) => {
        return p5.createVector(0, 0, 1);
    });
    this.corners = new Array(4).fill(0).map((corner) => {
        return p5.createVector(0, 0, 1);
    });
    this.indices = [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
    ];
    this.margins = 10;
    this.maxWidth = p5.width - this.margins * 2;
    this.maxHeight = p5.height - this.margins * 2;

    this.radius = 100;
    this.definition = 48;
    this.update = (_width, _height, _radius, _anchor = "none") => {
        const minSize = Math.min(this.maxWidth, this.maxHeight) * 0.5;
        const containerW = p5.constrain(_width, 0, this.maxWidth);
        const containerH = p5.constrain(_height, 0, this.maxHeight);
        const heightExcess = Math.max(0, _height - this.maxHeight);
        const widthExcess = Math.max(0, _width - this.maxWidth);
        const wRadius = Math.max(0,containerW * 0.5-heightExcess)
        const hRadius = Math.max(0,containerH * 0.5-widthExcess);
        this.radius = Math.min(wRadius,hRadius);

        if (_anchor === "top") {
          const heightExcess = Math.max(0, _height - this.maxHeight);
          this.radius = Math.max(0,containerW * 0.5-heightExcess);
        }
        if (_anchor === "bottom") {
          const heightExcess = Math.max(0, _height - this.maxHeight);
          this.radius = Math.max(0,containerW * 0.5-heightExcess);
        }
        if (_anchor === "left") {
          const widthExcess = Math.max(0, _width - this.maxWidth)
          this.radius = Math.max(0,containerH * 0.5-widthExcess);
        }
        if (_anchor === "right") {
          const widthExcess = Math.max(0, _width - this.maxWidth)
          this.radius = Math.max(0,containerH * 0.5-widthExcess);
        }

        this.anchorsList = {
            none: [
                [0.5, 0.5],
                [0.5, 0.5],
                [0.5, 0.5],
                [0.5, 0.5],
            ],
            left: [
                [0, 0.5],
                [1, 0.5],
                [1, 0.5],
                [0, 0.5],
            ],
            top: [
                [0.5, 0],
                [0.5, 0],
                [0.5, 1],
                [0.5, 1],
            ],
            right: [
                [1, 0.5],
                [0, 0.5],
                [0, 0.5],
                [1, 0.5],
            ],
            bottom: [
                [0.5, 1],
                [0.5, 1],
                [0.5, 0],
                [0.5, 0],
            ],
        };
        const anchors = this.anchorsList[_anchor];
        this.indices.forEach((indice, corner) => {
            let offsetX = 0;
            let offsetY = 0;
            let isAnchored = 1;
            if (_anchor === "top") {
                offsetY = 0.5;
                isAnchored = anchors[corner][1];
            }
            if (_anchor === "bottom") {
                offsetY = -0.5;
                isAnchored = anchors[corner][1];
            }
            if (_anchor === "left") {
                offsetX = 0.5;
                isAnchored = anchors[corner][0];
            }
            if (_anchor === "right") {
                offsetX = -0.5;
                isAnchored = anchors[corner][0];
            }

            this.corners[corner].x =
                containerW * indice[0] * anchors[corner][0] -
                this.maxWidth * offsetX;

            this.corners[corner].y =
                containerH * indice[1] * anchors[corner][1] -
                this.maxHeight * offsetY;

            this.centers[corner].x =
                containerW * indice[0] * anchors[corner][0] -
                this.maxWidth * offsetX -
                indice[0] * this.radius;
            this.centers[corner].x = p5.constrain(
                  this.centers[corner].x,
                  -this.maxWidth/2,
                  this.maxWidth/2
              );

            this.centers[corner].y =
                containerH * indice[1] * anchors[corner][1] -
                this.maxHeight * offsetY -
                indice[1] * this.radius;
            
            this.centers[corner].y = p5.constrain(
                this.centers[corner].y,
                -this.maxHeight/2,
                this.maxHeight/2
            );

            this.centers[corner].z = isAnchored;
        });
    };
    this.show = () => {
        // this.corners.forEach((corner, index) => {
        //     const x = corner.x;
        //     const y = corner.y;
        //     p5.push();
        //     p5.fill("red");
        //     p5.ellipse(x, y, 10);
        //     p5.pop();
        // });

        // this.centers.forEach((center, index) => {
        //     const x = center.x;
        //     const y = center.y;
        //     const isAnchored = center.z;
        //     if (!isAnchored) {
        //         const x = this.corners[index].x;
        //         const y = this.corners[index].y;
        //         p5.push();
        //         p5.fill("green");
        //         p5.ellipse(x, y, 10);
        //         p5.pop();
        //     } else {
        //         const x = center.x;
        //         const y = center.y;
        //         p5.push();
        //         p5.fill("blue");
        //         p5.ellipse(x, y, 10);
        //         p5.pop();
        //     }
        // });
        p5.push();
        p5.noFill();
        p5.beginShape();
        this.centers.forEach((point, index) => {
            if (point.z === 0) {
                const x = this.corners[index].x;
                const y = this.corners[index].y;
                const u = Math.max(0, this.indices[index][0]);
                const v = Math.max(0, this.indices[index][1]);
                p5.vertex(x, y, 0, u, v);
            } else {
                for (let i = 0; i < this.definition; i++) {
                    const angle = (i / this.definition) * p5.TWO_PI * 0.25;
                    const x =
                        point.x +
                        Math.cos(angle + p5.PI + (p5.PI / 2) * index) *
                            this.radius;
                    const y =
                        point.y +
                        Math.sin(angle + p5.PI + (p5.PI / 2) * index) *
                            this.radius;
                    let u = 0;
                    let v = 0;
                    if (this.maxWidth > 0 && this.maxHeight > 0) {
                        u = p5.map(
                            x,
                            -this.maxWidth / 2,
                            this.maxWidth / 2,
                            0,
                            1,
                            true
                        );
                        v = p5.map(
                            y,
                            -this.maxHeight / 2,
                            this.maxHeight / 2,
                            0,
                            1,
                            true
                        );
                    }
                    p5.push();
                    p5.vertex(x, y, 0, u, v);
                    p5.pop();
                }
            }
        });
        p5.endShape(p5.CLOSE);
        p5.pop();
    };
}

const sketch = (p) => {
    const margins = 40;
    const canvasRatio = { width: 360, height: 640 };
    let pg, rec;

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
        setupGUI();

        rec = new RoundedRect(p.width / 2, p.height, 100);
        console.log(rec);
    };

    p.draw = () => {
        // const r = gui["sphere-radius"].value() * 200;
        p.background(220);
        rec.update(
            gui["width"].value() * p.width,
            gui["height"].value() * p.height,
            gui["radius"].value() * Math.min(p.width, p.height),
            gui["anchors"].value()
        );
        p.push();
        // p.texture(pg);
        rec.show();
        p.pop();
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
