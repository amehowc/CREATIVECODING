function easeOutBounce(t, b, c, d) {
  if ((t /= d) < 1 / 2.75) {
    return c * (7.5625 * t * t) + b;
  } else if (t < 2 / 2.75) {
    return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
  } else if (t < 2.5 / 2.75) {
    return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
  } else {
    return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
  }
}
function InOutQuadratic(p) {
  var m = p - 1,
    t = p * 2;
  if (t < 1) return p * t;
  return 1 - m * m * 2;
}

function OutBounce(p) {
  var r = 1 / 2.75; // reciprocal
  var k1 = r; // 36.36%
  var k2 = 2 * r; // 72.72%
  var k3 = 1.5 * r; // 54.54%
  var k4 = 2.5 * r; // 90.90%
  var k5 = 2.25 * r; // 81.81%
  var k6 = 2.625 * r; // 95.45%
  var k0 = 7.5625,
    t;

  /**/ if (p < k1) {
    return k0 * p * p;
  } else if (p < k2) {
    t = p - k3;
    return k0 * t * t + 0.75;
  } // 48/64
  else if (p < k4) {
    t = p - k5;
    return k0 * t * t + 0.9375;
  } // 60/64
  else {
    t = p - k6;
    return k0 * t * t + 0.984375;
  } // 63/64
}
