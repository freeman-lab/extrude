# extrude

Make a 3d shape from a 2d geometry with extrusion. Extrusion is the process of "streching" a 2d shape through depth to make it 3d. Creates a (simplicial complex)[link] that works well with the `stack.gl` suite. Useful for 3d graphics and games.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)


## install

To use in your project

```javascript
npm install extrude
```

To see the demo, clone this repo, then call

```javascript
npm install
npm start
```

## examples

Assuming you already have a stack.gl context `gl`, make a cube like this!

```javascript
var extrude = require('extrude')

var points = [[0, 0], [0, 1], [1, 0], [1, 1]]
var cube = extrude(points)

var geometry = require('gl-geometry')(gl)
geometry.attr('position', cube.positions)
geometry.faces(cube.cells)
```

Or make a 3d hexagon!

```javascript
var extrude = require('extrude')

var points = [[0, 0], [0, 1], [1, 0], [1, 1]]
var hex = extrude(points)

var geometry = require('gl-geometry')(gl)
geometry.attr('position', hex.positions)
geometry.faces(hex.cells)
```

See `demo.js` for a complete end-to-end example.

## usage

#### `complex = extrude(points, opts)`

Create a simplicial complex from a set of points

`complex` has two attributes
- `complex.position` is an array of 3d vertices e.g. [[x, y, z], [x, y, z], ...]
- `complex.cells` is an array of tuples that index into the vertices e.g. [[i, j, k], [i, j, k], ...]

`opts` can include the following options
- `opts.bottom` the bottom of the extruded object
- `opts.top` the top of the extruded object

If only `top` is specified, assume bottom is 0. If only `bottom` is specified, assumes bottom is 0. If neither `top` nor `bottom` is specified, creates a "flat extrusion" (e.g. `top` and `bottom` are 0).