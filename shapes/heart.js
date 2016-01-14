var range = require('lodash.range')
var line = range(0, Math.PI * 2, Math.PI * 2 / 50)

var points = line.map(function (t) {
  var x = 16 * Math.pow(Math.sin(t), 3)
  var y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
  return [x / 13, y / 13]
})

module.exports = {
  points: points.reverse(),
  colors: [[0.9, 0.3, 0.1], [1.0, 0.2, 0.3]]
}
