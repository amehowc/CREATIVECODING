const getRelativePoint = (shape, ratioWidth, ratioHeight) => {
  const originRatio = 600;
  const adjustPosY = (150 / originRatio) * ratioHeight;
  const centerX = ratioWidth >= originRatio ? -(ratioWidth - originRatio) / 2 : (ratioWidth - originRatio) / 2
  const centerY = Math.abs(ratioHeight - originRatio) / 2
  const origin = shape.position;
  origin.x = Math.round((origin.x / originRatio) * ratioWidth) - centerX;
  origin.y =
    Math.round((origin.y / originRatio) * ratioWidth) - adjustPosY + centerY;
  const path = shape.path;
  const buffer = [];
  path.forEach((point, i) => {
    const x =
      Math.round((point.x / originRatio) * ratioWidth) - origin.x - centerX;
    const y =
      Math.round((point.y / originRatio) * ratioWidth) -
      origin.y -
      adjustPosY +
      centerY;
    buffer[i] = { x: x, y: y };
  });
  shape.position = origin;
  shape.path = buffer;

  return shape;
};

const getPointsOnArc = (
  numPoints,
  radius,
  center,
  start,
  end,
  reverse,
) => {
  let buffer = [];

  for (let i = 0; i < numPoints; i++) {
    const angle = mathHelper.map(i, 0, numPoints - 1, start, end) * 6.283024;
    const x = center.x + Math.cos(angle) * radius;
    const y = center.y + Math.sin(angle) * radius;
    buffer[i] = { x: x, y: y };
  }

  if (reverse) {
    buffer.reverse();
  }
  return buffer;
};

const createArc = (
  numPointsOnArc,
  radius1,
  radius2,
  center1,
  center2,
  start,
  end
) => {
  const firstArc = getPointsOnArc(
    numPointsOnArc,
    radius1,
    center1,
    start,
    end,
    false
  );
  const secondArc = getPointsOnArc(
    numPointsOnArc,
    radius2,
    center2,
    start,
    end,
    true
  );

  return firstArc.concat(secondArc);
};
// shapes to evaluate collisions, lesser resolution
const allShapesBounds = {
  TOPMLEFT: {
    position: { x: 80, y: 234 },
    path: [
      { x: 5, y: 175 },
      { x: 113, y: 165 },
      { x: 156, y: 292 },
      { x: 98, y: 297 },
      { x: 85, y: 261 },
      { x: 87, y: 298 },
      { x: 16, y: 304 },
    ],
    color: "#009F4D",
  },

  TOPMRIGHT: {
    position: { x: 238, y: 220 },
    path: [
      { x: 188, y: 159 },
      { x: 296, y: 150 },
      { x: 307.8, y: 278.5 },
      { x: 237.1, y: 284.7 },
      { x: 233.8, y: 248.1 },
      { x: 226.45, y: 285.6 },
      { x: 168.0, y: 290.7 },
    ],
    color: "#009F4D",
  },

  BOTMLEFT: {
    position: { x: 64, y: 378 },
    path: [
      { x: 28.9, y: 314 },
      { x: 99.9, y: 314.2 },
      { x: 99.9, y: 443.0 },
      { x: 28.9, y: 443.0 },
    ],
    color: "#003DA5",
  },

  BOTMCENTER: {
    position: { x: 175.1, y: 378.6 },
    path: [
      { x: 110.6, y: 314.3 },
      { x: 169.3, y: 314.3 },
      { x: 174.7, y: 336.7 },
      { x: 175.5, y: 336.7 },
      { x: 180.9, y: 314.2 },
      { x: 239.6, y: 314.24 },
      { x: 204.6, y: 443 },
      { x: 145.5, y: 443 },
    ],
    color: "#003DA5",
  },

  BOTMRIGHT: {
    position: { x: 285.8, y: 378.6 },
    path: [
      { x: 250.3, y: 314.3 },
      { x: 321.3, y: 314.3 },
      { x: 321.3, y: 443.0 },
      { x: 250.5, y: 443.0 },
    ],
    color: "#003DA5",
  },

  CCENTER: {
    position: { x: 386.51, y: 314.04 },
    path: createArc(
      12,
      275.4 * 0.5,
      134 * 0.5,
      { x: 475.7, y: 311.68 },
      { x: 475.7, y: 315.7 },
      0.36,
      0.64
    ),
    color: "#D22730",
  },

  CBOTTOM: {
    position: { x: 490.51, y: 401.9 },
    path: createArc(
      12,
      275.4 * 0.5,
      134 * 0.5,
      { x: 475.7, y: 311.68 },
      { x: 475.7, y: 315.7 },
      0.1,
      0.36
    ),
    color: "#F04E98",
  },

  CTOP: {
    position: { x: 492.6, y: 209.6 },
    path: createArc(
      12,
      275.4 * 0.5,
      134 * 0.5,
      { x: 475.7, y: 291.68 },
      { x: 478.7, y: 295.7 },
      0.65,
      0.91
    ),
    color: "#FF6720",
  },
};
// shapes to render on screen, higher resolution
const allShapesRender = {
  TOPMLEFT: {
    position: {  x: 80, y: 234 },
    path: [
      { x: 5, y: 175 },
      { x: 113, y: 165 },
      { x: 156, y: 292 },
      { x: 98, y: 297 },
      { x: 85, y: 261 },
      { x: 84, y: 262 },
      { x: 87, y: 298 },
      { x: 16, y: 304 },
    ],
    color: "#009F4D",
  },

  TOPMRIGHT: {
    position: { x: 238, y: 220 },
    path: [
      { x: 188, y: 159 },
      { x: 296, y: 150 },
      { x: 307.8, y: 278.5 },
      { x: 237.1, y: 284.7 },
      { x: 233.8, y: 248.1 },
      { x: 233.2, y: 248.2 },
      { x: 226.45, y: 285.6 },
      { x: 168.0, y: 290.7 },
    ],
    color: "#009F4D",
  },

  BOTMLEFT: {
    position: { x: 64, y: 378 },
    path: [
      { x: 28.9, y: 314 },
      { x: 99.9, y: 314.2 },
      { x: 99.9, y: 443.0 },
      { x: 28.9, y: 443.0 },
    ],
    color: "#003DA5",
  },

  BOTMCENTER: {
    position: { x: 175.1, y: 378.6 },
    path: [
      { x: 110.6, y: 314.3 },
      { x: 169.3, y: 314.3 },
      { x: 174.7, y: 336.7 },
      { x: 175.5, y: 336.7 },
      { x: 180.9, y: 314.2 },
      { x: 239.6, y: 314.24 },
      { x: 204.6, y: 443 },
      { x: 145.5, y: 443 },
    ],
    color: "#003DA5",
  },

  BOTMRIGHT: {
    position: { x: 285.8, y: 378.6 },
    path: [
      { x: 250.3, y: 314.3 },
      { x: 321.3, y: 314.3 },
      { x: 321.3, y: 443.0 },
      { x: 250.5, y: 443.0 },
    ],
    color: "#003DA5",
  },

  CCENTER: {
    position: { x: 386.51, y: 314.04 },
    path: createArc(
      36,
      275.4 * 0.5,
      134 * 0.5,
      { x: 475.7, y: 311.68 },
      { x: 475.7, y: 315.7 },
      0.36,
      0.64
    ),
    color: "#D22730",
  },

  CBOTTOM: {
    position: { x: 490.51, y: 401.9 },
    path: createArc(
      36,
      275.4 * 0.5,
      134 * 0.5,
      { x: 475.7, y: 311.68 },
      { x: 475.7, y: 315.7 },
      0.1,
      0.36
    ),
    color: "#F04E98",
  },

  CTOP: {
    position: { x: 492.6, y: 200.6 },
    path: createArc(
      36,
      275.4 * 0.5,
      134 * 0.5,
      { x: 475.7, y: 291.68 },
      { x: 478.7, y: 295.7 },
      0.65,
      0.91
    ),
    color: "#FF6720",
  },
};
