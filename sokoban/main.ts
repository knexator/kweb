import * as twgl from "twgl.js"
import { fromRange } from "../kommon/kommon";

// This "if" will only execute during development
if (module.hot) {
    module.hot.dispose(data => {
        data.game_state = game_state;
        cancelAnimationFrame(loop_id);
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);

        let gl_lose_context_ext = gl.getExtension('WEBGL_lose_context');
        if (gl_lose_context_ext !== null) {
            gl_lose_context_ext.loseContext();
        } else {
            console.log("There will be memory leaks, remember to reload the page every now and then.")
        }
    });
    module.hot.accept(_ => {
        game_state = module.hot!.data.game_state;
    });
}

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

// data for sprite renderer
// per tile:
// - 4 vertices : vec8
// - 2 uv vertices : vec4
// ?? idk, depends on the specifics (do we want rotation? arbitrary rotation? arbitrary uvs? coords on pixels or tiles or screen?)

// for now, let's do it perfectly, one thing at a time
// and from there, get an imperfect but general system

// min data for a tilemap:
// global:
// - screen resolution : vec2
// - tilemap count : vec2
// - tilemap top left : vec2
// - tile size : float/vec2?/vec4 (if allowing an arbitrary base)
//    (for now, float)
// per tile:
// - tile index : vec2
// - position : vec2
// draw an instanced [0,1] quad, or maybe directly use vertexId?
// in any case, a_vertex is a [0,1] quad
// computations:
// - pos = u_origin + (a_vertex + a_position) * vec2(u_basis_x, u_basis_y)
// - uv = (a_tilemap_index + a_vertex) / u_sprite_counts
// tothink:
//   what if there's a margin?
//   no need for position if we assume a rectangular tilemap... but that's too much
//   another option is to always use the same mesh, & only change tile indices
//     todo: that seems cool, will do when this one is working
const tilemap_programinfo = twgl.createProgramInfo(gl, [
    // vs
    `#version 300 es

    // [0, 1]^2 (in other words, a quad)
    in vec2 a_vertex;

    // per-sprite data
    in vec2 a_position;
    in vec2 a_tileindex;

    // global data
    // sprites drawn at 0,0 will end in this clipspace position
    uniform vec2 u_origin;
    // sprites drawn at 1,1 will end in u_origin plus this clipspace position
    uniform vec2 u_basis;
    // number of sprites in the spritesheet
    uniform vec2 u_sheet_count;

    out vec2 v_texcoord;

    void main() {
        gl_Position = vec4(u_origin + (a_vertex + a_position) * u_basis, 0.0, 1.0);
        v_texcoord = (a_tileindex + a_vertex) / u_sheet_count;
    }
    `,
    // fs
    `#version 300 es
    precision highp float;
    
    in vec2 v_texcoord;

    uniform sampler2D u_sheet;

    out vec4 out_color;

    void main() {
        out_color = texture(u_sheet, v_texcoord);
    }
    `
]);

const tilemap_texture = twgl.createTexture(gl, {
    src: (new URL('walls_312.png', import.meta.url)).toString(),
    mag: gl.NEAREST,
    wrap: gl.REPEAT,
});

const level_src = `
####!!
#.O#!!
#..###
#@P..#
#..*.#
#..###
####!!
`.trim();

const level_rows = level_src.split('\n').map(r => r.trim());
const level_height = level_rows.length;
const level_width = level_rows[0].length;
console.assert(level_rows.every(r => r.length == level_width), "Bad ascii level");
const level_walls = level_rows.map(r => r.split('').map(c => c == '#')).flat()

function getWallAt(i: number, j: number): boolean {
    if (i < 0 || i >= level_width || j < 0 || j >= level_height) {
        return false
    }
    return level_walls[i + j * level_width];
}

function getTileIndex(i: number, j: number): [number, number] {
    // Same numbering as http://www.cr31.co.uk/stagecast/wang/2corn.html
    let tr_corner = getWallAt(i - 0, j - 1) ? 1 : 0;
    let br_corner = getWallAt(i - 0, j - 0) ? 2 : 0;
    let bl_corner = getWallAt(i - 1, j - 0) ? 4 : 0;
    let tl_corner = getWallAt(i - 1, j - 1) ? 8 : 0;
    let lookup_index = tl_corner + tr_corner + bl_corner + br_corner;
    const lookup_table: [number, number][] = [
        [0, 3], [0, 2], [1, 3], [1, 0],
        [0, 0], [2, 3], [3, 0], [1, 1],
        [3, 3], [1, 2], [0, 1], [2, 2],
        [3, 2], [3, 1], [2, 0], [2, 1],
    ];
    return lookup_table[lookup_index];
}

const tilemap_tilesize = 64;
const tilemap_width = level_width + 1;
const tilemap_height = level_height + 1;
const tilemap_data_cpu = new Float32Array(4 * tilemap_width * tilemap_height);
for (let j = 0; j < tilemap_height; j++) {
    for (let i = 0; i < tilemap_width; i++) {
        let k = (i + j * tilemap_width) * 4;
        // x,y position; no tilemap specific logic
        tilemap_data_cpu[k + 0] = i;
        tilemap_data_cpu[k + 1] = j;
        // actual tile to use, depends on the actual map state
        let cur_index = getTileIndex(i, j);
        tilemap_data_cpu[k + 2] = cur_index[0];
        tilemap_data_cpu[k + 3] = cur_index[1];
    }
}

const tilemap_buffer = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, tilemap_buffer);
gl.bufferData(gl.ARRAY_BUFFER, tilemap_data_cpu, gl.STATIC_DRAW);

let tilemap_vaoinfo = twgl.createVertexArrayInfo(gl, tilemap_programinfo, twgl.createBufferInfoFromArrays(gl, {
    a_position: {
        buffer: tilemap_buffer,
        type: gl.FLOAT,
        numComponents: 2,
        stride: 4 * 4,
        offset: 0 * 4,
        divisor: 1,
    },
    a_tileindex: {
        buffer: tilemap_buffer,
        type: gl.FLOAT,
        numComponents: 2,
        stride: 4 * 4,
        offset: 2 * 4,
        divisor: 1,
    },
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
}))

// raw version, unfinished - missing a_vertex & divisors.
if (false) {
    var vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    {
        // @ts-ignore
        let a_position_loc = tilemap_programinfo.attribSetters["a_position"].location;
        gl.enableVertexAttribArray(a_position_loc);
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 4 * 4;    // stride in bytes
        var offset = 0 * 4;    // offset in bytes
        gl.vertexAttribPointer(
            a_position_loc, size, type, normalize, stride, offset);
    }
    {
        // @ts-ignore
        let a_tileindex_loc = tilemap_programinfo.attribSetters["a_tileindex"].location;
        gl.enableVertexAttribArray(a_tileindex_loc);
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 4 * 4;    // stride in bytes
        var offset = 2 * 4;    // offset in bytes
        gl.vertexAttribPointer(
            a_tileindex_loc, size, type, normalize, stride, offset);
    }
}

const floor_texture = twgl.createTexture(gl, {
    src: (new URL('floor_312.png', import.meta.url)).toString(),
    mag: gl.NEAREST,
    wrap: gl.REPEAT,
});

let level_floors = level_rows.map(r => r.split('').map(c => c != '#' && c != '!')).flat()

// Floor approach: only first fill N tiles
// use same shader, or another? for now, let's keep the same one
const floormap_data_cpu = new Float32Array(4 * level_width * level_height);
let n_floors = 0;
for (let j = 0; j < level_height; j++) {
    for (let i = 0; i < level_width; i++) {
        if (level_floors[i + j * level_width]) {
            // x,y position
            floormap_data_cpu[n_floors * 4 + 0] = i;
            floormap_data_cpu[n_floors * 4 + 1] = j;
            // actual tile to use is always 0,0
            tilemap_data_cpu[n_floors * 4 + 2] = 0;
            tilemap_data_cpu[n_floors * 4 + 3] = 0;

            n_floors += 1;
        }
    }
}

const floormap_buffer = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, floormap_buffer);
gl.bufferData(gl.ARRAY_BUFFER, floormap_data_cpu, gl.STATIC_DRAW);


let floormap_vaoinfo = twgl.createVertexArrayInfo(gl, tilemap_programinfo, twgl.createBufferInfoFromArrays(gl, {
    a_position: {
        buffer: floormap_buffer,
        type: gl.FLOAT,
        numComponents: 2,
        stride: 4 * 4,
        offset: 0 * 4,
        divisor: 1,
    },
    a_tileindex: {
        buffer: floormap_buffer,
        type: gl.FLOAT,
        numComponents: 2,
        stride: 4 * 4,
        offset: 2 * 4,
        divisor: 1,
    },
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
}))

// Player & boxes sprite drawing
// for now, let's keep the same shader
// this batching only makes sense if all textures are in the same atlas
// but texture packing is boooring & unflexible (unless we had a custom parcel plugin...)
// maybe i'm overcomplicating stuff for no gain :/
// nah, even with different textures, it's cool to have a single buffer, since we can draw subsets of it.
const max_n_sprites = 32;
var cur_n_sprites = 0;
var moving_sprites_cpu = new Float32Array(max_n_sprites * 4);
const moving_sprites_buffer = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, moving_sprites_buffer);
gl.bufferData(gl.ARRAY_BUFFER, moving_sprites_cpu, gl.DYNAMIC_DRAW);

let moving_sprites_vaoinfo = twgl.createVertexArrayInfo(gl, tilemap_programinfo, twgl.createBufferInfoFromArrays(gl, {
    a_position: {
        buffer: moving_sprites_buffer,
        type: gl.FLOAT,
        numComponents: 2,
        stride: 4 * 4,
        offset: 0 * 4,
        divisor: 1,
    },
    a_tileindex: {
        buffer: moving_sprites_buffer,
        type: gl.FLOAT,
        numComponents: 2,
        stride: 4 * 4,
        offset: 2 * 4,
        divisor: 1,
    },
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
}))

const player_texture = twgl.createTexture(gl, {
    src: (new URL('player_puzzlescript.png', import.meta.url)).toString(),
    mag: gl.NEAREST,
    wrap: gl.REPEAT,
});

let game_state = {
    debug_x: 0,
    debug_y: 0,
    player_i: 2,
    player_j: 3,
};

// player sprite data
let player_sprite_index = cur_n_sprites;
cur_n_sprites += 1;
moving_sprites_cpu[player_sprite_index * 4 + 0] = game_state.player_i;
moving_sprites_cpu[player_sprite_index * 4 + 1] = game_state.player_j;
moving_sprites_cpu[player_sprite_index * 4 + 2] = 0; // tile index
moving_sprites_cpu[player_sprite_index * 4 + 3] = 0;


let input_state: {
    pressed: Record<string, boolean>,
    queued: string[],
} = {
    pressed: {},
    queued: [],
};


let loop_id = requestAnimationFrame(update);
document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

function onKeyDown(ev: KeyboardEvent) {
    console.log("keydown");
    input_state.pressed[ev.code] = true;
    input_state.queued.push(ev.code);
    /*switch (ev.code) {
        case "KeyD":
            input_state.d_down = true;
            break;
        case "KeyA":
            input_state.a_down = true;
            break;
        case "KeyW":
            input_state.w_down = true;
            break;
        case "KeyS":
            input_state.s_down = true;
            break;
    }*/
}

function onKeyUp(ev: KeyboardEvent) {
    console.log("keyup");
    input_state.pressed[ev.code] = false;
    /*switch (ev.code) {
        case "KeyD":
            input_state.d_down = false;
            break;
        case "KeyA":
            input_state.a_down = false;
            break;
        case "KeyW":
            input_state.w_down = false;
            break;
        case "KeyS":
            input_state.s_down = false;
            break;
    }*/
}


function update() {
    if (twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement)) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }

    if (input_state.pressed["KeyA"]) {
        game_state.debug_x -= 1;
    }
    if (input_state.pressed["KeyD"]) {
        game_state.debug_x += 1;
    }
    if (input_state.pressed["KeyW"]) {
        game_state.debug_y -= 1;
    }
    if (input_state.pressed["KeyS"]) {
        game_state.debug_y += 1;
    }
    // console.log(game_state.x, game_state.y);

    // todo: wall collision
    // todo: animation
    let player_moved = false;
    while (input_state.queued.length > 0) {
        let cur_input = input_state.queued.shift();
        switch (cur_input) {
            case "KeyD":
                game_state.player_i += 1;
                player_moved = true;
                break;
            case "KeyA":
                game_state.player_i -= 1;
                player_moved = true;
                break;
            case "KeyW":
                game_state.player_j -= 1;
                player_moved = true;
                break;
            case "KeyS":
                game_state.player_j += 1;
                player_moved = true;
                break;
        }
    }

    if (player_moved) {
        moving_sprites_cpu[player_sprite_index * 4 + 0] = game_state.player_i;
        moving_sprites_cpu[player_sprite_index * 4 + 1] = game_state.player_j;
    }

    gl.clear(gl.COLOR_BUFFER_BIT);

    // Debug temp stuff
    gl.useProgram(sprite_program_info.program);
    twgl.setBuffersAndAttributes(gl, sprite_program_info, sprite_vao);
    twgl.setUniforms(sprite_program_info, {
        u_texture: my_texture,
        u_resolution: [gl.canvas.width, gl.canvas.height],
        u_size: [50, 50],
        u_position: [game_state.debug_x, game_state.debug_y],
    });
    twgl.drawBufferInfo(gl, sprite_buffer_info);

    // walls
    gl.useProgram(tilemap_programinfo.program);
    gl.bindVertexArray(tilemap_vaoinfo.vertexArrayObject!);
    twgl.setUniformsAndBindTextures(tilemap_programinfo, {
        u_origin: [- tilemap_width * tilemap_tilesize / gl.canvas.width, tilemap_height * tilemap_tilesize / gl.canvas.height],
        u_basis: [2 * tilemap_tilesize / gl.canvas.width, -2 * tilemap_tilesize / gl.canvas.height],
        u_sheet_count: [4, 4],
        u_sheet: tilemap_texture,
    });
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, tilemap_width * tilemap_height);

    // floors
    gl.bindVertexArray(floormap_vaoinfo.vertexArrayObject!);
    twgl.setUniformsAndBindTextures(tilemap_programinfo, {
        u_origin: [- level_width * tilemap_tilesize / gl.canvas.width, level_height * tilemap_tilesize / gl.canvas.height],
        u_basis: [2 * tilemap_tilesize / gl.canvas.width, -2 * tilemap_tilesize / gl.canvas.height],
        u_sheet_count: [1, 1],
        u_sheet: floor_texture,
    });
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, n_floors);

    gl.bindBuffer(gl.ARRAY_BUFFER, moving_sprites_buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, moving_sprites_cpu);
    gl.bindVertexArray(moving_sprites_vaoinfo.vertexArrayObject!);
    twgl.setUniformsAndBindTextures(tilemap_programinfo, {
        u_origin: [- level_width * tilemap_tilesize / gl.canvas.width, level_height * tilemap_tilesize / gl.canvas.height],
        u_basis: [2 * tilemap_tilesize / gl.canvas.width, -2 * tilemap_tilesize / gl.canvas.height],
        u_sheet_count: [1, 1],
        u_sheet: player_texture,
    });
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, cur_n_sprites);


    loop_id = requestAnimationFrame(update);
}
