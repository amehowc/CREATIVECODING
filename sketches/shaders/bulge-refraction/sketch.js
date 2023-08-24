let totalDomUnits = 0;
const c = document.getElementById("canvas");
const container = document.getElementById("canvas-container");

let img;
let otherimg;
function preload(){
  otherimg = loadImage('flowers.png')
}

const rendervert = `
  precision mediump float;
  attribute vec3 aPosition;
  attribute vec3 aNormal;
  attribute vec2 aTexCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat3 uNormalMatrix;
  
  uniform vec2 resolution;
  uniform vec2 imageResolution;
  
  varying vec2 vertCoord;
    vec2 resizeUvCover(vec2 uv, vec2 size, vec2 resolution) {
    vec2 ratio = vec2(
        min((resolution.x / resolution.y) / (size.x / size.y), 1.0),
        min((resolution.y / resolution.x) / (size.y / size.x), 1.0)
    );

    return vec2(
        uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
    }
  void main(void) {
    vec4 positionVec4 = vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * 
                  uModelViewMatrix * 
                  positionVec4;
    vertCoord = resizeUvCover(aTexCoord, imageResolution, resolution);
  }
`;
const renderfrag = `
  precision mediump float;
  varying vec2 vertCoord;
  
  uniform sampler2D texture;
  uniform vec2 resolution;
  uniform vec2 mouse;
  uniform vec2 imageResolution;
  uniform float time;
  uniform float radius;
  uniform float strength;
  uniform float refraction;
  uniform float lense;
  uniform float noiseColor;
  uniform float noiseRefraction;
  uniform float noiseContrast;


  // const float radius = 0.6;
  // const float strength = 1.0;

float mask(vec2 uv, vec2 center, float radius, float strength) {
  uv -= center;
  float dist = length(uv) / radius;
  float distPow = pow(dist, 2.);
  float strengthAmount = strength / (1.0 + distPow);
  
  return strengthAmount;
}

vec2 invertedbulge(vec2 uv, vec2 center, float radius, float strength) {
  uv -= center;
  float dist = length(uv) / radius;
  float distPow = pow(dist, 2.);
  float strengthAmount = strength / (1.0 + distPow);
  uv *= strengthAmount; 
  uv += center;
  return uv;
}

float hash13(vec3 p3)
{
	p3  = fract(p3 * .1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
}

  void main(){
    vec2 uv = vertCoord;
    vec2 center = vec2(0.5, 0.5);
    vec2 bulgeUV = invertedbulge(uv, mouse, radius, strength);
    
    float mask = mask(uv, mouse, radius, strength);
    float salt = hash13(vec3(gl_FragCoord.xy,(mask+time)));
    vec4 tex = vec4(vec3(0),1.);
    float pixel_angle = atan(uv.x-(mouse.x),uv.y-(mouse.y));
    float pixel_distance =  length(vec2(uv)-(mouse))* 1.0 ;
    vec2 polar = vec2(pixel_angle, pixel_distance);


    for(float i = 0.;i<5.;i++){
    float offset = i/5.*refraction+salt * noiseRefraction;
    float shrink = i/5.*lense;
    vec2 uv_r = invertedbulge(uv,mouse,radius+shrink,strength+offset);
    float r = texture2D(texture,uv_r+salt*noiseColor).r;

    vec2 uv_g = invertedbulge(uv,mouse,radius,strength);
    float g = texture2D(texture,uv_g).g;

    vec2 uv_b = invertedbulge(uv,mouse,radius-shrink,strength-offset);
    float b = texture2D(texture,uv_b-salt*noiseColor).b;
    
    tex.rgb += vec3(r,g,b)/5.;
    }
    
    gl_FragColor = vec4(tex.rgb,1.);
  }
  `;


function setup() {
  const canvasRatio = { width: 400, height: 800 };
  const margins = 40;
  const scalefactor = scaleTo(
    canvasRatio.width,
    canvasRatio.height,
    container.clientWidth - margins * 2,
    container.clientHeight - margins * 2
  );
  const canvasWidth = Math.floor(canvasRatio.width * scalefactor);
  const canvasHeight = Math.floor(canvasRatio.height * scalefactor);
  createCanvas(canvasWidth, canvasHeight, WEBGL, c);
  importGUIComponents();
  rectMode(CENTER);
  slider("radius", [0, 1, 0.6, 0.001]);
  slider("zoom", [0, 1.5, 1.1, 0.001]);
  slider("refraction", [0, 1, 0.1, 0.001]);
  slider("lense", [0, 1, 0.1, 0.001]);
  slider("noise-refraction", [0, 0.1, 0.01, 0.001]);
  slider("noise-color", [0, 0.05, 0.01, 0.001]);
  imageUploadButton('image-upload')
  noStroke();
  renderShader = createShader(rendervert, renderfrag);
}

function draw() {
  background(220);
  noStroke();

  const mouse =
    mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height
      ? [
         cos(frameCount*0.01)*.25+.5,
         sin(frameCount*0.01)*.25+.5,
        ]
      : [
          constrain(mouseX, 0, width) / width,
          constrain(mouseY, 0, height) / height,
        ];

  // fbo();
  const pickedimage = img ? img : otherimg
  const uniforms = {
    texture: pickedimage,
    resolution: [width, height],
    imageResolution: [pickedimage.width, pickedimage.height],
    time: frameCount * 0.03,
    mouse: mouse,
    radius : gui['radius'].value(),
    strength : gui['zoom'].value(),
    refraction : gui['refraction'].value(),
    lense : gui['lense'].value(),
    noiseColor : gui['noise-color'].value(),
    noiseRefraction : gui['noise-color'].value(),

  };
  createUniforms(renderShader, uniforms);
  shader(renderShader);
  rect(0, 0, width, height);
}

function windowResized() {
  const canvasRatio = { width: 360, height: 640 };
  const margins = 40;
  const scalefactor = scaleTo(
    canvasRatio.width,
    canvasRatio.height,
    container.clientWidth - margins * 2,
    container.clientHeight - margins * 2
  );
  const canvasWidth = Math.floor(canvasRatio.width * scalefactor);
  const canvasHeight = Math.floor(canvasRatio.height * scalefactor);
  resizeCanvas(canvasWidth, canvasHeight);
}
