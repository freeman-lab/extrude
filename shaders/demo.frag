precision mediump float;

varying vec3 vposition;
varying vec3 vnormal;

uniform vec3 color1;
uniform vec3 color2;
uniform vec3 eye;

#pragma glslify: orenn = require('glsl-diffuse-oren-nayar')

void main() {
	vec3 viewdiff = eye - vposition;
	vec3 lightdir1 = (eye - vposition) + vec3(-2.0, 0.0, 1.0);
	vec3 lightdir2 = (eye - vposition) + vec3(1.0, 0.0, 1.0);

	float diff1 = orenn(normalize(lightdir1), normalize(viewdiff), vnormal, 0.9, 1.0);
	float diff2 = orenn(normalize(lightdir2), normalize(viewdiff), vnormal, 0.9, 1.0);

	vec3 lcol1 = color1;
	vec3 lcol2 = color2;

	vec3 material = vec3(1.0, 1.0, 1.0);

	vec3 result = lcol1 * vec3(material * diff1) + lcol2 * vec3(material * diff2);
 	gl_FragColor = vec4(result, 1.0);
}