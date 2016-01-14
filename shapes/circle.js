var range = require('lodash.range')
var line = range(0, Math.PI * 2, Math.PI * 2 / 30)

var points = line.map(function (t) {
  var x = Math.sin(t)
  var y = Math.cos(t)
  return [x, y]
})

module.exports = {
  points: points.reverse(),
  colors: [[0.9, 0.8, 0.1], [0.8, 0.6, 0.2]]
}
