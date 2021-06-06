function LogoShape(boundsData, renderData, options) {
  var options = options;
  let verts = boundsData.path;
  this.renderShape = renderData;
  this.body = Bodies.fromVertices(
    boundsData.position.x,
    boundsData.position.y,
    verts,
    options
  );

  this.willHaveAnImage = Math.random(0,1) > 0.5 ? true : false
  this.pickedImage = Math.round(Math.random(0,4))

  World.add(world, this.body);

  this.show = function (image) {
    const { position, angle } = this.body;
    const ctx = drawingContext

    push();
    translate(position.x, position.y);
    rotate(angle);
    if(this.willHaveAnImage){
      ctx.save()
      fill(255,0)
      beginShape();
      this.renderShape.path.forEach((vertice) => {
        vertex(vertice.x, vertice.y);
      });
      endShape(CLOSE);
      ctx.clip()
      image(image[this.pickedImage],0,0)
      ctx.restore()

    } else {
    fill(renderData.color);
    beginShape();
    this.renderShape.path.forEach((vertice) => {
      vertex(vertice.x, vertice.y);
    });
    endShape(CLOSE);
    }
    pop();
  };
}
