//september 2019

var palette;
var numDiamonds;
var diamonds = [];
let kind;

function setup() {
  createCanvas(640, 640);
  palette = randomPalette1000();
  // palette = getPalette1000(568);
  numDiamonds = 33;
  setupDiamonds();
  kind = "line";
}

function setupDiamonds() {
  for (let i = 0; i < numDiamonds; i++) {
    var diamond = {
      color: color(palette[i % 5]),
      bottomPoint: height / 4 + (height / 2 / numDiamonds) * i,
      update: function() {
        this.bottomPoint += height / 2 / numDiamonds / 20;
        if (this.bottomPoint > (height * 3) / 4) {
          this.bottomPoint = height / 4;
          diamonds.unshift(diamonds.pop());
        }
      }
    };
    diamonds.push(diamond);
  }
}

function draw() {
  clear();
  noStroke();
  background(palette[2]);
  drawDiamonds(kind);
  drawBackground();
}

function drawBackground() {
  fill(250, 250, 255);
  stroke(250, 250, 255);
  strokeWeight(5);
  beginShape();
  vertex(0, 0);
  vertex(width, 0);
  vertex(width, height);
  vertex(0, height);
  beginContour();
  vertex(width / 2, height / 4);
  vertex(width / 4, height / 2);
  vertex(width / 2, (height * 3) / 4);
  vertex((width * 3) / 4, height / 2);
  endContour(CLOSE);
  endShape(CLOSE);
}

function drawDiamonds(type) {
  for (let i = 0; i < numDiamonds; i++) {
    let diamond = diamonds[numDiamonds - 1 - i];
    diamond.update();

    fill(diamond.color);

    let constmouseY = constrain(mouseY, 0, windowHeight);
    let spacer = map(constmouseY, 0, height, 0, width / 2);
    let offset =
      sin(
        width / 4 -
          dist(width / 2, diamond.bottomPoint, width / 2, height / 2) / 20
      ) * 15;
    let offmouse = map(mouseX, 0, width, -offset, offset);

    if (type == "curve") {
      beginShape();
      vertex(width / 4 - spacer, height / 2);
      curveVertex(width / 4 - spacer, height / 2);
      curveVertex(width / 2, height / 4);
      vertex((width * 3) / 4 + spacer, height / 2);
      curveVertex((width * 3) / 4 + spacer, height / 2);
      curveVertex(width / 2 + offmouse, diamond.bottomPoint);
      curveVertex(width / 4 - spacer, height / 2);
      vertex(width / 4 - spacer, height / 2);
      endShape();
    } else if (type == "line") {
      beginShape();
      vertex(width / 4 - spacer, height / 2);

      vertex(width / 2, height / 4);
      vertex((width * 3) / 4 + spacer, height / 2);
      vertex(width / 2 + offmouse, diamond.bottomPoint);

      vertex(width / 4 - spacer, height / 2);
      endShape();
    }
  }
}

function mousePressed() {
  if (mouseIsPressed) {
    if (kind == "line") {
      kind = "curve";
    } else {
      kind = "line";
    }
  }
}

function keyPressed() {
  if (keyCode == 32) {
    palette = randomPalette1000();
    for (let i = 0; i < diamonds.length; i++) {
      diamonds[i].color = palette[i % 5];
    }
  }
}

/* Prevents up and down arrow from moving page up and down */
window.addEventListener(
  "keydown",
  function(e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  },
  false
);
