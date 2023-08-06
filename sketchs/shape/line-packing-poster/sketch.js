function setup() {
    createCanvas(500, 700);
    noLoop();
    pixelDensity(2);
    fill(255);
    noStroke();
    z = 0;
    y = 0;
  }
  
  function draw() {
    clear();
    background(0);
  
    const mode = "fill";
  
    if (mode === "fill") {
      const firstIndex = 1;
      const added = 3;
      const mul = 3;
      const ratioRadius = 1;
      ellipseMode(CORNER);
      for (let s = firstIndex; z < height; s += 1) {
        const step = s * mul + added;
        for (let x = 0; x < step; x++) {
          ellipse(
            width * (x / step),
            y,
            width / step,
            (width / step) * ratioRadius
          );
        }
  
        if (y > height) {
          break;
        }
  
        y += (width / step) * ratioRadius;
      }
    }
    if (mode === "centered") {
      const firstIndex = 1;
      const added = 0.5;
      const mul = 1;
      const ratioRadius = 0.25;
      ellipseMode(CENTER);
      z = ratioRadius * width * 0.33;
      for (let s = firstIndex; z < height; s += 1) {
        const step = s * mul + added;
  
        ellipse(width / 2, z, width / step, (width / step) * ratioRadius);
  
        if (y > height) {
          break;
        }
  
        z += (width / step) * ratioRadius * 0.8;
      }
    }
    paper();
  }
  
  function paper() {
    for (var i = 0; i < width; i += 2) {
      for (var j = 0; j < height; j += 2) {
        fill(random(175, 225), 25);
        rect(i, j, 2, 2);
      }
    }
  }
  