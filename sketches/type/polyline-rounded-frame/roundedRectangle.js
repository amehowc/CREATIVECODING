function roundedRect(x, y, w, h, cornerRadius, resolution = 0.001) {
  let points = [];
  let i = 0;
  while (i <= 8) {
    let p = pointOnRoundedRect(x, y, w, h, cornerRadius, i);

    i += resolution;
    points.push(p);
  }
  return points;
}

function pointOnRoundedRect(xPos, yPos, w, h, radius, t) {
  let x = 0;
  let y = 0;

  let a = w;
  let b = h;
  let r = min(radius, min(h, w));

  if (0 <= t && t <= 1) {
    x = a;
    y = -(b - r) * (2 * t - 1);
  } else if (1 < t && t <= 2) {
    x = a - r + r * cos(HALF_PI * (t - 1));
    y = -b + r - r * sin(HALF_PI * (t - 1));
  } else if (2 < t && t <= 3) {
    x = -(a - r) * (2 * t - 5);
    y = -b;
  } else if (3 < t && t <= 4) {
    x = -a + r - r * sin(HALF_PI * (t - 3));
    y = -b + r - r * cos(HALF_PI * (t - 3));
  } else if (4 < t && t <= 5) {
    x = -a;
    y = (b - r) * (2 * t - 9);
  } else if (5 < t && t <= 6) {
    x = -a + r - r * cos(HALF_PI * (t - 5));
    y = b - r + r * sin(HALF_PI * (t - 5));
  } else if (6 < t && t <= 7) {
    x = (a - r) * (2 * t - 13);
    y = b;
  } else if (7 < t && t <= 8) {
    x = a - r + r * sin(HALF_PI * (t - 7));
    y = b - r + r * cos(HALF_PI * (t - 7));
  }

  return [x + xPos, y + yPos];
}
