var Geometry = require('gl-geometry')
var Shader = require('gl-shader')
var context = require('gl-context')
var mat4 = require('gl-mat4')
var vignette = require('gl-vignette-background')
var glslify = require('glslify')
var orbit = require('canvas-orbit-camera')
var fit = require('canvas-fit')
var unindex = require('unindex-mesh')
var reindex = require('mesh-reindex')
var eye = require('eye-vector')
var time = require('right-now')
var normals = require('normals')
var css = require('dom-css')
var extrude = require('./index.js')
var soundcloud = require('soundcloud-badge')
var issafari = require('is-safari')
var ismobile = require('is-mobile')
var Analyser = require('web-audio-analyser')

var canvas = document.body.appendChild(document.createElement('canvas'))
css(canvas, {zIndex: -1000})
var gl = context(canvas, render)

var message

if (!ismobile() & issafari) {
  message = document.body.appendChild(document.createElement('div'))
  css(message, {
    position: 'absolute', left: '4%', top: '3%',
    color: 'white', fontFamily: 'GlacialIndifferenceRegular'
  })
  message.innerHTML = 'for music view in Chrome or Firefox'
}

if (ismobile()) {
  message = document.body.appendChild(document.createElement('div'))
  css(message, {
    position: 'absolute', left: '4%', top: '3%',
    color: 'white', fontFamily: 'GlacialIndifferenceRegular',
    fontSize: 30
  })
  message.innerHTML = 'for music view on Desktop'
}

if (!ismobile() & !issafari) {
  var audio = new Audio()
  audio.crossOrigin = 'Anonymous'
  var analyser = Analyser(audio)

  soundcloud({
    client_id: 'cc4fb3b1e4b84004455321ad04a16580',
    song: 'https://soundcloud.com/constellation-records/cst025_track05',
    dark: false,
    getFonts: true
  }, function (err, src, data, div) {
    if (err) throw err
    audio.src = src
    audio.loop = true
    audio.addEventListener('canplay', function () {
      audio.play()
    }, false)
  })
}

var camera = orbit(canvas)

var shapes = ['triangle', 'square', 'hexagon', 'circle', 'heart']
var options = document.body.appendChild(document.createElement('div'))
css(options, {position: 'absolute', right: '6%', top: '2%'})

var link = document.body.appendChild(document.createElement('div'))
css(link, {position: 'absolute', right: '6%', bottom: '4.5%', textDecoration: 'none'})
link.innerHTML = 'github'
link.addEventListener('click', function () {
  window.location.href = 'http://github.com/freeman-lab/extrude'
})
var type = {
  fontFamily: 'GlacialIndifferenceRegular',
  borderBottom: 'solid 3px rgb(20,20,20)',
  borderLeft: 'solid 3px rgba(0, 0, 0, 0)',
  paddingBottom: 2,
  paddingLeft: 8,
  transition: '0.15s',
  width: '100%',
  cursor: 'pointer'
}
css(link, type)
mouseover(link)
mouseout(link)

function mouseover (el) {
  el.addEventListener('mouseover', function () {
    css(el, {borderLeft: 'solid 3px rgb(20,20,20)'})
  })
}

function mouseout (el) {
  el.addEventListener('mouseout', function () {
    css(el, {borderLeft: 'solid 3px rgba(0, 0, 0, 0)'})
  })
}

var items = []
shapes.forEach(function (shape, i) {
  items[i] = options.appendChild(document.createElement('div'))
  items[i].innerHTML = shape
  css(items[i], type)
  mouseover(items[i])
  mouseout(items[i])
  items[i].addEventListener('click', function () {
    selection = i
    reload()
  })
})

function resize () {
  var w = Math.sqrt(window.innerWidth * 20)
  var s = Math.sqrt(window.innerWidth * 1.2)
  if (ismobile()) {
    w *= 1.4
    s *= 1.4
  }
  var m = window.innerWidth * 0.01
  css(options, {width: w})
  css(link, {width: w, fontSize: s})
  items.forEach(function (item) {
    css(item, {fontSize: s, marginBottom: m})
  })
}

resize()
window.addEventListener('resize', resize, false)
window.addEventListener('resize', fit(canvas), false)

camera.lookAt([3, 3, 4], [0, 0, 0], [1, 0, 0])

var selection = 2
var flattened, geometry, shape

reload()

function reload () {
  if (selection === 0) {
    shape = require('./shapes/triangle.js')
  }

  if (selection === 1) {
    shape = require('./shapes/square.js')
  }

  if (selection === 2) {
    shape = require('./shapes/hexagon.js')
  }

  if (selection === 3) {
    shape = require('./shapes/circle.js')
  }

  if (selection === 4) {
    shape = require('./shapes/heart.js')
  }

  var complex = extrude(shape.points, {top: 0.5, bottom: -0.5, closed: true})

  geometry = Geometry(gl)
  flattened = unindex(complex.positions, complex.cells)
  complex = reindex(flattened)
  complex.normals = normals.vertexNormals(complex.cells, complex.positions)
  geometry.attr('position', complex.positions)
  geometry.attr('normal', complex.normals)
  geometry.faces(complex.cells)
}

var shader = Shader(gl,
  glslify('./shaders/demo.vert'),
  glslify('./shaders/demo.frag')
)

var projection = mat4.create()
var view = mat4.create()

var background = vignette(gl)

var rotate = 0.005
var freq, scale

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

  if (!ismobile() & !issafari) {
    freq = analyser.frequencies().reduce(function (x, y) { return x + y })
    rotate = freq / 1000000
  }

  camera.rotate([0, 0, 0], [axis * rotate, -rotate, 0])

  camera.view(view)
  camera.tick()

  gl.viewport(0, 0, width, height)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.disable(gl.DEPTH_TEST)

  if (ismobile()) {
    scale = [0.00038 * width, 0.00026 * height]
  } else {
    scale = [0.0007 * width, 0.0007 * height]
  }

  background.style({
    scale: scale,
    smoothing: [-0.4, 0.6],
    aspect: aspect,
    color1: [0.95, 0.95, 0.95],
    color2: shape.colors[0],
    coloredNoise: false,
    noiseAlpha: 0.2,
    offset: [0, 0]
  })

  background.draw()

  gl.enable(gl.DEPTH_TEST)

  geometry.bind(shader)
  shader.uniforms.projection = projection
  shader.uniforms.view = view
  shader.uniforms.eye = eye(view)
  shader.uniforms.color1 = shape.colors[0]
  shader.uniforms.color2 = shape.colors[1]
  geometry.draw(gl.TRIANGLES)
  geometry.unbind()
}
