let logoShapes = [];
let boundaries = [];
let boxes = [];
let margins = 0;

const colors = "009F4D-003DA5-D22730-F04E98-FF6720"
  .split("-")
  .map((a) => "#" + a);

let {
  Engine,
  Bodies,
  World,
  Vertices,
  Common,
  Runner,
  Mouse,
  MouseConstraint,
  Svg,
} = Matter;

let ground;
let b;
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  margins = width/6
  engine = Engine.create();
  world = engine.world;
  var runner = Runner.create();
  Runner.run(runner, engine);

  ground = Bodies.rectangle(width / 2, height + 25, width, 50, {
    isStatic: true,
  });
  let leftBound = Bodies.rectangle(-25, height / 2, 50, height, {
    isStatic: true,
  });
  let rightBound = Bodies.rectangle(width + 25, height / 2, 50, height, {
    isStatic: true,
  });
  ceiling = Bodies.rectangle(width / 2, -25, width, 50, {
    isStatic: true,
  });
  const mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = displayDensity();
  let moptions = {
    mouse: mouse,
    constrain: {
      stiffness: 0.15,
    },
  };
  mConstraint = MouseConstraint.create(engine, moptions);
  World.add(world, mConstraint);
  boundaries.push(ground, leftBound, rightBound, ceiling);

  World.add(world, ground);
  World.add(world, leftBound);
  World.add(world, rightBound);
  World.add(world, ceiling);
  b;
  Engine.run(engine);

  world.gravity.y = 0.5;
  world.gravity.x = 0;

  for (let shape in allShapesBounds) {
    let actual = allShapesBounds[shape];
    let render = allShapesRender[shape];
    var options = {
      friction: 0.1,
      restitution: 0.0,
      isStatic: true,
    };
    actual = getRelativePoint(actual, windowWidth - margins * 2, windowHeight);
    render = getRelativePoint(render, windowWidth - margins * 2, windowHeight);
    logoShapes.push(new LogoShape(actual, render, options));
  }
}

function generarteNewBox() {
  let { Bodies, World } = Matter;
  let sz = random([40, 60, 80]);
  let box = Bodies.polygon(mouseX, mouseY, int(random(3, 10)), sz);
  box.color = random(colors);
  boxes.push(box);
  World.add(world, box);
  // console.log(boxes);
}

function mousePressed() {
  if (boxes.length < 20) {
    generarteNewBox();
  }
}

function draw() {
  clear();
  background(125);
  Engine.update(engine);
  push();
  logoShapes.forEach((shape) => shape.show());

  //debug view for collisions
  // fill(0);
  // logoShapes.forEach((shape) => {
  //
  //   beginShape();
  //   for(let point of shape.body.vertices){
  //     // console.log(point)
  //     vertex(point.x,point.y)
  //   }
  //   endShape(CLOSE);
  //   // console.log(shape);
  // });



  pop();
  for (let box of boxes) {
    fill(box.color || "white");
    beginShape();
    for (let vert of box.vertices) {
      vertex(vert.x, vert.y);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
