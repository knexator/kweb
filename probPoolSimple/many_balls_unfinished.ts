import * as twgl from "twgl.js"

import Stats from "stats.js"
var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

//// init
const canvas = document.querySelector("#c")! as HTMLCanvasElement;
const gl = canvas.getContext("webgl2")!;
gl.clearColor(0.5, 0.5, 0.75, 1.0);

// game logic
const n_universes = 100;
const n_balls = 2;

const tf_buffer_info = twgl.createBufferInfoFromArrays(gl, {
    in_pos_1: {
        data: n_universes * 2,
        drawType: gl.DYNAMIC_DRAW
    }
});

twgl.createBufferFromTypedArray



const tf_program = twgl.createProgramInfo(gl, [
    // vs
    `#version 300 es


    ${fromCount(n_balls, i => {
        return `in vec2 in_pos_${i};
                in vec2 in_vel_${i};

                out vec2 out_pos_${i};
                out vec2 out_vel_${i};`
    }).join("\n")}

    void main() {
        float dt = 0.01;
    ${fromCount(n_balls, i => {
        return `out_pos_${i} = fract(in_pos_${i} + in_vel_${i} * dt);
                out_vel_${i} = in_vel_${i};`
    }).join("\n")}
    }
    `,
    // fs
    `#version 300 es
    precision highp float;
    
    void main() {}
    `
], {
    transformFeedbackVaryings: fromCount(n_balls, i => {
        return `out_pos_${i}`
    }).concat(fromCount(n_balls, i => {
        return `out_vel_${i}`
    })),
    transformFeedbackMode: gl.SEPARATE_ATTRIBS,
});

const draw_program = twgl.createProgramInfo(gl, [
    // vs
    `#version 300 es

    in vec2 pos;

    void main() {
        gl_Position = pos;
        gl_PointSize = 10.0;
    }
    `,
    // fs
    `#version 300 es
    precision highp float;

    out color;
    
    void main() {
        color = vec4(1.0, 0.0, 0.0, 1.0);
    }
    `
]);

let ball_positions = new Float32Array(n_universes * 2);
for (let k = 0; k < n_universes; k++) {
    positions[k * 2 + 0] = Math.random() * 1000;
    positions[k * 2 + 1] = Math.random() * 1000;
}

const buffer_info = twgl.createBufferInfoFromArrays(gl, {
    a_vertex: {
        data: [
            // Triangle for 1,1 corner
            1.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            // Triangle for 0,0 corner
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
        ],
        numComponents: 2,
        // stride, offset, etc. if needed
    },
    i_position: {
        data: positions,
        numComponents: 2,
        divisor: 1, // changes every 1 instances
        drawType: gl.DYNAMIC_DRAW,
    },
    i_size: {
        data: sizes,
        numComponents: 2,
        divisor: 1,
        drawType: gl.STATIC_DRAW,
    },
});

let last_time = 0;
function update(cur_time) {
    stats.begin();
    if (twgl.resizeCanvasToDisplaySize(canvas)) {
        // on resize
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
    let delta = cur_time - last_time;
    last_time = cur_time;

    //// draw
    gl.clear(gl.COLOR_BUFFER_BIT);

    twgl.setAttribInfoBufferFromArray(gl, buffer_info.attribs!.i_position, positions);

    gl.useProgram(tf_program.program);
    twgl.setBuffersAndAttributes(gl, tf_program, buffer_info);
    twgl.setUniforms(tf_program, {
        u_texture: textures.sprite_1,
        u_resolution: [gl.canvas.width, gl.canvas.height],
    });
    twgl.drawBufferInfo(gl, buffer_info, gl.TRIANGLES, buffer_info.numElements, 0, n_universes);

    stats.end();
    requestAnimationFrame(update);
}

requestAnimationFrame(update);


function fromCount<T>(n: number, callback: (index: number) => T) {
    let result = Array(n);
    for (let k = 0; k < n; k++) {
        result[k] = callback(k);
    }
    return result;
}