const buffer_frag = `
precision highp float;
#define TWO_PI 6.28318530718
#define PI TWO_PI*.5

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;
uniform sampler2D buffer;
varying vec2 vertTexCoord;
varying vec3 vertNormal;
varying vec3 vertNormalMatrix;
varying vec3 vertPos;
uniform mat3 uNormalMatrix;

uniform float uIorR;
uniform float uIorY;
uniform float uIorG;
uniform float uIorC;
uniform float uIorB;
uniform float uIorP;
uniform float uSaturation;
uniform float uChromaticAberration;
uniform float uRefractPower;
uniform float uFresnelPower;
uniform float uShininess;
uniform float uDiffuseness;
uniform vec3 uLight;


float map(float val, float inA, float inB, float outA, float outB) {
  return (val - inA) / (inB - inA) * (outB - outA) + outA;
}
vec3 irri(float hue) {
  
  return .5+ .55 *cos(( 9.*hue)+ vec3(0,23.,21.));

}

vec3 sat(vec3 rgb, float adjustment) {
  const vec3 W = vec3(0.2125, 0.7154, 0.0721);
  vec3 intensity = vec3(dot(rgb, W));
  return mix(intensity, rgb, adjustment);
}

/*float fresnel(vec3 eyeVector, vec3 worldNormal, float power) {
  float fresnelFactor = abs(dot(eyeVector, worldNormal));
  float inversefresnelFactor = 1.0 - fresnelFactor;
  
  return pow(inversefresnelFactor, power);
}*/

float specular(vec3 eyeVector, vec3 worldNormal, vec3 light, float shininess, float diffuseness) {
  vec3 normal = worldNormal;
  vec3 lightVector = normalize(-light);
  vec3 halfVector = normalize(eyeVector + lightVector);

  float NdotL = dot(normal, lightVector);
  float NdotH =  dot(normal, halfVector);
  float kDiffuse = max(0.0, NdotL);
  float NdotH2 = NdotH * NdotH;

  float kSpecular = pow(NdotH2, shininess);
  return kSpecular + kDiffuse * diffuseness;
}

float fresnel(vec3 direction, vec3 normal, float power, bool invert) {
    vec3 halfDirection = normalize( normal + direction );
    float cosine = dot( halfDirection, direction );
    float product = max( cosine, 0.0 );
    float factor = invert ? 1.0 - pow( product, power ) : pow( product, power );
    return factor;
}
/*
void main()
{
    float iorRatio = 1./1.05;
	vec2 uv = gl_FragCoord.xy/resolution;
    uv.y = 1.-uv.y;
    vec3 eye = vec3(0.0,0.0,-5.);
    vec3 normal = normalize(vertNormal);
    vec3 refractVec = refract(eye, normal, iorRatio);
    vec4 color = texture2D(image, uv+refractVec.xy)*.9;
    float fresnel = fresnel(eye,normal,3.)*3.;
   	// vec3 tex = texture2D(image,uv).rgb;
    color += fresnel;
	gl_FragColor = vec4(color.rgb , 1.0);
	
}*/

float r3d(vec3 c) {
    float n = dot(c, vec3(127.1, 311.7, 74.7));
    return fract(sin(n) * 43758.5453123);
}

vec4 sampleBackground(vec3 normal, sampler2D bg) {
  // x = rho sin(phi) cos(theta)
  // y = rho cos(phi)
  // z = rho sin(phi) sin(theta)
  // rho = 1 after normalization
  float phi = acos(normal.y);
  float sinPhi = sin(phi);
  float theta =
    abs(sinPhi) > 0.0001
      ? acos(normal.x / sinPhi)
      : 0.;
  vec2 coord = vec2(
    map(theta, 0., PI, 0., 1.),
    map(phi, 0., PI, 1., 0.)
  );
  
  // float t = time * 0.0125;
  //   float l= coord.x;
  //   vec3 col=vec3(
  //       sin(t*0.51+l*1.5+93.0)+sin(t*0.12+l*3.2+35.0),
  //       sin(t*0.37-l*1.7+12.1)+sin(t*0.17+l*1.9-85.0),
  //       sin(t*0.45+l*2.1+15.0)+sin(t*0.22+l*2.5+95.0)
  //   )*0.25+0.5;
  //   return vec4(col*coord.y*(1.0-coord.y)*4.0,1.);
    
  return texture2D(bg, coord);
}

vec4 remapShadows(vec4 color) {
  float factor = 8.;
  return vec4(
    pow(color.x, factor),
    pow(color.y, factor),
    pow(color.z, factor),
    color.w
  );
}

const int LOOP = 16;

void main(){
  float iorRatioRed = 1.0/uIorR;
  float iorRatioGreen = 1.0/uIorG;
  float iorRatioBlue = 1.0/uIorB;

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv.y = 1.-uv.y;
  vec3 normal = (vertNormal);
  vec3 color = vec3(0.0);
  vec3 eye = vec3(0.0,0.0,-1.);
  // Add specular light
  float specularLight = specular(eye, normal, uLight, uShininess, uDiffuseness);
  float salt = r3d(vec3(gl_FragCoord.xy,color.z))*.125;
  
  for (int i = 0; i < LOOP; i++) {
  
  float slide = (float(i) / float(LOOP)) * 0.2;
  // 
  vec3 refractVecR = refract(eye, normal, (1.0 / uIorR));
  vec3 refractVecY = refract(eye, normal, (1.0 / uIorY));
  vec3 refractVecG = refract(eye, normal, (1.0 / uIorG));
  vec3 refractVecC = refract(eye, normal, (1.0 / uIorC));
  vec3 refractVecB = refract(eye, normal, (1.0 / uIorB));
  vec3 refractVecP = refract(eye, normal, (1.0 / uIorP));
  
  float r = texture2D(texture, uv + refractVecR.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 0.5;
  float y = (texture2D(texture, uv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 2.0 +
             texture2D(texture, uv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).y * 2.0 -
             texture2D(texture, uv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).z) / 6.0;
  float g = texture2D(texture, uv + refractVecG.xy * (uRefractPower + slide * 2.0) * uChromaticAberration).y * 0.5;
  float c = (texture2D(texture, uv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).y * 2.0 +
             texture2D(texture, uv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).z * 2.0 -
             texture2D(texture, uv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).x) / 6.0;
  float b = texture2D(texture, uv + refractVecB.xy * (uRefractPower + slide * 3.0) * uChromaticAberration).z * 0.5;
  float p = (texture2D(texture, uv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).z * 2.0 +
             texture2D(texture, uv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 2.0 -
             texture2D(texture, uv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).y) / 6.0;

  float R = r + (2.0*p + 2.0*y - c)/3.0;
  float G = g + (2.0*y + 2.0*c - p)/3.0;
  float B = b + (2.0*c + 2.0*p - y)/3.0;

  color.r += R;
  color.g += G;
  color.b += B;

  
}
  color /= float(LOOP);
  color = sat(color, uSaturation);

  vec3 reflectedDir = normalize(reflect(eye, normal));
  vec4 diffuseColor = sampleBackground(normal, texture);
  vec4 reflectionColor = remapShadows(sampleBackground(reflectedDir, texture));
   
  // Add Fresnel effect
  float fresnel = fresnel(eye, normal, uFresnelPower,false);
  float fresnelStrength = 0.55;
  float reflectionStrength = 0.125;
  float reflectionAmount = reflectionStrength + fresnelStrength * fresnel;
  color += reflectionAmount * reflectionColor.rgb;
  
  vec3 irri = irri(sat(normal*0.5,0.).x);
  // color += specularLight * 0.25;
  color.rgb += fresnel * vec3(0.25);
  //color += irri*0.05;
  color = pow(color,vec3(1./1.222));
  gl_FragColor = vec4(color, 1.0);

  }
`;

var vert = `

    precision highp float;
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aTexCoord;
    attribute vec4 aVertexColor;
    varying vec3 vertPos;
    varying vec3 vertNormal;
    varying vec3 vertNormalMatrix;
    varying vec2 vertTexCoord;
    varying vec3 eye;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat3 uNormalMatrix;
    uniform float time;
#define TWO_PI 6.28318530718
#define PI TWO_PI*.5

 mat4 rotateX(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, c, s, 0.0,
    0.0, -s, c, 0.0,
    0.0, 0.0, 0.0, 1.0
  );
}

// Y-axis rotation matrix
mat4 rotateY(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat4(
    c, 0.0, -s, 0.0,
    0.0, 1.0, 0.0, 0.0,
    s, 0.0, c, 0.0,
    0.0, 0.0, 0.0, 1.0
  );
}

// Z-axis rotation matrix
mat4 rotateZ(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat4(
    c, s, 0.0, 0.0,
    -s, c, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  );
}
    void main() {
      vec4 p = vec4(aPosition, 1.0)*rotateZ(-time*2.)*rotateX(time)*rotateZ(-time);
      vec4 n = vec4(aNormal, 1.0)*rotateZ(-time*2.)*rotateX(time)*rotateZ(-time);
      gl_Position = uProjectionMatrix *
                    uModelViewMatrix *
                    p;


      vertPos      = p.xyz;
      vertNormal   = normalize(n.xyz * uNormalMatrix);
      vertNormalMatrix = vertNormal * uNormalMatrix;
      vertTexCoord = aTexCoord;
      vec4 positionEye = (uModelViewMatrix * p);
      eye = normalize(positionEye.xyz);
    }
`;
