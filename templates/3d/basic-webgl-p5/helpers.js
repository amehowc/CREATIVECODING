// a small helper to make settings the p5._renderer.GL a little bit less verbose

function setRenderer(gl, options) {
  if (gl && options) {
    if (options.blend) {
      if (options.blend.enable === true) {
        gl.enable(gl.BLEND);
        if (options.blend.func) {
          gl.blendFunc(options.blend.func.source, options.blend.func.dest);
        }
      } else {
        gl.disable(gl.BLEND);
      }
    }
    if (options.depth) {
      if (options.depth.enable === true) {
        gl.enable(gl.DEPTH_TEST);
        if (options.depth.func) {
          // gl.depthFunc(options.depth.func);
        }
      } else {
        gl.disable(gl.DEPTH_TEST);
      }
    }

    if (options.premult) {
      if (options.premult.unpack === true) {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      } else {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      }
    }
    if (options.flipY) {
      if (options.flipY.enable === true) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      } else {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      }
    }
    if (options.extensions) {
      if (options.extensions.lazyload && options.extensions.lazyload === true) {
        // lazylingly loading ALL the extensions
        // to make sure the one you need is enabled :D
        const names = gl.getSupportedExtensions();
        names.forEach(name => {
          console.log(name);
          gl.getExtension(name);
        });
      } else {
        const names = options.extensions.ext;
        const all = gl.getSupportedExtensions();
        names.forEach(name => {
          if (all.includes(name)) {
            gl.getExtension(name);
          } else {
            console.log("No such extension available : " + `${name}`);
            return;
          }
        });
      }
    }
  }
}

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
