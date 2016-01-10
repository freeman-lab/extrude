precision mediump float;

varying vec3 vposition;
varying vec3 vnormal;

uniform vec3 light;
uniform vec3 eye;

#pragma glslify: orenn = require('glsl-diffuse-oren-nayar')

void main() {
	vec3 viewdiff = eye - vposition;
	vec3 lightdir = light - vposition;

	float diff = orenn(normalize(lightdir), normalize(viewdiff), vnormal, 0.5, 1.0);

	vec3 lcol = vec3(0.8, 0.7, 1);

	vec3 material = vec3(1.0, 1.0, 1.0);

	vec3 result = lcol * vec3(material * diff);

 	gl_FragColor = vec4(result, 1.0);
}