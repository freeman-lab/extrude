var test = require('tape')
var allclose = require('test-allclose')
var extrude = require('./index.js')

test('cube: cells (closed)', function (t) {
  var opts = {top: 1, bottom: -1, closed: true}
  var complex = extrude([[-1, -1], [1, -1], [1, 1], [-1, 1]], opts)
  var cells = complex.cells
  var truth = [
    [4, 5, 0],
    [1, 0, 5],
    [5, 6, 1],
    [2, 1, 6],
    [6, 7, 2],
    [3, 2, 7],
    [7, 4, 3],
    [0, 3, 4],
    [1, 2, 3],
    [0, 1, 3],
    [5, 7, 6],
    [4, 7, 5]
  ]
  allclose(t)(cells, truth)
  t.end()
})

test('cube: cells (open)', function (t) {
  var opts = {top: 1, bottom: -1, closed: false}
  var complex = extrude([[-1, -1], [1, -1], [1, 1], [-1, 1]], opts)
  var cells = complex.cells
  var truth = [
    [4, 5, 0],
    [1, 0, 5],
    [5, 6, 1],
    [2, 1, 6],
    [6, 7, 2],
    [3, 2, 7],
    [7, 4, 3],
    [0, 3, 4]
  ]
  allclose(t)(cells, truth)
  t.end()
})

test('cube: positions', function (t) {
  var opts = {top: 1, bottom: -1}
  var complex = extrude([[-1, -1], [1, -1], [1, 1], [-1, 1]], opts)
  var positions = complex.positions
  var truth = [
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1]
  ]
  allclose(t)(positions, truth)
  t.end()
})

test('cube: positions (defaults)', function (t) {
  var complex = extrude([[-1, -1], [1, -1], [1, 1], [-1, 1]])
  var positions = complex.positions
  var truth = [
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
    [-1, -1, 0],
    [1, -1, 0],
    [1, 1, 0],
    [-1, 1, 0]
  ]
  allclose(t)(positions, truth)
  t.end()
})