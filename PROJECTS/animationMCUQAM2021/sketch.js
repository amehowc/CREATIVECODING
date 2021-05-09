var engine, world;
var boxes = []
var colors = "f6bd60-f7ede2-f5cac3-84a59d-f28482".split("-").map(a => "#" + a)

var arrow, chevron, star, horseShoe;
let {
    Engine,
    Bodies,
    World,
    Vertices,
    Common,
    Runner,
    Mouse,
    MouseConstraint
  } = Matter

 let ground;
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  engine = Engine.create()
  world = engine.world;
  var runner = Runner.create();
  Runner.run(runner, engine);

  ground = Bodies.rectangle(width / 2, height + 25, width, 50, {
    isStatic: true
  })
  let leftBound = Bodies.rectangle(-25, height/2, 50, height, {
    isStatic: true
  })
  let rightBound = Bodies.rectangle(width+25, height/2, 50, height, {
    isStatic: true
  })

  const mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = displayDensity();
  let moptions = {
    mouse: mouse,
    constrain: {
      stiffness: 0.15
    }
  };
  mConstraint = MouseConstraint.create(engine, moptions);
  World.add(world, mConstraint);

  // World.add(world, ground)
  World.add(world, leftBound)
  World.add(world, rightBound)
  Engine.run(engine)

  world.gravity.y = 1;
  world.gravity.x = 0;

}

function generarteNewBox() {
  let {
    Engine,
    Bodies,
    World,
    Vertices,
  } = Matter
  let sz = random([40, 60, 80])
  let boxA = Bodies.polygon(mouseX,mouseY,int(random(3,10)),sz)
  //let boxA = Bodies.fromVertices(mouseX, mouseY, arrow);
  boxA.color = random(colors)
  boxes.push(boxA)
  World.add(world, boxA)


}

function mousePressed() {
  if(boxes.length<50){
  generarteNewBox()
  }
}

function draw() {
  clear()
  background(0)
  stroke(0)
  strokeWeight(1)

  boxes.forEach((box,index)=>{
    fill(box.color || 'white')
    beginShape()
      box.vertices.forEach((vertice)=>{
        vertex(vertice.x, vertice.y)
      })
      endShape()
      if(box.isOffScreen){
      console.log('hey')
      World.remove(world, box.body);
      boxes.splice(i, 1);

      }
  })

  // if (boxes.length > 100){
  //   World.remove(world, ground)
  // } else if (boxes.length<100 && !ground.bodies){
  //   World.add(world, ground)
  // }

  push()
  fill(255)
  textSize(12)
  translate(15,15)
  text(str(boxes.length),0,0)
  pop()



}
