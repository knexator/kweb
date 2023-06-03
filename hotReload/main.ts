import * as twgl from "twgl.js"

const gl = (document.querySelector("#c") as HTMLCanvasElement).getContext("webgl2", { alpha: false })!;
gl.clearColor(0.5, 0.5, 0.75, 1.0);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);


const my_texture = twgl.createTexture(gl, {
    src: (new URL('sprite.png', import.meta.url)).toString(),
    // mag: gl.NEAREST, etc
});

// @ts-ignore
import vert_source from "../drawSprite/shaders/sprite.vert";
// @ts-ignore
import frag_source from "../drawSprite/shaders/sprite.frag";
const sprite_program_info = twgl.createProgramInfo(gl, [vert_source, frag_source]);
const sprite_buffer_info = twgl.createBufferInfoFromArrays(gl, {
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
    },
});
const sprite_vao = twgl.createVertexArrayInfo(gl, sprite_program_info, sprite_buffer_info);

console.log("a");

// This "if" will only execute during development
if (module.hot) {
    module.hot.dispose(data => {
        // data.state = state;
        // data.hola = "hola";
        data.game_state = game_state;
        cancelAnimationFrame(loop_id);
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);

        let gl_lose_context_ext = gl.getExtension('WEBGL_lose_context');
        if (gl_lose_context_ext !== null) {
            // gl_lose_context_ext.loseContext();
        } else {
            console.log("There will be memory leaks, remember to reload the page every now and then.")
        }
    });
    module.hot.accept(_ => {
        console.log("b");
        console.log(module.hot!.data);
        game_state = module.hot!.data.game_state;
        // console.log(_);
        // console.log(module.hot!.data);
        // window.asdf // no
    });
}

console.log("c");

// check that images get reloaded correctly in canvas

let game_state = {
    x: 0,
    y: 0,
};

let input_state = {
    w_down: false,
    a_down: false,
    s_down: false,
    d_down: false,
};


let loop_id = requestAnimationFrame(update);
document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

function onKeyDown(ev: KeyboardEvent) {
    console.log("keydown");
    switch (ev.key.toUpperCase()) {
        case "D":
            input_state.d_down = true;
            break;
        case "A":
            input_state.a_down = true;
            break;
        case "W":
            input_state.w_down = true;
            break;
        case "S":
            input_state.s_down = true;
            break;
    }
}

function onKeyUp(ev: KeyboardEvent) {
    console.log("keyup");
    switch (ev.key.toUpperCase()) {
        case "D":
            input_state.d_down = false;
            break;
        case "A":
            input_state.a_down = false;
            break;
        case "W":
            input_state.w_down = false;
            break;
        case "S":
            input_state.s_down = false;
            break;
    }
}

function update() {
    if (twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement)) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }

    if (input_state.a_down) {
        game_state.x -= 1;
    }
    if (input_state.d_down) {
        game_state.x += 1;
    }
    if (input_state.w_down) {
        game_state.y -= 1;
    }
    if (input_state.s_down) {
        game_state.y += 1;
    }
    console.log(game_state.x, game_state.y);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(sprite_program_info.program);
    twgl.setBuffersAndAttributes(gl, sprite_program_info, sprite_vao);
    twgl.setUniforms(sprite_program_info, {
        u_texture: my_texture,
        u_resolution: [gl.canvas.width, gl.canvas.height],
        u_size: [50, 50],
        u_position: [game_state.x, game_state.y],
    });
    twgl.drawBufferInfo(gl, sprite_buffer_info);

    loop_id = requestAnimationFrame(update);
}
