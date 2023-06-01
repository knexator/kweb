import * as twgl from "twgl.js"
import Color from "color";

import Stats from "stats.js"
var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// init
const canvas = document.querySelector("#c")! as HTMLCanvasElement;
const gl = canvas.getContext("webgl2", { alpha: false })!;
gl.clearColor(0.5, 0.5, 0.75, 1.0);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
twgl.resizeCanvasToDisplaySize(canvas);
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

///// start of twgl.createProgramInfo /////
const vs_source = `#version 300 es

    in vec2 a_position;

    out vec3 v_col;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_col = vec3(a_position, 1.0);
    }
`;

const fs_source = `#version 300 es
    precision highp float;

    in vec3 v_col;

    uniform vec3 u_tint;
    
    out vec4 out_color;
    void main() {
        out_color = vec4(v_col * u_tint, 1);
    }
`;

let vertex_shader = gl.createShader(gl.VERTEX_SHADER)!;
let fragment_shader = gl.createShader(gl.FRAGMENT_SHADER)!;
gl.shaderSource(vertex_shader, vs_source);
gl.compileShader(vertex_shader);
gl.shaderSource(fragment_shader, fs_source);
gl.compileShader(fragment_shader);
// todo: check it was compiled correctly, log errors if not

let program = gl.createProgram()!;
gl.attachShader(program, vertex_shader);
gl.attachShader(program, fragment_shader);
gl.linkProgram(program);

let a_position_loc = gl.getAttribLocation(program, "a_position");
let u_tint_loc = gl.getUniformLocation(program, "u_tint")!;
///// end of twgl.createProgramInfo /////

///// start of twgl.createBufferInfoFromArrays /////
let a_position_buffer = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, a_position_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0, 0.0,
    0.0, 0.8,
    0.5, 0.0,
]), gl.STATIC_DRAW);
///// end of twgl.createBufferInfoFromArrays /////

///// start of twgl.createVertexArrayInfo /////
var vao = gl.createVertexArray()!;
gl.bindVertexArray(vao);
// this line tells webgl we will be using a buffer
gl.enableVertexAttribArray(a_position_loc);
// specify how to get the data out
{
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        a_position_loc, size, type, normalize, stride, offset)
}
///// end of twgl.createVertexArrayInfo /////

let last_time = 0;
function update(cur_time) {
    stats.update();
    if (twgl.resizeCanvasToDisplaySize(canvas)) {
        // on resize
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
    gl.clear(gl.COLOR_BUFFER_BIT);

    let cur_color = Color({ h: (cur_time * .1) % 360, s: 100, v: 100 });
    let cur_color_arr = cur_color.unitArray();

    gl.useProgram(program);
    // Set the VAO (single gl call)
    // equivalent to setBuffersAndAttributes(vao_info)
    gl.bindVertexArray(vao);
    // equivalent to setUniformsAndBindTextures
    gl.uniform3f(u_tint_loc,
        cur_color_arr[0],
        cur_color_arr[1],
        cur_color_arr[2]
    );
    gl.drawArrays(
        gl.TRIANGLES,
        0, // offset
        3  // count
    );
    requestAnimationFrame(update);
}
requestAnimationFrame(update);
