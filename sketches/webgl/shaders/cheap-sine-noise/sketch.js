const frag = `

#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform vec2 iResolution;
uniform vec3 iMouse;
uniform float iTime;
uniform sampler2D iTexture;

varying vec2 var_vertTexCoord;

#define coloring mat3(-0.73736, 0.45628, 0.49808, 0, -0.73736, 0.67549, 0.67549, 0.49808, 0.54371)

void main() {
	
    vec2 uv = var_vertTexCoord-.5;
    if(iMouse.z > 0.){
    uv = var_vertTexCoord - iMouse.xy/iResolution;

    }
    vec3 q = vec3(uv * 10., iTime * .2);
   	vec3 c = vec3(0);
    for(int i = 0; i <8; i++){
        q = coloring * q; 
        vec3 s = sin(q.zxy);
        q += s * 2.212;
        c += s;
    }
    gl_FragColor = vec4(mix(vec3((c.x + c.y + c.z) * 0.5), c, 0.5) * .15 + .5, 1.);  


      

}

`;
const vert = `
//standard vertex shader
#ifdef GL_ES
      precision highp float;
    #endif
    // attributes, in
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aTexCoord;
    attribute vec4 aVertexColor;
    
    

    // attributes, out
    varying vec3 var_vertPos;
    varying vec4 var_vertCol;
    varying vec3 var_vertNormal;
    varying vec2 var_vertTexCoord;
    
    
    // matrices
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat3 uNormalMatrix;

    void main() {
      gl_Position = uProjectionMatrix * 
                    uModelViewMatrix * 
                    vec4(aPosition, 1.0);

      // just passing things through
      var_vertPos      = aPosition;
      var_vertCol      = aVertexColor;
      var_vertNormal   = aNormal;
      var_vertTexCoord = aTexCoord;
    }
`;

function setup() {
  createCanvas(512, 700, WEBGL);
  setAttributes("antialias", true);

  // pg = createGraphics(512,700,);
  // pg.background(255);
  // pg.translate(pg.width/2,0);
  // pg.fill(0);
  // pg.textAlign(CENTER,CENTER);
  // pg.textSize(120);
  // let count = 3;
  // for ( let i = 0; i<count; i++){
  // const a = (pg.height/count)+8;
  // pg.text('WAIT',0,a/2+i*a-80*.2);
  // }

  front = new createShader(vert, frag);
  noStroke();
}

function draw() {
  clear();
  background(15);

  let cMx = constrain(mouseX, 0, width);
  let cMy = constrain(mouseY, 0, height);

  let click = 0;
  if (mouseIsPressed) {
    click = 1;
  }
  front.setUniform("iTexture", pg);
  front.setUniform("iResolution", [width, height]);
  front.setUniform("iTime", frameCount * 0.01);
  front.setUniform("iMouse", [cMx, cMy, mouseIsPressed]);

  push();
  shader(front);
  plane(width, height);
  pop();
}
