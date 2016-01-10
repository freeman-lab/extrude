var Geometry = require('gl-geometry')
var Shader = require('gl-shader')
var context = require('gl-context')
var mat4 = require('gl-mat4')
var glslify = require('glslify')
var orbit = require('canvas-orbit-camera')
var fit = require('canvas-fit')
var unindex = require('unindex-mesh')
var reindex = require('mesh-reindex')
var eye = require('eye-vector')
var time = require('right-now')
var normals = require('normals')
var extrude = require('./index.js')

var canvas = document.body.appendChild(document.createElement('canvas'))
var camera = orbit(canvas)
var gl = context(canvas, render)

window.addEventListener('resize', fit(canvas), false)
camera.lookAt([3, 3, 4], [0, 0, 0], [1, 0, 0])

var points = [[-1, -1], [1, -1], [1, 1], [-1, 1]]

var complex = extrude(points, {top: 1, bottom: -1, closed: true})

var geometry = Geometry(gl)

var flattened = unindex(complex.positions, complex.cells)
complex = reindex(flattened)
complex.normals = normals.vertexNormals(complex.cells, complex.positions)
geometry.attr('position', complex.positions)
geometry.attr('normal', complex.normals)
geometry.faces(complex.cells)

var shader = Shader(gl,
  glslify('./shaders/example.vert'),
  glslify('./shaders/example.frag')
)

var projection = mat4.create()
var view = mat4.create()

function render () {
  var width = gl.drawingBufferWidth
  var height = gl.drawingBufferHeight

  var now = time() * 0.001
  var axis = Math.sin(now) * 2

  var aspect = width / height
  var fov = Math.PI / 4
  var near = 0.01
  var far = 1000
  mat4.perspective(projection, fov, aspect, near, far)

  camera.rotate([0, 0, 0], [axis * 0.005, -0.005, 0])
  camera.view(view)
  camera.tick()

  gl.viewport(0, 0, width, height)
  gl.enable(gl.DEPTH_TEST)

  geometry.bind(shader)
  shader.uniforms.projection = projection
  shader.uniforms.view = view
  shader.uniforms.eye = eye(view)
  geometry.draw(gl.TRIANGLES)
  geometry.unbind()
}
