const frag = `
precision mediump float;

#define TWO_PI 6.28318530718

uniform vec2 resolution;
uniform float time;
uniform sampler2D texture;
uniform float repeats;
uniform vec2 distance;
uniform vec2 strength;
uniform vec2 speed;
uniform vec2 slope;
varying vec2 texCoord;

float sign2D(float aCount,float aLength, float bCount,float bLength, float Speed, float slopeN) {
  float sinus = sin((time*Speed + aCount*aLength + bCount*bLength));
  float sign = (sinus >= 0. ? 1.: -1.);
  float sinerSquare = sign * (1.-pow(1.-abs(sinus),slopeN));
  return sinerSquare;
}

/*float cosign2D(float aCount,float aLength, float bCount,float bLength, float Speed, float slopeN) {
  float sinus = cos((iTime*Speed + aCount*aLength + bCount*bLength));
  float sign = (sinus >= 0. ? 1.: -1.);
  float sinerSquare = sign * (1.-pow(1.-abs(sinus),slopeN));
  return sinerSquare;
}*/

void main() {
	 vec2 uv = texCoord;
   uv -= .5;
   uv *= repeats;
   uv += .5;
   float len = 0.;

    for ( float i = 0.; i<5.0; i++){
      len = length(vec2(uv.x,uv.y))*0.;
      uv.x += distance.x * sign2D(i,len, strength.x ,uv.y, speed.x, slope.x);
      uv.y += distance.y * sign2D(i,len, strength.y, uv.x, speed.y, slope.y);
    } ;
   

    vec3 color = texture2D(texture,fract(uv)).rgb;
    gl_FragColor = vec4(color,1.);
    
}

`;
const vert = `
    precision mediump float;

    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aTexCoord;
    attribute vec4 aVertexColor;

    varying vec2 texCoord;
    
    // matrices
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat3 uNormalMatrix;

    void main() {
      gl_Position = uProjectionMatrix * 
                    uModelViewMatrix * 
                    vec4(aPosition, 1.0);

      texCoord = aTexCoord;
    }
`;
