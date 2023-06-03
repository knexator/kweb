import * as twgl from "twgl.js"

// @ts-ignore
import vert_source from "./shaders/sprite.vert";
// @ts-ignore
import frag_source from "./shaders/sprite.frag";

// Simple "engine", with a single function to draw sprites

//// init
const canvas = document.querySelector("#c")! as HTMLCanvasElement;
// ensure that we trigger a resize on the first frame
canvas.width = 1;
canvas.height = 1;
const gl = canvas.getContext("webgl2")!;
gl.clearColor(0.5, 0.5, 0.75, 1.0);

const sprite_program_info = twgl.createProgramInfo(gl, [vert_source, frag_source]);

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
    twgl.setBuffersAndAttributes(gl, sprite_program_info, buffer_info);
    twgl.setUniforms(sprite_program_info, {
        u_texture: texture,
        u_resolution: [gl.canvas.width, gl.canvas.height],
        u_size: [w, h],
        u_position: [x, y],
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

// game logic
let px = 123;
let py = 234;

let last = 0;
function update(now) {
    if (twgl.resizeCanvasToDisplaySize(canvas)) {
        // on resize
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        twgl.setUniforms(sprite_program_info, {
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

    requestAnimationFrame(update);
}

requestAnimationFrame(update);
