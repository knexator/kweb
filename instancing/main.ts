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

const sprite_program_info = twgl.createProgramInfo(gl, [
    // vs
    `#version 300 es
    
    uniform vec2 u_resolution;
    
    // [0, 1]^2
    in vec2 a_vertex;

    // instancing
    in vec2 i_position;
    in vec2 i_size;

    out vec2 v_texcoord;

    void main() {
        // if size is 100 & screen is 400, then
        // clip space result width will be .5
        vec2 pos = 2.0 * a_vertex * i_size / u_resolution;

        // if position is 200 & screen is 400, then
        // clip space result offset will be .5
        pos += 2.0 * i_position / u_resolution;

        // pos of 0 should go to the top left
        pos -= vec2(1, 1);

        // ypos = down
        pos.y = -pos.y;

        gl_Position = vec4(pos, 0, 1);

        v_texcoord = a_vertex;
    }
    `,
    // fs
    `#version 300 es
    precision highp float;

    in vec2 v_texcoord;

    uniform sampler2D u_texture;
    
    out vec4 out_color;

    void main() {
        out_color = texture(u_texture, v_texcoord);
    }
    `
]);

// game logic
const numInstances = 1000;

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
        gl.useProgram(sprite_program_info.program);
        twgl.setUniforms(sprite_program_info, {
            u_resolution: [gl.canvas.width, gl.canvas.height],
        });
    }
    let delta = now - last;
    last = now;

    for (let k = 0; k < numInstances; k++) {
        let x = positions[k * 2 + 0];
        let y = positions[k * 2 + 1];
        positions[k * 2 + 0] = (x + delta) % gl.canvas.width;
        positions[k * 2 + 1] = (y + delta) % gl.canvas.height;
    }

    //// draw
    gl.clear(gl.COLOR_BUFFER_BIT);

    twgl.setAttribInfoBufferFromArray(gl, buffer_info.attribs!.i_position, positions);

    gl.useProgram(sprite_program_info.program);
    twgl.setBuffersAndAttributes(gl, sprite_program_info, buffer_info);
    twgl.setUniforms(sprite_program_info, {
        u_texture: textures.sprite_1,
        u_resolution: [gl.canvas.width, gl.canvas.height],
    });
    twgl.drawBufferInfo(gl, buffer_info, gl.TRIANGLES, buffer_info.numElements, 0, numInstances);

    stats.end();
    requestAnimationFrame(update);
}

requestAnimationFrame(update);
