let x, y, z;
let h, w, a;
let fontRatio = 0;

function setup() {
  createCanvas(500, 700);
  pixelDensity(2)
  noLoop();
  
  y = 0;
  fontRatio = 140;
}

function draw() {
  clear();
  background(252);
  
  const txt = (x, y, g, c) => {
    textSize(g);
    fill(c);
    text("MAEDA", x, y);
  };
  
  
  //line-packed version
  /*
  textAlign(LEFT, CENTER);
  for (let s = 1; s < 300; s++) {
    for(let x = 0; x<s; x++){
    //magic number here
    txt(x*fontRatio*3.6, y + fontRatio / 2, fontRatio, 25);
    }
    y += fontRatio*.8;
    fontRatio = 140/(s+1);
    if(y >= height) break
  }
  */
  //centered version 
  textAlign(CENTER, CENTER);
  for (let s = 1; s < 300; s++) {
    txt(width/2, y + fontRatio / 2, fontRatio, 25);
    y += fontRatio*.8;
    fontRatio = 140/(s+1);
    if(y >= height) break
  }  
  noStroke()
  paper();

}

function paper() {
  noStroke();
  for (var i = 0; i < width; i += 2) {
    for (var j = 0; j < height; j += 2) {
      fill(random(175, 225), 25);
      rect(i, j, 2, 2);
    }
  }
}
