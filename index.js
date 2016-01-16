var pnltri = require('pnltri')
var defaults = require('lodash.defaults')

module.exports = function (points, opts) {
  opts = opts || {}
  defaults(opts, {top: 1, bottom: 0, closed: true})

  var n = points.length
  var positions
  var cells

  (opts.top === opts.bottom) ? flat() : full()

  function triangulate (points) {
    points = points.map(function (p) { return {x: p[0], y: p[1]} })
    return new pnltri.Triangulator().triangulate_polygon([points])
  }

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
        cells.push([i + n, n, i])
        cells.push([0, i, n])
      } else {
        cells.push([i + n, i + n + 1, i])
        cells.push([i + 1, i, i + n + 1])
      }
    }

    if (opts.closed) {
      var top = triangulate(points)
      var bottom = top.map(function (p) { return p.map(function (v) { return v + n }) })
      bottom = bottom.map(function (p) { return [p[0], p[2], p[1]] })
      cells = cells.concat(top).concat(bottom)
    }
  }

  return {
    positions: positions,
    cells: cells
  }
}
