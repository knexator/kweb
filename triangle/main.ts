import * as twgl from "twgl.js"
import Color from "color";

import Stats from "stats.js"
var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// init
const canvas = document.querySelector("#c")! as HTMLCanvasElement;
const gl = canvas.getContext("webgl2")!;
gl.clearColor(0.5, 0.5, 0.75, 1.0);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
twgl.resizeCanvasToDisplaySize(canvas);
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

// Compiles the shader, gets all the uniform/attribute locations
const program_info = twgl.createProgramInfo(gl, [
    // vs
    `#version 300 es

    in vec2 a_position;

    out vec3 v_col;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_col = vec3(a_position, 1.0);
    }
    `,
    // fs
    `#version 300 es
    precision highp float;

    in vec3 v_col;

    uniform vec3 u_tint;

    out vec4 out_color;
    void main() {
        out_color = vec4(v_col * u_tint, 1);
    }
    `
]);

// Creates VBOs & setters
const buffer_info = twgl.createBufferInfoFromArrays(gl, {
    a_position: {
        data: [
            0.0, 0.0,
            0.0, 0.8,
            0.5, 0.0,
        ],
        numComponents: 2,
        // stride, offset, etc. if needed
    },
});

// Create VAO
const vao_info = twgl.createVertexArrayInfo(gl, program_info, buffer_info);

console.log(program_info);
console.log(buffer_info);
console.log(vao_info);

let last_time = 0;
function update(cur_time) {
    stats.update();
    if (twgl.resizeCanvasToDisplaySize(canvas)) {
        // on resize
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
    gl.clear(gl.COLOR_BUFFER_BIT);

    let cur_color = Color({ h: (cur_time * .1) % 360, s: 100, v: 100 });

    gl.useProgram(program_info.program);
    // Set the VAO (single gl call)
    twgl.setBuffersAndAttributes(gl, program_info, vao_info);
    twgl.setUniformsAndBindTextures(program_info, {
        u_tint: cur_color.unitArray(),
    })
    twgl.drawBufferInfo(gl, buffer_info);
    // gl.drawArrays(
    //     gl.TRIANGLES,
    //     0, // offset
    //     3  // count
    // );
    requestAnimationFrame(update);
}
requestAnimationFrame(update);
