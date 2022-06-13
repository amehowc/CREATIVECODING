/*
A quick and simple functions to avoid those ugly setUniform in p5
*/
const createUniforms = (shader, config) => {
  for (const uniform in config) {
    const name = uniform;
    const value = config[uniform];
    shader.setUniform(name, value);
  }
};
