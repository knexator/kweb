import * as twgl from "twgl.js"

import Stats from "stats.js"
var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

//// init
const canvas = document.querySelector("#c")! as HTMLCanvasElement;
const gl = canvas.getContext("webgl2", { alpha: false })!;
gl.clearColor(0.5, 0.5, 0.75, 1.0);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

// console.log("MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: ", gl.getParameter(gl.MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS))
// console.log("MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: ", gl.getParameter(gl.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS))
// console.log("MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: ", gl.getParameter(gl.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS))

// game logic
const n_universes = 100_000;
const n_balls = 2;
const ball_r = .05;

const positions_cpu = new Float32Array(n_universes * n_balls * 2);
for (let b = 0; b < n_balls; b++) {
    let start_x = Math.random() - .5;
    let start_y = Math.random() - .5;
    for (let k = 0; k < n_universes; k++) {
        let base_index = (k * n_balls + b) * 2;
        positions_cpu[base_index + 0] = start_x;
        positions_cpu[base_index + 1] = start_y;
    }
}
// initial chaos
for (let k = 0; k < n_universes; k++) {
    const ang = Math.PI * 2 * k / n_universes;
    positions_cpu[k * n_balls * 2 + 0] += Math.cos(ang) * .05;
    positions_cpu[k * n_balls * 2 + 1] += Math.sin(ang) * .05;
}
const velocities_cpu = new Float32Array(n_universes * n_balls * 2);
// Ball 0 starts with random vel
// for (let k = 0; k < n_universes; k++) {
//     velocities_cpu[k * n_balls * 2 + 0] = Math.random() - .5;
//     velocities_cpu[k * n_balls * 2 + 1] = Math.random() - .5;
// }

// double buffer pattern
const positions1_gpu = twgl.createBufferFromTypedArray(gl, positions_cpu, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
const positions2_gpu = twgl.createBufferFromTypedArray(gl, positions_cpu, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
const velocities1_gpu = twgl.createBufferFromTypedArray(gl, velocities_cpu, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
const velocities2_gpu = twgl.createBufferFromTypedArray(gl, velocities_cpu, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);

const update_bi_1to2 = twgl.createBufferInfoFromArrays(gl, {
    old_pos: {
        buffer: positions1_gpu,
        numComponents: n_balls * 2,
        type: Float32Array,
    },
    new_pos: {
        buffer: positions2_gpu,
        numComponents: n_balls * 2,
        type: Float32Array,
    },
    old_vel: {
        buffer: velocities1_gpu,
        numComponents: n_balls * 2,
        type: Float32Array,
    },
    new_vel: {
        buffer: velocities2_gpu,
        numComponents: n_balls * 2,
        type: Float32Array,
    },
});
const update_bi_2to1 = twgl.createBufferInfoFromArrays(gl, {
    old_pos: {
        buffer: positions2_gpu,
        numComponents: n_balls * 2,
        type: Float32Array,
    },
    new_pos: {
        buffer: positions1_gpu,
        numComponents: n_balls * 2,
        type: Float32Array,
    },
    old_vel: {
        buffer: velocities2_gpu,
        numComponents: n_balls * 2,
        type: Float32Array,
    },
    new_vel: {
        buffer: velocities1_gpu,
        numComponents: n_balls * 2,
        type: Float32Array,
    },
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

    precision highp float;

    #define ball_r ${(ball_r).toFixed(10)}
    #define bounce .9
    #define drag .99

    // positions of 2 balls
    in vec4 old_pos;
    out vec4 new_pos;
    // velocities of 2 balls
    in vec4 old_vel;
    out vec4 new_vel;

    uniform vec2 u_impulse;

    // pos, vel for each ball
    void collide(in vec4 b1, in vec4 b2, out vec4 r1, out vec4 r2) {
        r1 = b1;
        r2 = b2;

        vec2 delta = b1.xy - b2.xy;
        float distSq = dot(delta, delta);
        if (distSq > 0.0 && distSq < 4.0 * ball_r * ball_r) {
            float dist = sqrt(distSq);
            // assumption: all balls have the same mass
            // intuition: the balls exchange their momentum
            // but only on the direction joining them

            // 1. avoid overlap
            float push = (2.0 * ball_r - dist) * .5 * bounce / dist;
            r1.xy += delta * push;
            r2.xy -= delta * push;

            // 2. exchange momentums
            vec2 momentum = delta * (dot(delta, b1.zw) - dot(delta, b2.zw)) / distSq;
            r1.zw -= momentum;
            r2.zw += momentum;
        }        
    }

    void main() {
        float dt = 0.01;
        new_vel = old_vel + vec4(u_impulse, 0.0, 0.0);
        new_pos = old_pos + new_vel * dt;
        // bounce on borders
        bvec4 mask_negative = lessThan(new_pos, vec4(-1.0 + ball_r));
        bvec4 mask_positive = greaterThan(new_pos, vec4(1.0 - ball_r));
        new_pos = mix(new_pos, -(2.0 - 2.0 * ball_r) - new_pos, mask_negative);
        new_pos = mix(new_pos, (2.0 - 2.0 * ball_r) - new_pos, mask_positive);
        bvec4 mask_both = bvec4(
            mask_positive[0] || mask_negative[0],
            mask_positive[1] || mask_negative[1],
            mask_positive[2] || mask_negative[2],
            mask_positive[3] || mask_negative[3]
        );
        new_vel = mix(new_vel, -new_vel, mask_both);
        new_vel *= drag;

        // collision
        vec4 r1;
        vec4 r2;
        collide(
            vec4(new_pos.xy, new_vel.xy), 
            vec4(new_pos.zw, new_vel.zw), r1, r2);
        new_pos = vec4(r1.xy, r2.xy);
        new_vel = vec4(r1.zw, r2.zw);
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

    out vec3 v_ball_color;

    void main() {
        gl_Position = vec4(pos, 0.0, 1.0);
        gl_PointSize = ${(gl.canvas.width * 2 * ball_r).toFixed(10)};
        v_ball_color = mix(vec3(1.0, 0, 0), vec3(0.0, 1, 0), mod(float(gl_VertexID), 2.0));
    }
    `,
    // fs
    `#version 300 es
    precision highp float;

    in vec3 v_ball_color;

    out vec4 out_color;
    
    void main() {
        float distSq = dot(gl_PointCoord - .5, gl_PointCoord - .5);
        float alpha = smoothstep(.25, .20, distSq);
        float outline = smoothstep(.27, .20, distSq);
        out_color = vec4(v_ball_color * outline, alpha * .1);
    }
    `
]);

// VAO has metadata for inputs, this has metadata for outputs
const update_tf_2to1 = twgl.createTransformFeedback(gl, update_pinfo, update_bi_2to1);
const update_tf_1to2 = twgl.createTransformFeedback(gl, update_pinfo, update_bi_1to2);
// unbind left over stuff
gl.bindBuffer(gl.ARRAY_BUFFER, null);

console.log("calc: ", n_universes * n_balls);
console.log("real: ", draw_1.numElements);

let cur_buffers = {
    update_bi: update_bi_1to2, // read from position1
    tf: update_tf_1to2,    // write to position2
    draw_bi: draw_2,      // draw with position2
}

let next_buffers = {
    update_bi: update_bi_2to1, // read from position2
    tf: update_tf_2to1,    // write to position1
    draw_bi: draw_1,      // draw with position1
}

type Vec2 = number[];
let last_click_pos: Vec2 | null = null;
let pending_impulse: Vec2 = [0, 0];

document.addEventListener("mousedown", ev => {
    last_click_pos = [ev.offsetX, ev.offsetY];
});

document.addEventListener("mouseup", ev => {
    let cur_pos = [ev.offsetX, ev.offsetY];
    const force = .01;
    pending_impulse = [-(cur_pos[0] - last_click_pos![0]) * force, (cur_pos[1] - last_click_pos![1]) * force];
    last_click_pos = null;
})

let last_time = 0;
function update(cur_time) {
    stats.update();
    if (twgl.resizeCanvasToDisplaySize(canvas)) {
        // on resize
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
    let delta = cur_time - last_time;
    last_time = cur_time;

    //// update
    gl.useProgram(update_pinfo.program);

    twgl.setBuffersAndAttributes(gl, update_pinfo, cur_buffers.update_bi);
    gl.enable(gl.RASTERIZER_DISCARD);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, cur_buffers.tf);
    twgl.setUniforms(update_pinfo, {
        u_impulse: pending_impulse,
    });
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, n_universes);
    gl.endTransformFeedback();
    gl.disable(gl.RASTERIZER_DISCARD);
    // unbind left over stuff
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

    pending_impulse = [0, 0];

    //// draw
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(draw_pinfo.program);
    twgl.setBuffersAndAttributes(gl, draw_pinfo, cur_buffers.draw_bi);
    gl.drawArrays(gl.POINTS, 0, n_universes * n_balls);

    {
        const temp = cur_buffers;
        cur_buffers = next_buffers;
        next_buffers = temp;
    }

    requestAnimationFrame(update);
}

requestAnimationFrame(update);
