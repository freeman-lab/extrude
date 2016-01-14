var points = []

for (var i = 0; i < 6; i++) {
  points.push([
    Math.cos(i * 2 * Math.PI / 6),
    Math.sin(i * 2 * Math.PI / 6)
  ])
}

module.exports = {
  points: points,
  colors: [[0.5, 0.9, 0.1], [0.3, 1.0, 0.5]]
}
