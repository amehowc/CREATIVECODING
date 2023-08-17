//    #ef476f
//    #ffd166
//    #06d6a0
//    #118ab2
//    #073b4c
//    #f8ecd2
//september 2019
var mouse = new p5.Vector();
var dragging = false;
var bgColor = "#06d6a0";
var ballColor = "#f8ecd2";
var handleColor = "#f8ecd2";
var ballRadius = 60;
var handleRadius = 20;
var dotRadius = 2;
var dotGap = 10;

var reactionVal = -0.95;
var frictionVal = 0.99;

var ballArr = [];
var draggingStartMouse = new p5.Vector();

function setup() {
  createCanvas(windowWidth, windowHeight);
  smooth();
  ballArr.push(new Ball(width / 2, height / 2, ballRadius));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(bgColor);
  mouse.set(mouseX, mouseY);
  for (var i = 0; i < ballArr.length; i++) {
    ballArr[i].update();
    ballArr[i].display();
  }
}

function mousePressed() {
  mouse.set(mouseX, mouseY);
  for (var i = 0; i < ballArr.length; i++) ballArr[i].mousePressed();
}

function mouseReleased() {
  mouse.set(mouseX, mouseY);
  for (var i = 0; i < ballArr.length; i++) ballArr[i].mouseReleased();
}

function Ball(x, y, radius) {
  this.radius = radius;
  this.pos = new p5.Vector(x, y);
  this.velocity = new p5.Vector(0, 0);
  this.acceleration = new p5.Vector(0, 0);
  this.handlePos = this.pos.copy();
  this.grabPos = new p5.Vector();
  this.dragging = false;
}

Ball.prototype.update = function() {
  if (this.dragging) {
    this.handlePos = mouse.copy();
  }
  if (this.pos.x - this.radius < 0) {
    this.pos.x = this.radius;
    this.velocity.x *= reactionVal;
  } else if (this.pos.x + this.radius > width) {
    this.pos.x = width - this.radius;
    this.velocity.x *= reactionVal;
  }

  if (this.pos.y - this.radius < 0) {
    this.pos.y = this.radius;
    this.velocity.y *= reactionVal;
  } else if (this.pos.y + this.radius > height) {
    this.pos.y = height - this.radius;
    this.velocity.y *= reactionVal;
  }
  this.velocity.mult(frictionVal);
  this.pos.add(this.velocity);
};

Ball.prototype.display = function() {
  noStroke();
  fill(ballColor);
  ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);

  if (this.dragging) {
    var v = p5.Vector.sub(this.handlePos, this.pos);

    var dotStart = v.copy();
    dotStart.setMag(this.radius + dotGap);
    dotStart.add(this.pos);

    var handleDist = v.mag() - (handleRadius + this.radius + dotGap);
    if (handleDist < 0) handleDist = 0;
    v.setMag(handleDist);
    var dotNum = Math.floor(v.mag() / dotGap);
    v.div(dotNum + 1);

    noStroke();
    fill(handleColor);
    for (var i = 0; i < dotNum; i++) {
      var dotPos = p5.Vector.mult(v, i);
      dotPos.add(dotStart);
      ellipse(dotPos.x, dotPos.y, dotRadius * 2, dotRadius * 2);
    }

    noFill();
    stroke(handleColor);
    strokeWeight(dotRadius * 2);
    ellipse(
      this.handlePos.x,
      this.handlePos.y,
      handleRadius * 2,
      handleRadius * 2
    );
  }
};

Ball.prototype.mousePressed = function() {
  if (this.pos.dist(mouse) < this.radius) {
    draggingStartMouse.set(mouseX, mouseY);
    grabPos = p5.Vector(this.pos, draggingStartMouse);
    this.dragging = true;
  }
};

Ball.prototype.mouseReleased = function() {
  if (this.dragging) {
    this.dragging = false;
    this.acceleration = p5.Vector.sub(this.pos, mouse);
    this.acceleration.div(10);
    this.velocity.add(this.acceleration);
  }
};
