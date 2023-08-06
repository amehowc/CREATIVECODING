class Box {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.z = 1;
    this.direction = 0;
    this.transition = 0;
    // doubling the values because it seems that the random()
    // avoid the edge cases more time than less.
    this.pick = [
      -PI,
      PI,
      -PI * 1.5,
      PI * 1.5,
      -PI * 2,
      PI * 2,
      -PI,
      PI,
      -PI * 1.5,
      PI * 1.5,
      -PI * 2,
      PI * 2
    ];
    this.rotation = {
      x: random(this.pick),
      y: random(this.pick),
      z: random(this.pick)
    };
    this.rotate = 0;
  }

  update() {
    if (this.direction === -1) {
      this.rotate = InOutQuadratic(map(this.transition, 0, 0.95, 0, 1, true));
      this.z = map(OutBounce(this.transition), 0, 1, 1, -1, true);
      this.transition += 1 / loop;
    }

    if (this.transition >= 1) {
      this.stop();
    }
  }

  stop() {
    this.transition = 0;
    this.direction = 0;
    this.rotate = 0;
  }

  fall() {
    this.direction = -1;
    this.transition = 0;
  }

  render() {
    push();
    translate(this.x, this.y, (this.z * height) / 2 + worldY);
    // console.log(this.rotate)
    rotateX(this.rotate * this.rotation.x);
    rotateY(this.rotate * this.rotation.y);
    rotateZ(this.rotate * this.rotation.z);
    box(size - 1);
    pop();
  }
}
