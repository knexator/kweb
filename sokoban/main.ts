import * as twgl from "twgl.js"
import { Vec2, clamp } from "../kommon/math";

// This "if" will only execute during development
if (module.hot) {
    module.hot.dispose(data => {
        data.game_state = game_state;
        cancelAnimationFrame(loop_id);
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
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
// can't use instancing since it can't offset into the attribute buffer
// so we will use Shaku's style vertex buffers, sending 6 vertices per sprite instead of a single vec2 position :(
// each vertex needs position, uv, depth?, color? for the moment, only pos (vec2) & uv (vec2)
// Let's use sepparate buffers instead of interleaved, since they won't update with the same frequency
// Vertices will be: top left, top right, bottom left, bottom right.
// even with different textures, it's cool to have a single buffer, since we can draw subsets of it.
// but it would be even cooler with atlas texture, @future: custom parcel plugin for auto atlas packing

const sprites_programinfo = twgl.createProgramInfo(gl, [
    // vs
    `#version 300 es

    in vec2 a_position;
    in vec2 a_texcoord;

    // global data
    // sprites drawn at 0,0 will end in this clipspace position
    uniform vec2 u_origin;
    // sprites drawn at 1,1 will end in u_origin plus this clipspace position
    uniform vec2 u_basis;

    out vec2 v_texcoord;

    void main() {
        gl_Position = vec4(u_origin + a_position * u_basis, 0.0, 1.0);
        v_texcoord = a_texcoord;
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

const max_n_sprites = 32;
console.assert((max_n_sprites * 6) < (1 << 16), "Can't draw that many sprites, change the code to use u32 indices.");

var cur_n_sprites = 0;
var sprites_pos_cpu = new Float32Array(max_n_sprites * 2);
var sprites_uv_cpu = new Float32Array(max_n_sprites * 2);

const sprites_indices = new Uint16Array(max_n_sprites * 6);
for (let k = 0; k < max_n_sprites; k += 1) {
    // top left triangle
    sprites_indices[k * 6 + 0] = k * 4 + 0;
    sprites_indices[k * 6 + 1] = k * 4 + 1;
    sprites_indices[k * 6 + 2] = k * 4 + 2;
    // bottom right triangle
    sprites_indices[k * 6 + 3] = k * 4 + 1;
    sprites_indices[k * 6 + 4] = k * 4 + 3;
    sprites_indices[k * 6 + 5] = k * 4 + 2;
}

let sprites_bufferinfo = twgl.createBufferInfoFromArrays(gl, {
    a_position: {
        data: sprites_pos_cpu,
        numComponents: 2,
        drawType: gl.DYNAMIC_DRAW,
    },
    a_texcoord: {
        data: sprites_uv_cpu,
        numComponents: 2,
        drawType: gl.DYNAMIC_DRAW,
    },
    indices: {
        data: sprites_indices,
        drawType: gl.STATIC_DRAW,
    },
});

const sprites_pos_gpu = sprites_bufferinfo.attribs!.a_position.buffer;
const sprites_uv_gpu = sprites_bufferinfo.attribs!.a_texcoord.buffer;

const sprites_vaoinfo = twgl.createVertexArrayInfo(gl, sprites_programinfo, sprites_bufferinfo);

const player_texture = twgl.createTexture(gl, {
    src: (new URL('player_puzzlescript.png', import.meta.url)).toString(),
    mag: gl.NEAREST,
    wrap: gl.REPEAT,
});

const crate_texture = twgl.createTexture(gl, {
    src: (new URL('crate_puzzlescript.png', import.meta.url)).toString(),
    mag: gl.NEAREST,
    wrap: gl.REPEAT,
});


let game_state = {
    debug_x: 0,
    debug_y: 0,
    player_pos: new Vec2(2, 3),
    crates_pos: [
        new Vec2(1, 3),
        new Vec2(3, 4),
    ]
};
type GameState = typeof game_state;

// Command: Any action that takes time & is undoable

class PlayerMoveCommand {
    constructor(
        public original_pos: Vec2,
        public dir: Vec2,
    ) { }

    execute() {
        Vec2.add(this.original_pos, this.dir, game_state.player_pos);
    }

    animTurn(turn_time: number) {
        Vec2.add(this.original_pos, Vec2.scale(this.dir, turn_time), visual_state.player_sprite.position);
        updateSpritePositionOrSize(visual_state.player_sprite);
    }

    undoAnimTurn(turn_time: number) {
        this.animTurn(1.0 - turn_time);
    }

    undo() {
        Vec2.copy(this.original_pos, game_state.player_pos);
    }
}

class PushCrateCommand {
    extra_command: PlayerMoveCommand;

    constructor(
        public crate_index: number,
        public original_pos: Vec2,
        public dir: Vec2,
    ) {
        this.extra_command = new PlayerMoveCommand(Vec2.sub(original_pos, dir), dir);
    }

    execute() {
        Vec2.add(this.original_pos, this.dir, game_state.crates_pos[this.crate_index]);
        this.extra_command.execute();
    }

    animTurn(turn_time: number) {
        Vec2.add(this.original_pos, Vec2.scale(this.dir, turn_time), visual_state.crates_sprites[this.crate_index].position);
        updateSpritePositionOrSize(visual_state.crates_sprites[this.crate_index]);
        this.extra_command.animTurn(turn_time);
    }

    undoAnimTurn(turn_time: number) {
        // player moves backwards
        this.extra_command.animTurn(1.0 - turn_time);
        // crate pops into place
        let tile_center = Vec2.add(this.original_pos, new Vec2(.5, .5));
        if (turn_time < .5) {
            Vec2.scale(Vec2.one, 1.0 - 2.0 * turn_time, visual_state.crates_sprites[this.crate_index].size);
            Vec2.add(tile_center, this.dir, tile_center);
        } else {
            Vec2.scale(Vec2.one, 2.0 * turn_time - 1.0, visual_state.crates_sprites[this.crate_index].size);
            Vec2.copy(this.original_pos, visual_state.crates_sprites[this.crate_index].position);
        }
        setSpriteCenter(visual_state.crates_sprites[this.crate_index], tile_center);
        updateSpritePositionOrSize(visual_state.crates_sprites[this.crate_index]);
    }

    undo() {
        Vec2.copy(this.original_pos, game_state.crates_pos[this.crate_index]);
        this.extra_command.undo();
    }
}

class BumpWallCommand {
    constructor(
        public pos: Vec2,
        public dir: Vec2,
    ) { }

    execute() {
        throw new Error("not an executable command");
    }

    animTurn(turn_time: number) {
        let displacement = turn_time * (1 - turn_time);
        Vec2.add(this.pos, Vec2.scale(this.dir, displacement), visual_state.player_sprite.position);
        updateSpritePositionOrSize(visual_state.player_sprite);
    }

    undoAnimTurn(turn_time: number) {
        throw new Error("not an undoable command");
    }

    undo() {
        throw new Error("not an undoable command");
    }
}

// todo: generic command
// todo: BumpWallCommand is inherently very dirty :(
// the solution would be to embrace logic & render separation, & have separate queues for logic commands & render commands

type Command = PlayerMoveCommand | PushCrateCommand | BumpWallCommand;

let command_history: Command[] = [];

let visual_state = {
    turn_time: 0,
    player_sprite: createSprite(
        Vec2.copy(game_state.player_pos),
        Vec2.copy(Vec2.one),
        Vec2.copy(Vec2.zero),
        Vec2.copy(Vec2.one),
    ),
    crates_sprites: game_state.crates_pos.map(crate_pos => {
        return createSprite(
            Vec2.copy(crate_pos),
            Vec2.copy(Vec2.one),
            Vec2.copy(Vec2.zero),
            Vec2.copy(Vec2.one),
        );
    }),
}

let cur_animating_command: null | Command = null;
let cur_animating_undo_command: null | Command = null;

const move_duration = .05;

// player sprite data

type Sprite = {
    buffer_index: number,
    position: Vec2,
    size: Vec2,
    uv_pos: Vec2,
    uv_size: Vec2,
}

function createSprite(pos: Vec2, size: Vec2, uv_pos: Vec2, uv_size: Vec2): Sprite {
    let index = cur_n_sprites;
    cur_n_sprites += 1;
    let sprite: Sprite = {
        buffer_index: index,
        position: pos,
        size: size,
        uv_pos: uv_pos,
        uv_size: uv_size,
    }
    updateSpritePositionOrSize(sprite);
    updateSpriteUVs(sprite);
    return sprite;
}

function setSpriteCenter(sprite: Sprite, center: Vec2) {
    Vec2.sub(center, Vec2.scale(sprite.size, .5), sprite.position);
}

function updateSpritePositionOrSize(sprite: Sprite) {
    // vertex positions 
    sprites_pos_cpu[sprite.buffer_index * 8 + 0] = sprite.position.x;
    sprites_pos_cpu[sprite.buffer_index * 8 + 1] = sprite.position.y;

    sprites_pos_cpu[sprite.buffer_index * 8 + 2] = sprite.position.x + sprite.size.x;
    sprites_pos_cpu[sprite.buffer_index * 8 + 3] = sprite.position.y;

    sprites_pos_cpu[sprite.buffer_index * 8 + 4] = sprite.position.x;
    sprites_pos_cpu[sprite.buffer_index * 8 + 5] = sprite.position.y + sprite.size.x;

    sprites_pos_cpu[sprite.buffer_index * 8 + 6] = sprite.position.x + sprite.size.x;
    sprites_pos_cpu[sprite.buffer_index * 8 + 7] = sprite.position.y + sprite.size.x;
}

function updateSpriteUVs(sprite: Sprite) {
    // vertex uv coordinates
    sprites_uv_cpu[sprite.buffer_index * 8 + 0] = sprite.uv_pos.x;
    sprites_uv_cpu[sprite.buffer_index * 8 + 1] = sprite.uv_pos.y;

    sprites_uv_cpu[sprite.buffer_index * 8 + 2] = sprite.uv_pos.x + sprite.uv_size.x;
    sprites_uv_cpu[sprite.buffer_index * 8 + 3] = sprite.uv_pos.y;

    sprites_uv_cpu[sprite.buffer_index * 8 + 4] = sprite.uv_pos.x;
    sprites_uv_cpu[sprite.buffer_index * 8 + 5] = sprite.uv_pos.y + sprite.uv_size.x;

    sprites_uv_cpu[sprite.buffer_index * 8 + 6] = sprite.uv_pos.x + sprite.uv_size.x;
    sprites_uv_cpu[sprite.buffer_index * 8 + 7] = sprite.uv_pos.y + sprite.uv_size.x;
}

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
}

function onKeyUp(ev: KeyboardEvent) {
    console.log("keyup");
    input_state.pressed[ev.code] = false;
}


let time_last = 0;
function update(time_cur: number) {
    let delta = (time_cur - time_last) * 0.001;
    time_last = time_cur;

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

    if (input_state.queued.length > 0 && cur_animating_command === null && cur_animating_undo_command === null) {
        let cur_input = input_state.queued.shift();
        if (cur_input == "KeyZ") {
            if (command_history.length > 0) {
                cur_animating_undo_command = command_history.pop()!;
                cur_animating_undo_command.undo();
                visual_state.turn_time = 0;
            }
        } else {
            let player_delta = new Vec2()
            switch (cur_input) {
                case "KeyD":
                    player_delta.x = 1;
                    break;
                case "KeyA":
                    player_delta.x = -1;
                    break;
                case "KeyW":
                    player_delta.y = -1;
                    break;
                case "KeyS":
                    player_delta.y = 1;
                    break;
            }

            if (player_delta.x != 0 || player_delta.y != 0) {
                let new_player_pos = Vec2.add(game_state.player_pos, player_delta);
                if (!getWallAt(new_player_pos.x, new_player_pos.y)) {
                    let pushing_crate_index = game_state.crates_pos.findIndex(crate_pos => Vec2.equals(new_player_pos, crate_pos));
                    if (pushing_crate_index == -1) {
                        // Standard move
                        cur_animating_command = new PlayerMoveCommand(Vec2.copy(game_state.player_pos), player_delta);
                        cur_animating_command.execute()
                        command_history.push(cur_animating_command);
                    } else {
                        // Try to push a crate
                        let new_crate_pos = Vec2.add(game_state.crates_pos[pushing_crate_index], player_delta);
                        let is_push_blocked = getWallAt(new_crate_pos.x, new_crate_pos.y)
                            || game_state.crates_pos.some(crate_pos => Vec2.equals(new_crate_pos, crate_pos));
                        if (!is_push_blocked) {
                            // Push a crate
                            cur_animating_command = new PushCrateCommand(pushing_crate_index, Vec2.copy(game_state.crates_pos[pushing_crate_index]), player_delta);
                            cur_animating_command.execute()
                            command_history.push(cur_animating_command);
                        } else {
                            cur_animating_command = new BumpWallCommand(game_state.player_pos, player_delta);
                        }
                    }
                } else {
                    cur_animating_command = new BumpWallCommand(game_state.player_pos, player_delta);
                }
            }
        }
    }

    if (cur_animating_command !== null) {
        visual_state.turn_time += delta / move_duration;
        visual_state.turn_time = clamp(visual_state.turn_time, 0, 1);
        cur_animating_command.animTurn(visual_state.turn_time);
        if (visual_state.turn_time >= 1) {
            cur_animating_command = null;
            visual_state.turn_time = 0;
        }
    } else if (cur_animating_undo_command !== null) {
        visual_state.turn_time += delta / move_duration;
        visual_state.turn_time = clamp(visual_state.turn_time, 0, 1);
        cur_animating_undo_command.undoAnimTurn(visual_state.turn_time);
        if (visual_state.turn_time >= 1) {
            cur_animating_undo_command = null;
            visual_state.turn_time = 0;
        }
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

    // moving stuff:
    gl.bindBuffer(gl.ARRAY_BUFFER, sprites_pos_gpu);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, sprites_pos_cpu);
    gl.bindBuffer(gl.ARRAY_BUFFER, sprites_uv_gpu);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, sprites_uv_cpu);

    gl.useProgram(sprites_programinfo.program)
    gl.bindVertexArray(sprites_vaoinfo.vertexArrayObject!);

    //  - player
    twgl.setUniformsAndBindTextures(sprites_programinfo, {
        u_origin: [- level_width * tilemap_tilesize / gl.canvas.width, level_height * tilemap_tilesize / gl.canvas.height],
        u_basis: [2 * tilemap_tilesize / gl.canvas.width, -2 * tilemap_tilesize / gl.canvas.height],
        u_texture: player_texture,
    });
    gl.drawElements(gl.TRIANGLES,
        6, // 1 quad
        gl.UNSIGNED_SHORT, visual_state.player_sprite.buffer_index * 12); // 12 bytes per quad

    // - crates
    twgl.setUniformsAndBindTextures(sprites_programinfo, {
        u_origin: [- level_width * tilemap_tilesize / gl.canvas.width, level_height * tilemap_tilesize / gl.canvas.height],
        u_basis: [2 * tilemap_tilesize / gl.canvas.width, -2 * tilemap_tilesize / gl.canvas.height],
        u_texture: crate_texture,
    });
    gl.drawElements(gl.TRIANGLES,
        6 * 2, // 2 quads
        gl.UNSIGNED_SHORT, visual_state.crates_sprites[0].buffer_index * 12); // assume crate sprites are contiguous

    loop_id = requestAnimationFrame(update);
}
