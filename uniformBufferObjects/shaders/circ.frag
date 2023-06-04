#version 300 es
precision highp float;

in vec2 v_texcoord;

// circ stuff
uniform float u_radius;

out vec4 out_color;

void main() {
    float distSq = dot(v_texcoord - .5, v_texcoord - .5);
    float alpha = smoothstep(u_radius * u_radius + .01, u_radius * u_radius - .01, distSq);
    out_color = vec4(vec3(distSq), alpha);
}