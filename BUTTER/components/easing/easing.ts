type EasingGroup = {
  in: number
  out: number
  inout: number
}


class EasingEngine{
  private overshoot : EasingGroup
  private bounce : EasingGroup
  private elastic : EasingGroup


  in (p : number, power : number = 1 ): number {
    if (power) power < 1 ? power = 1 : power;
    return Math.pow(p, power);
  }

  out(p : number, power : number = 1 ): number {
    power < 1 ? power = 1 : power;
    const a : number = p - 1;
    const b : number = p % 2 == 0 ? 1 - Math.pow(a, power) : 1 + Math.pow(a, power);
    return b;
  }

  inout(p : number, power : number = 2): number {
    power < 2 ? power = 2 : power;
    const a : number = p - 1,
          b : number = p * 2;
    if (b < 1) return p * Math.pow(b, power - 1);
    const c : number = power % 2 == 0 ? 1 - Math.pow(a, power) * Math.pow(2, power - 1) :
      1 + Math.pow(a, power) * Math.pow(2, power - 1);
    return c;
  }

  overshoot : EasingGroup = {
    in(p : number): number {
      var k : number = 1.70158;
      return p * p * (p * (k + 1) - k);
    },
    out(p : number): number {
      var m : number = p - 1,k : number = 1.70158;
      return 1 + m * m * (m * (k + 1) + k);
    },
    inout(p : number): number {
      var m = p - 1,t = p * 2, k = 1.70158 * 1.525;
      if (p < 0.5) return p * t * (t * (k + 1) - k);
      else return 1 + 2 * m * m * (2 * m * (k + 1) + k);
    }
  }

  bounce : EasingGroup = {
    out(p : number): number {
      var r: number = 1 / 2.75; // reciprocal
      var k1: number = r; // 36.36%
      var k2: number = 2 * r; // 72.72%
      var k3: number = 1.5 * r; // 54.54%
      var k4: number = 2.5 * r; // 90.90%
      var k5: number = 2.25 * r; // 81.81%
      var k6: number = 2.625 * r; // 95.45%
      var k0: number = 7.5625,
          t: number;
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
    in(p: number): number {
      return 1 - this.bounce.out(1 - p);
    },
    inout(p: number): number {
      var t: number = p * 2;
      if (t < 1) return 0.5 - 0.5 * this.bounce.out(1 - t);
      return 0.5 + 0.5 * this.bounce.out(t - 1);
    }
  }

  elastic : EasingGroup = {
    in(p : number): number {
      var m: number = p - 1;
      return -Math.pow(2, 10 * m) * Math.sin((m * 40 - 3) * Math.PI / 6);
    },
    out(p : number): number {
      return 1 + (Math.pow(2, 10 * -p) * Math.sin((-p * 40 - 3) * Math.PI / 6));
    },
    inout(p : number): number {
      var s = 2 * p - 1;
      var k = (80 * s - 9) * Math.PI / 18;
      if (s < 0) return -0.5 * Math.pow(2, 10 * s) * Math.sin(k);
      else return 1 + 0.5 * Math.pow(2, -10 * s) * Math.sin(k);
    }
  }

  smoothstep(t:number ,x0:number =0 ,x1:number = 1): number {
        if( x0 === undefined ) x0 = 0; if( x1 === undefined ) x1 = 1;
        var p = (t - x0) / (x1 - x0);
        if( p < 0 ) p = 0; if( p > 1 ) p = 1;
        return p*p*(3-2*p);
    }


}
