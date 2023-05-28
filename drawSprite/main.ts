import * as twgl from "twgl.js"

// Simple "engine", with a single function to draw sprites

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
    
        // [0, 1]^2
        in vec2 a_vertex;
    
        // pixels for everything
        uniform vec2 u_resolution;
        uniform vec2 u_position;
        uniform vec2 u_size;
    
        out vec2 v_texcoord;
    
        void main() {
            // if size is 100 & screen is 400, then
            // clip space result width will be .5
            vec2 pos = 2.0 * a_vertex * u_size / u_resolution;
    
            // if position is 200 & screen is 400, then
            // clip space result offset will be .5
            pos += 2.0 * u_position / u_resolution;

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
