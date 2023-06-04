import * as twgl from "twgl.js"

// @ts-ignore
import sprite_vert_src from "./shaders/sprite.vert";
// @ts-ignore
import sprite_frag_src from "./shaders/sprite.frag";
// @ts-ignore
import circ_vert_src from "./shaders/circ.vert";
// @ts-ignore
import circ_frag_src from "./shaders/circ.frag";

// Specify common uniforms using UBOs

// not working :(
// twgl has no support for using the same UBO in multiple shaders
// to get this working, it'd have to be more handmade
// for the moment, forget about it

//// init
const canvas = document.querySelector("#c")! as HTMLCanvasElement;
// ensure that we trigger a resize on the first frame
canvas.width = 1;
canvas.height = 1;
const gl = canvas.getContext("webgl2", { alpha: false })!;
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.clearColor(0.5, 0.5, 0.75, 1.0);

const sprite_program_info = twgl.createProgramInfo(gl, [sprite_vert_src, sprite_frag_src]);
const circ_program_info = twgl.createProgramInfo(gl, [circ_vert_src, circ_frag_src]);

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
});

/**
* Draws the given image
* @param texture texture to draw
* @param x distance in pixels to the left of the screen
* @param y distance in pixels to the top of the screen
* @param w width in pixels
* @param h height in pixels
*/
function drawImage(texture: WebGLTexture, x: number, y: number, w: number, h: number) {
    gl.useProgram(sprite_program_info.program);
    twgl.bindUniformBlock(gl, sprite_program_info, common_data_ubo_info);
    twgl.setBuffersAndAttributes(gl, sprite_program_info, buffer_info);
    twgl.setUniforms(sprite_program_info, {
        u_size: [w, h],
        u_position: [x, y],
        u_texture: texture,
    });
    twgl.drawBufferInfo(gl, buffer_info);
}

/**
* Draws a circle
* @param x distance in pixels to the left of the screen
* @param y distance in pixels to the top of the screen
* @param w width in pixels
* @param h height in pixels
*/
function drawCircle(x: number, y: number, w: number, h: number) {
    gl.useProgram(circ_program_info.program);
    twgl.bindUniformBlock(gl, circ_program_info, common_data_ubo_info);
    twgl.setBuffersAndAttributes(gl, circ_program_info, buffer_info);
    twgl.setUniforms(circ_program_info, {
        u_size: [w, h],
        u_position: [x, y],
        u_radius: .25,
    });
    twgl.drawBufferInfo(gl, buffer_info);
}

// load texture
const textures = twgl.createTextures(gl, {
    sprite_1: {
        src: (new URL('sprite.png', import.meta.url)).toString(),
        // mag: gl.NEAREST
    },
});

// UBOs
// full tutorial at https://gist.github.com/jialiang/2880d4cc3364df117320e8cb324c2880
// twgl taken from https://twgljs.org/examples/uniform-buffer-objects.html
const common_data_ubo_info = twgl.createUniformBlockInfo(gl, circ_program_info, "CommonData");
// link the ubo with each program
gl.uniformBlockBinding(sprite_program_info.program,
    gl.getUniformBlockIndex(sprite_program_info.program, "CommonData"),
    0 // index of the uniform block
);
gl.uniformBlockBinding(circ_program_info.program,
    gl.getUniformBlockIndex(circ_program_info.program, "CommonData"),
    0 // index of the uniform block
);

// game logic
let px = 123;
let py = 234;

let last = 0;
function update(now) {
    if (twgl.resizeCanvasToDisplaySize(canvas)) {
        // on resize
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

        // Change the global uniform
        twgl.setBlockUniforms(common_data_ubo_info, {
            u_resolution: [gl.canvas.width, gl.canvas.height],
        });
    }
    let delta = now - last;
    last = now;

    px = (px + delta) % gl.canvas.width;
    py = (py + delta) % gl.canvas.height;

    //// draw
    gl.clear(gl.COLOR_BUFFER_BIT);

    drawImage(textures.sprite_1, px, py, 200, 200);
    drawCircle(100, 200, 300, 400);

    requestAnimationFrame(update);
}

requestAnimationFrame(update);
