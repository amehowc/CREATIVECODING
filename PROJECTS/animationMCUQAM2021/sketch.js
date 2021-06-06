let logoShapes = boundaries = boxes = imgs = [];
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
// let imgs = new Array(5).fill(0)

const numImages = 5
function preload(){
  // was working, dont work anymore, issues seems from CrossOrigin
  // imgs = new Array(5).fill(0)
  // imgs.forEach((image,index)=>{
  //   const slug = '0'+index+'.png'
  //   const img = loadImage(`${slug}`)
  //   imgs[index] = img;
  //   })

  img00 = loadImage('00.png')
  img01 = loadImage('01.png')
  img02 = loadImage('02.png')
  img03 = loadImage('03.png')
  img04 = loadImage('04.png')

  imgs.push(img00,img01,img02,img03,img04)


}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER)
  noStroke();
  margins = 200
  engine = Engine.create();
  world = engine.world;
  var runner = Runner.create();
  Runner.run(runner, engine);

  ground = Bodies.rectangle(width / 2, height + 25, width, 50, {
    friction: 0.1,
    isStatic: true,
  });
  let leftBound = Bodies.rectangle(-25, height / 2, 50, height, {
    friction: 0.1,
    isStatic: true,
  });
  let rightBound = Bodies.rectangle(width + 25, height / 2, 50, height, {
    friction: 0.1,
    isStatic: true,
  });
  ceiling = Bodies.rectangle(width / 2, -25, width, 50, {
    friction: 0.1,
    isStatic: true,
  });
  const mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = displayDensity();
  let moptions = {
    mouse: mouse,
    constrain: {
      friction: 0.1,
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
  Engine.run(engine);

  world.gravity.y = 0.0;
  world.gravity.x = 0;

  for (let shape in allShapesBounds) {
    let actual = allShapesBounds[shape];
    let render = allShapesRender[shape];
    var options = {
      friction: 0.1,
      restitution: 0.0,
      isStatic: false,
    };
    actual = getRelativePoint(actual, width, windowWidth - margins * 2, height, windowHeight- margins * 2);
    render = getRelativePoint(render, width, windowWidth - margins * 2, height, windowHeight- margins * 2);
    logoShapes.push(new LogoShape(actual, render, options));
  }
}
// To add a shape to the engine and to P5
// function generarteNewBox() {
//   let { Bodies, World } = Matter;
//   let sz = random([40, 60, 80]);
//   let box = Bodies.polygon(mouseX, mouseY, int(random(3, 10)), sz);
//   box.color = random(colors);
//   boxes.push(box);
//   World.add(world, box);
//   // console.log(boxes);
// }

function draw() {
  clear();
  background(125);
  Engine.update(engine);
  push();
  logoShapes.forEach((shape) => shape.show(imgs));

  // debug view for collisions
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

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
