#version 300 es

// [0, 1]^2
in vec2 a_vertex;

uniform CommonData {
    vec2 u_resolution;
};

uniform vec2 u_position;
uniform vec2 u_size;
out vec2 v_texcoord;

void main() {
    // if size is 100 & screen is 400, then
    // clip space result width will be .5
    vec2 pos = 2.0 * a_vertex * u_size / u_resolution;

    // if position is 200 & screen is 400, then
    // clip space result offset will be .5
    pos += 2.0 * u_position / u_resolution;

    // pos of 0 should go to the top left
    pos -= vec2(1, 1);

    // ypos = down
    pos.y = -pos.y;

    gl_Position = vec4(pos, 0, 1);

    v_texcoord = a_vertex;
}

// todo: investigate glslify