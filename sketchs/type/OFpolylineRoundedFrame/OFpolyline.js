// p5 implementation from openFrameworks
// https://github.com/openframeworks/openFrameworks/blob/58e47e329d4a2717b5211755a1cb2e65a1a5e1a9/libs/openFrameworks/graphics/ofPolyline.inl

class Polyline {
  constructor(points, isClosed = true) {
    this.points = points;
    this.numPoints = points.length;
    this.lengths = this.getLengths();
    this.perimeter = this.getPerimeter();
    this.isClosed = isClosed;
  }

  getWrappedIndex(i) {
    let index = i;

    if (i < 0) {
      index = (i + this.numPoints) % this.numPoints;
    }
    if (i > this.numPoints - 1) {
      index = i % this.numPoints;
    }
    return index;
  }

  getPerimeter() {
    return this.lengths[this.lengths.length - 1];
  }

  getLengths() {
    let len = 0;
    let lengths = [];
    for (let i = 0; i < this.numPoints; i++) {
      lengths.push(len);

      len += dist(
        this.points[i][0],
        this.points[i][1],
        this.points[this.getWrappedIndex(i + 1)][0],
        this.points[this.getWrappedIndex(i + 1)][1]
      );
    }

    if (this.isClosed) {
      lengths.push(len);
    }

    return lengths;
  }

  getPointAtPercent(f) {
    let len = this.perimeter;
    return this.getPointAtLength(f * len);
  }

  getPointAtLength(f) {
    if (this.points.length < 2) return [0, 0];

    return this.getPointAtIndexInterpolated(this.getIndexAtLength(f));
  }

  getPointAtIndexInterpolated(fIndex) {
    // if(this.points.length < 2) return [0, 0];
    let i1 = 0,
      i2 = 0;
    let t = 0;

    let params = this.getInterpolationParams(fIndex);
    i1 = params[0];
    i2 = params[1];
    t = params[2];
    // print(fIndex, i1);

    let p1 = this.points[i1];
    let p2 = this.points[i2];

    return [int(lerp(p1[0], p2[0], t)), int(lerp(p1[1], p2[1], t))];
  }

  getIndexAtPercent(f) {
    return this.getIndexAtLength(f * this.perimeter);
  }

  getIndexAtLength(len) {
    if (this.numPoints < 2) return 0;

    let totalLength = this.perimeter;
    len = constrain(len, 0, totalLength);
    let lastPointIndex = this.isClosed ? this.numPoints : this.numPoints - 1;
    let i1 = constrain(
      floor((len / totalLength) * lastPointIndex),
      0,
      this.lengths.length - 2
    );
    let leftLimit = 0;
    let rightLimit = lastPointIndex;
    let distAt1, distAt2;
    for (let iterations = 0; iterations < 32; iterations++) {
      i1 = constrain(i1, 0, this.lengths.length - 1);
      distAt1 = this.lengths[i1];

      if (distAt1 <= len) {
        distAt2 = this.lengths[i1 + 1];

        if (distAt2 >= len) {
          let t = map(len, distAt1, distAt2, 0, 1);
          return round(i1 + t);
        } else {
          leftLimit = round(i1);
        }
      } else {
        rightLimit = round(i1);
      }
      i1 = round((leftLimit + rightLimit) / 2);
    }
    return 0;
  }

  getInterpolationParams(fIndex) {
    let i1 = floor(fIndex);
    let t = fIndex - i1;
    i1 = this.getWrappedIndex(i1);
    let i2 = this.getWrappedIndex(i1 + 1);
    return [i1, i2, t];
  }
}
