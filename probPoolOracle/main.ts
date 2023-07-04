import * as twgl from "twgl.js"

import Stats from "stats.js"
import { fromCount, fromRange } from "../kommon/kommon";
var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

//// init
const canvas = document.querySelector("#c")! as HTMLCanvasElement;
const gl = canvas.getContext("webgl2", { alpha: false })!;
gl.clearColor(0.5, 0.5, 0.75, 1.0);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

// game logic
const n_updates = 100;
const n_universes = 250;
const n_balls = 8;
const ball_r = .05;
const chaos = .01;

const update_program = twgl.createProgramFromSources(gl, [
    // vs
    `#version 300 es

    precision highp float;

    #define ball_r ${(ball_r).toFixed(10)}
    #define bounce .9
    #define drag .99
    #define dt 0.01

    ${fromCount(n_balls, i => {
        return `in vec4 old_b${i}; out vec4 new_b${i};`
    }).join("\n")}

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

    vec4 individualUpdate(vec4 ball) {
        // movement
        vec4 res = vec4(ball.xy + dt * ball.zw, ball.zw);
        // bounce
        if (abs(res.x) > 1.0 - ball_r) {
            res.x = sign(res.x) * (2.0 - 2.0 * ball_r) - ball.x;
            res.z = -ball.z;
        }
        if (abs(res.y) > 1.0 - ball_r) {
            res.y = sign(res.y) * (2.0 - 2.0 * ball_r) - ball.y;
            res.w = -ball.w;
        }
        // drag
        res.zw *= drag;
        return res;
    }

    void main() {
        new_b0 = individualUpdate(vec4(old_b0.xy, old_b0.zw + u_impulse));
    ${fromRange(1, n_balls, i => {
        return `new_b${i} = individualUpdate(old_b${i});`
    }).join("\n")}
        // collision
        // generate this code:
        // collide(new_b0, new_b1, new_b0, new_b1);
        // collide(0, 2) ...
        // collide(0, n_balls-1)
        // collide(1, 2) ...
        // collide(1, n_balls-1)
        // ...
        // collide(n_balls - 2, n_balls-1)
    ${fromRange(0, n_balls, i => {
        return fromRange(i + 1, n_balls, j => {
            return `collide(new_b${i}, new_b${j}, new_b${i}, new_b${j});`;
        }).join("\n");
    }).join("\n")}
    }
    `,
    // fs
    `#version 300 es
    precision highp float;

    void main() {}
    `
], {
    transformFeedbackVaryings: fromRange(0, n_balls, k => `new_b${k}`),
    transformFeedbackMode: gl.INTERLEAVED_ATTRIBS,
});

// px,py,vx,vy for each ball
// [b0px,b0py,b0vx,b0vy,b1...,b2...,b0px,b0py,b0vx,b0vy,b1...,b2...,....]
const balldata_cpu = new Float32Array(n_universes * n_balls * 4);
for (let b = 0; b < n_balls; b++) {
    let start_px = (Math.random() - .5) * (2 - ball_r);
    let start_py = (Math.random() - .5) * (2 - ball_r);
    for (let k = 0; k < n_universes; k++) {
        let base_index = (k * n_balls + b) * 4;
        balldata_cpu[base_index + 0] = start_px;
        balldata_cpu[base_index + 1] = start_py;
    }
}
// initial chaos
for (let k = 0; k < n_universes; k++) {
    const ang = Math.PI * 2 * k / n_universes;
    balldata_cpu[k * n_balls * 4 + 0] += Math.cos(ang) * chaos;
    balldata_cpu[k * n_balls * 4 + 1] += Math.sin(ang) * chaos;
}

// double buffer pattern
const balldata_gpu_1 = twgl.createBufferFromTypedArray(gl, balldata_cpu, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
const balldata_gpu_2 = twgl.createBufferFromTypedArray(gl, balldata_cpu, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);

const draw_pinfo = twgl.createProgramInfo(gl, [
    // vs
    `#version 300 es

    #define n_balls ${(n_balls).toFixed(10)}

    in vec2 pos;

    out vec3 v_ball_color;

    vec3 hsl2rgb(in vec3 c) {
        vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
    }


    void main() {
        gl_Position = vec4(pos, 0.0, 1.0);
        gl_PointSize = ${(gl.canvas.width * 2 * ball_r).toFixed(10)};
        v_ball_color = hsl2rgb(vec3(float(gl_VertexID) / n_balls, 0.85, 0.5));
        // v_ball_color = mix(vec3(1.0, 0, 0), vec3(0.0, 1, 0), mod(float(gl_VertexID), n_balls) / n_balls);
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

const draw_1_vao = twgl.createVertexArrayInfo(gl, draw_pinfo, twgl.createBufferInfoFromArrays(gl, {
    pos: {
        buffer: balldata_gpu_1,
        numComponents: 2,
        stride: 4 * 4, // in bytes
        type: Float32Array,
    },
}));
const draw_2_vao = twgl.createVertexArrayInfo(gl, draw_pinfo, twgl.createBufferInfoFromArrays(gl, {
    pos: {
        buffer: balldata_gpu_2,
        numComponents: 2,
        stride: 4 * 4, // in bytes
        type: Float32Array,
    },
}));

const u_impulse_loc = gl.getUniformLocation(update_program, "u_impulse");
const old_b_locs = fromCount(n_balls, k => {
    return gl.getAttribLocation(update_program, `old_b${k}`);
});

const vao_update_1to2 = gl.createVertexArray()!;
gl.bindVertexArray(vao_update_1to2);
gl.bindBuffer(gl.ARRAY_BUFFER, balldata_gpu_1);
for (let k = 0; k < n_balls; k++) {
    gl.enableVertexAttribArray(old_b_locs[k]);
    gl.vertexAttribPointer(old_b_locs[k],
        4, // size
        gl.FLOAT,
        false, // normalize
        n_balls * 4 * 4, // stride in bytes, each universe is has n_balls*4 float32
        16 * k, // offset in bytes
    )
}

const vao_update_2to1 = gl.createVertexArray()!;
gl.bindVertexArray(vao_update_2to1);
gl.bindBuffer(gl.ARRAY_BUFFER, balldata_gpu_2);
for (let k = 0; k < n_balls; k++) {
    gl.enableVertexAttribArray(old_b_locs[k]);
    gl.vertexAttribPointer(old_b_locs[k],
        4, // size
        gl.FLOAT,
        false, // normalize
        n_balls * 4 * 4, // stride in bytes, each universe is has n_balls*4 float32
        16 * k, // offset in bytes
    )
}

gl.bindVertexArray(null);

const tf_2to1 = gl.createTransformFeedback()!;
gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf_2to1);
gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, balldata_gpu_1);

const tf_1to2 = gl.createTransformFeedback()!;
gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf_1to2);
gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, balldata_gpu_2);

// unbind left over stuff
gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

let buffers_1to2 = {
    update_vao: vao_update_1to2, // read from position 1
    tf: tf_1to2,                 // write to position 2
    draw_vao: draw_2_vao.vertexArrayObject!,  // draw with position 2
}

let buffers_2to1 = {
    update_vao: vao_update_2to1, // read from position 2
    tf: tf_2to1,                 // write to position 1
    draw_vao: draw_1_vao.vertexArrayObject!,  // draw with position 1
}

type Vec2 = number[];
let last_click_pos: Vec2 | null = null;
let theoretical_impulse: Vec2 = [0, 0];
let apply_impulse = false;

document.addEventListener("mousedown", ev => {
    last_click_pos = [ev.offsetX, ev.offsetY];
});

document.addEventListener("mouseup", ev => {
    apply_impulse = true;
    last_click_pos = null;
});

document.addEventListener("mousemove", ev => {
    if (last_click_pos !== null) {
        let cur_pos = [ev.offsetX, ev.offsetY];
        const force = .01;
        theoretical_impulse = [-(cur_pos[0] - last_click_pos[0]) * force, (cur_pos[1] - last_click_pos[1]) * force];
    }
});

let last_time = 0;
function update(cur_time) {
    stats.update();
    if (twgl.resizeCanvasToDisplaySize(canvas)) {
        // on resize
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
    let delta = cur_time - last_time;
    last_time = cur_time;

    gl.clear(gl.COLOR_BUFFER_BIT);

    // ground truth is the cpu

    // copy cpu to gpu
    gl.bindBuffer(gl.ARRAY_BUFFER, balldata_gpu_1);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, balldata_cpu);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // do a single update...
    gl.useProgram(update_program);
    gl.enable(gl.RASTERIZER_DISCARD);
    gl.bindVertexArray(vao_update_1to2);
    if (apply_impulse) {
        gl.uniform2f(u_impulse_loc, theoretical_impulse[0], theoretical_impulse[1]);
        apply_impulse = false;
        theoretical_impulse = [0, 0];
    } else {
        gl.uniform2f(u_impulse_loc, 0, 0);
    }
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf_1to2);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, n_universes);
    gl.endTransformFeedback();
    gl.disable(gl.RASTERIZER_DISCARD);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    // ...and copy the result back to the cpu
    gl.bindBuffer(gl.ARRAY_BUFFER, balldata_gpu_2);
    gl.getBufferSubData(gl.ARRAY_BUFFER, 0, balldata_cpu);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // draw the present
    gl.useProgram(draw_pinfo.program);
    gl.bindVertexArray(draw_2_vao.vertexArrayObject!);
    gl.drawArrays(gl.POINTS, 0, n_universes * n_balls);

    // on the other hand, predict the future!
    let cur_buffers = buffers_1to2;
    let next_buffers = buffers_2to1;
    gl.useProgram(update_program);
    gl.enable(gl.RASTERIZER_DISCARD);
    for (let k = 0; k < n_updates; k++) {
        if (k > 0) {
            const temp = cur_buffers;
            cur_buffers = next_buffers;
            next_buffers = temp;
        }
        gl.bindVertexArray(cur_buffers.update_vao);
        if (k === 0) {
            gl.uniform2f(u_impulse_loc, theoretical_impulse[0], theoretical_impulse[1]);
        } else {
            gl.uniform2f(u_impulse_loc, 0, 0);
        }
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, cur_buffers.tf);
        gl.beginTransformFeedback(gl.POINTS);
        gl.drawArrays(gl.POINTS, 0, n_universes);
        gl.endTransformFeedback();
    }
    gl.disable(gl.RASTERIZER_DISCARD);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    // draw the future!
    gl.useProgram(draw_pinfo.program);
    gl.bindVertexArray(cur_buffers.draw_vao);
    gl.drawArrays(gl.POINTS, 0, n_universes * n_balls);

    requestAnimationFrame(update);
}

// const line_pinfo = twgl.createProgramInfo(gl, [
//     // vs
//     `#version 300 es

//     in vec2 pos;

//     void main() {
//         gl_Position = vec4(pos, 0.0, 1.0);
//     }
//     `,
//     // fs
//     `#version 300 es
//     precision highp float;

//     out vec4 out_color;

//     void main() {
//         out_color = vec4(1.0);
//     }
//     `
// ]);

requestAnimationFrame(update);
