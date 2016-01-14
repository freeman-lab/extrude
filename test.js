var test = require('tape')
var allclose = require('test-allclose')
var extrude = require('./index.js')

test('cube: cells', function (t) {
  var opts = {top: 1, bottom: -1, closed: true}
  var complex = extrude([[-1, -1], [1, -1], [1, 1], [-1, 1]], opts)
  var truth = [
    [4, 5, 0],
    [1, 0, 5],
    [5, 6, 1],
    [2, 1, 6],
    [6, 7, 2],
    [3, 2, 7],
    [7, 4, 3],
    [0, 3, 4],
    [3, 0, 1],
    [3, 1, 2],
    [7, 5, 4],
    [7, 6, 5]
  ]
  allclose(t)(complex.cells, truth)
  t.end()
})

test('cube: cells (open)', function (t) {
  var opts = {top: 1, bottom: -1, closed: false}
  var complex = extrude([[-1, -1], [1, -1], [1, 1], [-1, 1]], opts)
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
  allclose(t)(complex.cells, truth)
  t.end()
})

test('cube: positions', function (t) {
  var opts = {top: 1, bottom: -1}
  var complex = extrude([[-1, -1], [1, -1], [1, 1], [-1, 1]], opts)
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
  allclose(t)(complex.positions, truth)
  t.end()
})

test('cube: positions (defaults)', function (t) {
  var complex = extrude([[-1, -1], [1, -1], [1, 1], [-1, 1]])
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
  allclose(t)(complex.positions, truth)
  t.end()
})

test('cube: positions (flat)', function (t) {
  var opts = {top: 0, bottom: 0}
  var complex = extrude([[-1, -1], [1, -1], [1, 1], [-1, 1]], opts)
  var truth = [
    [-1, -1, 0],
    [1, -1, 0],
    [1, 1, 0],
    [-1, 1, 0]
  ]
  allclose(t)(complex.positions, truth)
  t.end()
})

test('cube: cells (flat)', function (t) {
  var opts = {top: 0, bottom: 0}
  var complex = extrude([[-1, -1], [1, -1], [1, 1], [-1, 1]], opts)
  var truth = [
    [3, 0, 1],
    [3, 1, 2]
  ]
  allclose(t)(complex.cells, truth)
  t.end()
})
