import * as twgl from "twgl.js"

import Stats from "stats.js"
// stats();
var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

//// init
const canvas = document.querySelector("#c")! as HTMLCanvasElement;
const gl = canvas.getContext("webgl2")!;
gl.clearColor(0.5, 0.5, 0.75, 1.0);

console.log("MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: ", gl.getParameter(gl.MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS))
console.log("MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: ", gl.getParameter(gl.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS))
console.log("MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: ", gl.getParameter(gl.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS))

// game logic
const n_universes = 8;

const positions_cpu = new Float32Array(n_universes * 8 * 2);
for (let b = 0; b < 8; b++) {
    let start_x = Math.random() - .5;
    let start_y = Math.random() - .5;
    for (let k = 0; k < n_universes; k++) {
        let base_index = k * 16 + b * 2;
        positions_cpu[base_index + 0] = start_x;
        positions_cpu[base_index + 1] = start_y;
    }
}
// initial chaos
for (let k = 0; k < n_universes; k++) {
    const ang = Math.PI * 2 * k / n_universes;
    positions_cpu[k * 16 + 0] += Math.cos(ang) * .05;
    positions_cpu[k * 16 + 1] += Math.sin(ang) * .05;
}
const velocities_cpu = new Float32Array(n_universes * 8 * 2);
// Ball 0 starts with random vel
for (let k = 0; k < n_universes; k++) {
    velocities_cpu[k * 16 + 0] = Math.random() - .5;
    velocities_cpu[k * 16 + 1] = Math.random() - .5;
}

// double buffer pattern
const positions1_gpu = twgl.createBufferFromTypedArray(gl, positions_cpu, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
const positions2_gpu = twgl.createBufferFromTypedArray(gl, positions_cpu, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
const velocities1_gpu = twgl.createBufferFromTypedArray(gl, velocities_cpu, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
const velocities2_gpu = twgl.createBufferFromTypedArray(gl, velocities_cpu, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);

const update_1to2 = twgl.createBufferInfoFromArrays(gl, {
    old_pos: {
        buffer: positions1_gpu,
        numComponents: 16,
        type: Float32Array,
    },
    new_pos: {
        buffer: positions2_gpu,
        numComponents: 16,
        type: Float32Array,
    },
    old_vel: {
        buffer: velocities1_gpu,
        numComponents: 16,
        type: Float32Array,
    },
    new_vel: {
        buffer: velocities2_gpu,
        numComponents: 16,
        type: Float32Array,
    },
});
const update_2to1 = twgl.createBufferInfoFromArrays(gl, {
    old_pos: update_1to2.attribs!.new_pos,
    new_pos: update_1to2.attribs!.old_pos,
    old_vel: update_1to2.attribs!.new_vel,
    new_vel: update_1to2.attribs!.old_vel,
});

const draw_1 = twgl.createBufferInfoFromArrays(gl, {
    pos: {
        buffer: positions1_gpu,
        numComponents: 2,
        type: Float32Array,
    },
});
const draw_2 = twgl.createBufferInfoFromArrays(gl, {
    pos: {
        buffer: positions2_gpu,
        numComponents: 2,
        type: Float32Array,
    },
});

const update_pinfo = twgl.createProgramInfo(gl, [
    // vs
    `#version 300 es

    // positions of 8 balls
    in mat4 old_pos;
    out mat4 new_pos;
    // velocities of 8 balls
    in mat4 old_vel;
    out mat4 new_vel;

    void main() {
        float dt = 0.01;
        new_pos = old_pos + old_vel * dt;
        new_vel = old_vel;
    }
    `,
    // fs
    `#version 300 es
    precision highp float;

    void main() {}
    `
], {
    transformFeedbackVaryings: ["new_pos", "new_vel"],
    transformFeedbackMode: gl.SEPARATE_ATTRIBS,
});

const draw_pinfo = twgl.createProgramInfo(gl, [
    // vs
    `#version 300 es

    in vec2 pos;

    void main() {
        gl_Position = vec4(pos, 0.0, 1.0);
        gl_PointSize = 10.0;
    }
    `,
    // fs
    `#version 300 es
    precision highp float;

    out vec4 color;
    
    void main() {
        color = vec4(1.0, 0.0, 0.0, 1.0);
    }
    `
]);

const update_1 = twgl.createTransformFeedback(gl, update_pinfo, update_1to2);
const update_2 = twgl.createTransformFeedback(gl, update_pinfo, update_2to1);

let from_buf_1 = true;

console.log("calc: ", n_universes * 8);
console.log("real: ", draw_1.numElements);

let last_time = 0;
function update(cur_time) {
    stats.begin();
    if (twgl.resizeCanvasToDisplaySize(canvas)) {
        // on resize
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
    let delta = cur_time - last_time;
    last_time = cur_time;

    // for (let k = 0; k < numInstances; k++) {
    //     let x = positions[k * 2 + 0];
    //     let y = positions[k * 2 + 1];
    //     positions[k * 2 + 0] = (x + delta * 0.1) % gl.canvas.width;
    //     positions[k * 2 + 1] = (y + delta * 0.1) % gl.canvas.height;
    // }

    //// update
    gl.enable(gl.RASTERIZER_DISCARD);
    gl.useProgram(update_pinfo.program);
    if (from_buf_1) {
        twgl.bindTransformFeedbackInfo(gl, update_pinfo, update_1to2);
        gl.beginTransformFeedback(gl.POINTS);
        twgl.drawBufferInfo(gl, update_1to2, gl.POINTS, n_universes);
        gl.endTransformFeedback();
    } else {
        twgl.bindTransformFeedbackInfo(gl, update_pinfo, update_2to1);
        gl.beginTransformFeedback(gl.POINTS);
        twgl.drawBufferInfo(gl, update_2to1, gl.POINTS, n_universes);
        gl.endTransformFeedback();
    }
    gl.disable(gl.RASTERIZER_DISCARD);

    //// draw
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(draw_pinfo.program);
    if (from_buf_1) {
        twgl.setBuffersAndAttributes(gl, draw_pinfo, draw_1);
        twgl.drawBufferInfo(gl, draw_1, gl.POINTS, n_universes * 8);
    } else {
        twgl.setBuffersAndAttributes(gl, draw_pinfo, draw_2);
        twgl.drawBufferInfo(gl, draw_2, gl.POINTS, n_universes * 8);
    }


    from_buf_1 = !from_buf_1;

    // twgl.setAttribInfoBufferFromArray(gl, buffer_info.attribs!.i_position, positions);

    // gl.useProgram(draw_balls_program_info.program);
    // twgl.setBuffersAndAttributes(gl, draw_balls_program_info, buffer_info);
    // twgl.setUniforms(draw_balls_program_info, {
    //     u_texture: textures.sprite_1,
    //     u_resolution: [gl.canvas.width, gl.canvas.height],
    // });
    // if (useFan) {
    //     twgl.drawBufferInfo(gl, buffer_info, gl.TRIANGLE_FAN, buffer_info.numElements, 0, numInstances);
    // } else {
    //     twgl.drawBufferInfo(gl, buffer_info, gl.TRIANGLES, buffer_info.numElements, 0, numInstances);
    // }

    stats.end();
    requestAnimationFrame(update);
}

requestAnimationFrame(update);
