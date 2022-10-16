const mathHelper = {
  // Get a value between two values
  clamp: function (value, min, max) {
    if (value < min) {
      return min
    } else if (value > max) {
      return max
    }
    return value
  },
  // Get the linear interpolation between two value
  lerp: function (value1, value2, amount) {
    amount = amount < 0 ? 0 : amount
    amount = amount > 1 ? 1 : amount
    return value1 + (value2 - value1) * amount
  },
  // Linear mapping of a value from a range to an another, including or not the extrems
  map: function (
    n,
    start1,
    stop1,
    start2,
    stop2,
    withinBounds = true,
  ) {
    const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2
    if (!withinBounds) {
      return newval
    }
    if (start2 < stop2) {
      return mathHelper.clamp(newval, start2, stop2)
    } else {
      return mathHelper.clamp(newval, stop2, start2)
    }
  },
  //get the angle between two points
  getAngle: function (origin, target) {
    const dy = target.y - origin.y
    const dx = target.x - origin.x
    const theta = Math.atan2(dy, dx)
    return theta
  },
  //get a point given an angle on a radius, with or without origin
  fromAngle: function (angle, radius, center) {
    const c = center || { x: 0, y: 0 }
    const x = c.x + radius * Math.sin(angle)
    const y = c.y + radius * Math.cos(angle)
    return { x: x, y: y }
  },

}
