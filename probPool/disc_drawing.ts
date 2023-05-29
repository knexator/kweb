import * as twgl from "twgl.js"

import Stats from "stats.js"

// stats();
var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// Most of the code is the same as drawSprite

//// init
const canvas = document.querySelector("#c")! as HTMLCanvasElement;
// ensure that we trigger a resize on the first frame
canvas.width = 1;
canvas.height = 1;
const gl = canvas.getContext("webgl2")!;
gl.clearColor(0.5, 0.5, 0.75, 1.0);

const draw_balls_program_info = twgl.createProgramInfo(gl, [
    // vs
    `#version 300 es
    
    uniform vec2 u_resolution;
    
    // circle centered at 0, with radius 1
    in vec2 a_vertex;

    // instancing
    in vec2 i_position;
    // in vec2 i_size;

    out vec2 v_texcoord;

    void main() {
        // if size is 100 & screen is 400, then
        // clip space result width will be .5
        vec2 pos = 2.0 * a_vertex * vec2(20, 20.0) / u_resolution;

        // if position is 200 & screen is 400, then
        // clip space result offset will be .5
        pos += 2.0 * i_position / u_resolution;

        // pos of 0 should go to the top left
        pos -= vec2(1, 1);

        // ypos = down
        pos.y = -pos.y;

        gl_Position = vec4(pos, 0, 1);

        v_texcoord = a_vertex * .5 + .5;
    }
    `,
    // fs
    `#version 300 es
    precision highp float;

    in vec2 v_texcoord;

    uniform sampler2D u_texture;
    
    out vec4 out_color;

    void main() {
        // out_color = vec4(v_texcoord, 0.0, 1.0);
        out_color = texture(u_texture, v_texcoord);
    }
    `
]);

// game logic
const numInstances = 1000;
const useFan = false;
const disc_resolution = 8;

let positions = new Float32Array(numInstances * 2);
for (let k = 0; k < numInstances; k++) {
    positions[k * 2 + 0] = Math.random() * 1000;
    positions[k * 2 + 1] = Math.random() * 1000;
}

let sizes = new Float32Array(numInstances * 2);
for (let k = 0; k < numInstances; k++) {
    sizes[k * 2 + 0] = 100 + Math.random() * 50;
    sizes[k * 2 + 1] = 100 + Math.random() * 50;
}

function makeDisc(n) {
    if (useFan) {
        let result = twgl.primitives.createAugmentedTypedArray(n + 2, 2, Float32Array);
        // @ts-ignore
        result.push([0.0, 0.0]);
        for (let k = 0; k < n; k++) {
            const ang = Math.PI * 2 * k / n;
            // @ts-ignore
            result.push([Math.cos(ang), Math.sin(ang)]);
        }
        // @ts-ignore
        result.push([1.0, 0.0]);
        return result;
    } else {
        let result = twgl.primitives.createAugmentedTypedArray(n * 3, 2, Float32Array);
        for (let k = 0; k < n; k++) {
            const ang1 = Math.PI * 2 * k / n;
            const ang2 = Math.PI * 2 * (k + 1) / n;
            // @ts-ignore
            result.push([0.0, 0.0]);
            // @ts-ignore
            result.push([Math.cos(ang1), Math.sin(ang1)]);
            // @ts-ignore
            result.push([Math.cos(ang2), Math.sin(ang2)]);
        }
        return result;
    }
}

const buffer_info = twgl.createBufferInfoFromArrays(gl, {
    a_vertex: {
        data: makeDisc(disc_resolution),
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

// load texture
const textures = twgl.createTextures(gl, {
    sprite_1: {
        src: (new URL('sprite.png', import.meta.url)).toString(),
        // mag: gl.NEAREST
    },
});

let last = 0;
function update(now) {
    stats.begin();
    if (twgl.resizeCanvasToDisplaySize(canvas)) {
        // on resize
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.useProgram(draw_balls_program_info.program);
        twgl.setUniforms(draw_balls_program_info, {
            u_resolution: [gl.canvas.width, gl.canvas.height],
        });
    }
    let delta = now - last;
    last = now;

    for (let k = 0; k < numInstances; k++) {
        let x = positions[k * 2 + 0];
        let y = positions[k * 2 + 1];
        positions[k * 2 + 0] = (x + delta * 0.1) % gl.canvas.width;
        positions[k * 2 + 1] = (y + delta * 0.1) % gl.canvas.height;
    }

    //// draw
    gl.clear(gl.COLOR_BUFFER_BIT);

    twgl.setAttribInfoBufferFromArray(gl, buffer_info.attribs!.i_position, positions);

    gl.useProgram(draw_balls_program_info.program);
    twgl.setBuffersAndAttributes(gl, draw_balls_program_info, buffer_info);
    twgl.setUniforms(draw_balls_program_info, {
        u_texture: textures.sprite_1,
        u_resolution: [gl.canvas.width, gl.canvas.height],
    });
    if (useFan) {
        twgl.drawBufferInfo(gl, buffer_info, gl.TRIANGLE_FAN, buffer_info.numElements, 0, numInstances);
    } else {
        twgl.drawBufferInfo(gl, buffer_info, gl.TRIANGLES, buffer_info.numElements, 0, numInstances);
    }

    stats.end();
    requestAnimationFrame(update);
}

requestAnimationFrame(update);
