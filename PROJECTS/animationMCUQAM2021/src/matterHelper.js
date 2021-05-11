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
  World.add(world, this.body);

  this.show = function () {
    const { position, angle } = this.body;

    push();
    translate(position.x, position.y);
    rotate(angle);
    fill(renderData.color);
    beginShape();
    this.renderShape.path.forEach((vertice) => {
      vertex(vertice.x, vertice.y);
    });
    endShape(CLOSE);
    pop();
  };
}
