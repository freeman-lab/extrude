var triangulate = require('delaunay-triangulate')
var defaults = require('lodash.defaults')

module.exports = function (points, opts) {
  opts = opts || {}
  defaults(opts, {top: 1, bottom: 0, closed: true})

  var n = points.length
  var positions
  var cells

  (opts.top === opts.bottom) ? flat() : full()

  function flat () {
    positions = points.map(function (p) { return [p[0], p[1], opts.top] })
    cells = triangulate(points)
  }

  function full () {
    positions = []
    points.forEach(function (p) { positions.push([p[0], p[1], opts.top]) })
    points.forEach(function (p) { positions.push([p[0], p[1], opts.bottom]) })

    cells = []
    for (var i = 0; i < n; i++) {
      if (i === (n - 1)) {
        cells.push([i, n, i + n])
        cells.push([i, 0, n])
      } else {
        cells.push([i, i + n + 1, i + n])
        cells.push([i, i + 1, i + n + 1])
      }
    }

    if (opts.closed) {
      var top = triangulate(points).map(function (p) { return p.sort() })
      var bottom = top.map(function (p) { return p.map(function (v) { return v + n }) })
      cells = cells.concat(top).concat(bottom)
    }
  }

  return {
    positions: positions,
    cells: cells
  }
}
