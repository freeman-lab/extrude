precision mediump float;

varying vec3 vposition;
varying vec3 vnormal;

uniform vec3 light1;
uniform vec3 light2;
uniform vec3 eye;

#pragma glslify: orenn = require('glsl-diffuse-oren-nayar')

void main() {
	vec3 viewdiff = eye - vposition;
	vec3 lightdir1 = light1 - vposition;
	vec3 lightdir2 = light2 - vposition;
	vec3 lightdir3 = vec3(0.0)

	float diff1 = orenn(normalize(lightdir1), normalize(viewdiff), vnormal, 0.9, 1.0);
	float diff2 = orenn(normalize(lightdir2), normalize(viewdiff), vnormal, 0.9, 1.0);
	float diff3 = orenn(normalize(lightdir3), normalize(viewdiff), vnormal, 0.9, 1.0);

	vec3 lcol1 = vec3(0.5, 1.0, 0.8);
	vec3 lcol2 = vec3(1.0, 0.2, 0.5);
	vec3 lcol3 = vec3(1.0, 0.2, 0.5);

	vec3 material = vec3(1.0, 1.0, 1.0);

	vec3 result = lcol1 * vec3(material * diff1) + lcol2 * vec3(material * diff2) + lcol3 * vec3(material * diff3);

 	gl_FragColor = vec4(result, 1.0);
}