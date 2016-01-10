var triangulate = require('delaunay-triangulate')

module.exports = function (points, opts) {
  opts = opts || {top: 1, bottom: 0}

  var n = points.length
  var positions
  var cells

  (opts.top === 0 & opts.bottom === 0) ? flat() : full()

  function flat () {
    positions = points.map(function (p) { return [p[0], p[1], 0] })
    cells = triangulate(points)
  }

  function full () {
    positions = []
    points.forEach(function (p) { positions.push([p[0], p[1], opts.top]) })
    points.forEach(function (p) { positions.push([p[0], p[1], opts.bottom]) })

    var top = triangulate(points).map(function (p) { return p.sort() })
    var bottom = top.map(function (p) { return p.map(function (v) { return v + n }) })
    var sides = []
    for (var i = 0; i < n; i++) {
      if (i === (n - 1)) {
        sides.push([i, n, i + n])
        sides.push([i, 0, n])
      } else {
        sides.push([i, i + n + 1, i + n])
        sides.push([i, i + 1, i + n + 1])
      }
    }

    cells = sides.concat(top).concat(bottom)
  }

  return {
    positions: positions,
    cells: cells
  }
}
