var seidel = require('seidel')
var _ = require('lodash')

module.exports = function (points, opts) {
  opts = opts || {}
  _.defaults(opts, {top: 1, bottom: 0, closed: true})

  var n = points.length
  var positions
  var cells

  (opts.top === opts.bottom) ? flat() : full()

  function triangulate (points) {
    return seidel([points]).map(function (t) {
      var vertices = t.map(function (p) {
        return _.findIndex(points, function (x) {
          return Math.abs(x[0] - p.x) < 0.0000001 & Math.abs(x[1] - p.y) < 0.0000001
        })
      })
      var c0 = [t[1].x - t[0].x, t[1].y - t[0].y]
      var c1 = [t[2].x - t[0].x, t[2].y - t[0].y]
      var cross = (c0[0] * c1[1]) - (c0[1] * c1[0])
      if (cross < 0) {
        vertices = [vertices[0], vertices[2], vertices[1]]
      }
      return vertices
    })
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
