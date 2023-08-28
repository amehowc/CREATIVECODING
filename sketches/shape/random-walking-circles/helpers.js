export function scaleTo(
  originWidth,
  originHeight,
  destinationWidth,
  destinationHeight,
  cover = false
) {
  const widthRatio = destinationWidth / originWidth;
  const heightRatio = destinationHeight / originHeight;
  if (cover) {
    return Math.max(widthRatio, heightRatio);
  } else {
    return Math.min(widthRatio, heightRatio);
  }
}

export const createUniforms = (shader, config) => {
  for (const uniform in config) {
    shader.setUniform(uniform, config[uniform]);
  }
};

function rgbToHex(rgb) {
  if (rgb.length !== 3) {
    throw new Error("Input should be an array with three values for r, g, b.");
  }

  function toHex(value) {
    let hex = Number(value).toString(16);
    return hex.length < 2 ? "0" + hex : hex;
  }

  return "#" + toHex(rgb[0]) + toHex(rgb[1]) + toHex(rgb[2]);
}