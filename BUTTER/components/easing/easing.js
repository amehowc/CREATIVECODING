function EasingEngine() {

  this.in = (p, pow) => {
    if( pow === undefined ) pow = 1;
    if (pow) pow < 1 ? pow = 1 : pow;
    return Math.pow(p, pow);
  }

  this.out = (p, pow) => {
    if( pow === undefined ) pow = 1;
    if (pow) pow < 1 ? pow = 1 : pow;
    const a = p - 1;
    const b = p % 2 == 0 ? 1 - Math.pow(a, pow) : 1 + Math.pow(a, pow);
    return b;
  }

  this.inout = (p, pow) => {
    if( pow === undefined ) pow = 2;
    if (pow) pow < 2 ? pow = 2 : pow;
    const a = p - 1,
      b = p * 2;
    if (b < 1) return p * Math.pow(b, pow - 1);
    const c = pow % 2 == 0 ? 1 - Math.pow(a, pow) * Math.pow(2, pow - 1) :
      1 + Math.pow(a, pow) * Math.pow(2, pow - 1);
    return c;
  }


  this.overshoot = {
    in: (p) => {
      var k = 1.70158;
      return p * p * (p * (k + 1) - k);
    },
    out: (p) => {
      var m = p - 1,k = 1.70158;
      return 1 + m * m * (m * (k + 1) + k);
    },
    inout: (p) => {
      var m = p - 1,t = p * 2, k = 1.70158 * 1.525;
      if (p < 0.5) return p * t * (t * (k + 1) - k);
      else return 1 + 2 * m * m * (2 * m * (k + 1) + k);
    }
  }

  this.bounce = {
    out: (p) => {
      var r = 1 / 2.75; // reciprocal
      var k1 = r; // 36.36%
      var k2 = 2 * r; // 72.72%
      var k3 = 1.5 * r; // 54.54%
      var k4 = 2.5 * r; // 90.90%
      var k5 = 2.25 * r; // 81.81%
      var k6 = 2.625 * r; // 95.45%
      var k0 = 7.5625,
        t;
      if (p < k1) {
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
    },
    in: (p) => {
      return 1 - this.bounce.out(1 - p);
    },
    inout: (p) => {
      var t = p * 2;
      if (t < 1) return 0.5 - 0.5 * this.bounce.out(1 - t);
      return 0.5 + 0.5 * this.bounce.out(t - 1);
    }
  }

  this.elastic = {
    in: (p) => {
      var m = p - 1;
      return -Math.pow(2, 10 * m) * Math.sin((m * 40 - 3) * Math.PI / 6);
    },
    out: (p) => {
      return 1 + (Math.pow(2, 10 * -p) * Math.sin((-p * 40 - 3) * Math.PI / 6));
    },
    inout: (p) => {
      var s = 2 * p - 1;
      var k = (80 * s - 9) * Math.PI / 18;
      if (s < 0) return -0.5 * Math.pow(2, 10 * s) * Math.sin(k);
      else return 1 + 0.5 * Math.pow(2, -10 * s) * Math.sin(k);
    }
  }

  this.smoothstep = (t,x0,x1)=>{
        if( x0 === undefined ) x0 = 0; if( x1 === undefined ) x1 = 1;
        var p = (t - x0) / (x1 - x0);
        if( p < 0 ) p = 0; if( p > 1 ) p = 1;
        return p*p*(3-2*p);
    }

}
