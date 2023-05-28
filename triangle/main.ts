import * as twgl from "twgl.js"

// init
const canvas = document.querySelector("#c")! as HTMLCanvasElement;
const gl = canvas.getContext("webgl2")!;
twgl.resizeCanvasToDisplaySize(canvas);
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
gl.clearColor(0.5, 0.5, 0.75, 1.0);

// Compiles the shader, gets all the uniform/attribute locations
const program_info = twgl.createProgramInfo(gl, [
    // vs
    `#version 300 es

    in vec2 a_position;

    out vec3 v_col;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_col = a_position.x * vec3(1.5, 0.5, 0.2) 
              + a_position.y * vec3(0.2, 1.5, 0.0) 
              + (2.0 - a_position.x - a_position.y) * vec3(0.0, 0.2, 1.5);
    }
    `,
    // fs
    `#version 300 es
    precision highp float;

    in vec3 v_col;
    
    out vec4 out_color;
    void main() {
        out_color = vec4(v_col, 1);
    }
    `
]);

// Creates VBOs & VAO
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


console.log(program_info);
console.log(buffer_info);

// draw
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program_info.program);
// use the given VAO
twgl.setBuffersAndAttributes(gl, program_info, buffer_info);
twgl.drawBufferInfo(gl, buffer_info);
// gl.drawArrays(
//     gl.TRIANGLES,
//     0, // offset
//     3  // count
// );
