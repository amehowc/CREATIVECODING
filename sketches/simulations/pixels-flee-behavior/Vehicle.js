function Vehicle(x, y, z) {
    this.pos = createVector(x, y);
    this.target = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.rad = z;
    this.r = 1;
    this.maxspeed = 6;
    this.maxforce = 1;
  }
  
  Vehicle.prototype.behaviors = function () {
    var arrive = this.arrive(this.target);
    var mouse = createVector(mouseX, mouseY);
    var flee = this.flee(mouse);
    arrive.mult(1);
    flee.mult(4);
    this.applyForce(flee);
    this.applyForce(arrive);
  };
  
  Vehicle.prototype.applyForce = function (f) {
    this.acc.add(f);
  };
  
  Vehicle.prototype.update = function () {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
    this.dist = p5.Vector.dist(this.pos, this.target);
  };
  

  
  Vehicle.prototype.edges = function () {
    if (this.pos.x > width) {
      this.pos.x = width;
    }
  
    if (this.pos.x < 0) {
      this.pos.x = 0;
    }
  
    if (this.pos.y > height) {
      this.pos.y = height;
    }
  
    if (this.pos.y < 0) {
      this.pos.y = 0;
    }
  };
  
  Vehicle.prototype.arrive = function (target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    var speed = this.maxspeed;
    if (d < 100) {
      speed = map(d, 0, 100, 0, this.maxspeed);
    }
    desired.setMag(speed);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  };
  
  Vehicle.prototype.flee = function (target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    if (d < 75) {
      desired.setMag(this.maxspeed);
      desired.mult(-1);
      var steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  };