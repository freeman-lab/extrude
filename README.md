# extrude

Use extrusion to turn a 2d shape into a 3d mesh. Extrusion is the process of "pulling" a 2d shape through space to make it 3d. This module contains a single function that accepts a collection of 2d points, and returns a 3d mesh in the form of a [`simplicial complex`](https://github.com/mikolalysenko/simplicial-complex), a data structure that works well with the [`stack.gl`](http://stack.gl/) suite.


![hex](hex.gif)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)


## install

To use in your project

```javascript
npm install extrude
```

To see an example, clone this repo, then call

```javascript
npm install
npm start
```

## examples

Assuming you already have a stack.gl context `gl`, make a cube like this!

```javascript
var extrude = require('extrude')

var points = [[0, 0], [0, 1], [1, 1], [1, 0]]
var cube = extrude(points)

var geometry = require('gl-geometry')(gl)
geometry.attr('position', cube.positions)
geometry.faces(cube.cells)
```

See [`example.js`](example.js) for a complete end-to-end example.

## usage

#### `complex = extrude(points, opts)`

Create a simplicial complex from a set of points.

`points` should be a list in the form `[[x, y], [x, y], ...]`

`complex` has two attributes:
- `complex.position` is an array of 3d vertices `[[x, y, z], [x, y, z], ...]`
- `complex.cells` is an array of tuples that index into the vertices `[[i, j, k], [i, j, k], ...]`

`opts` can include the following options:
- `opts.bottom` the bottom of the extruded object `default: 0`
- `opts.top` the top of the extruded object `default: 1`
- `opts.closed` whether to close the top and bottom of the mesh `default: true`

If `top` and `bottom` are equal it will result in a "flat" 3d shape.
