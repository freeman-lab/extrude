precision mediump float;

attribute vec3 position;
attribute vec3 normal;

varying vec3 vnormal;

uniform mat4 projection;
uniform mat4 view;

void main() {
	vnormal = normal;
 	gl_Position = projection * view * vec4(position, 1.0);
}