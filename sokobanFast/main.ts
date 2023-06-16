import * as twgl from "twgl.js"
import { Vec2, clamp } from "../kommon/math";
import { PuzzleScriptGraphics, UVRect } from "../kommon/puzzlescript_graphics";

// Sokoban, in "exploratory style" / "Lisp style":
// abstract soon-ish, bytes don't exist, reuse, iterate fast

// for now, this only means using puzzlescript renderer

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

const PSG = new PuzzleScriptGraphics(gl, {
    Floor: [["lightgreen", "green"],
        `
      11111
      01111
      11101
      11111
      10111
    `],
    Wall: [["brown", "darkbrown"],
        `
      00010
      11111
      01000
      11111
      00010
    `],
    Player: [["black", "orange", "white", "blue"],
        `
      .000.
      .111.
      22222
      .333.
      .3.3.
    `],
    Crate: [["orange"],
        `
      00000
      0...0
      0...0
      0...0
      00000
    `],
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

const tilemap_tilesize = 64;

let level_floors = level_rows.map(r => r.split('').map(c => c != '#' && c != '!')).flat()

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
    let sprite: Sprite = {
        buffer_index: 0,
        position: pos,
        size: size,
        uv_pos: uv_pos,
        uv_size: uv_size,
    }
    return sprite;
}

function setSpriteCenter(sprite: Sprite, center: Vec2) {
    Vec2.sub(center, Vec2.scale(sprite.size, .5), sprite.position);
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

    PSG.centerLevel(level_width, level_height, tilemap_tilesize);

    // walls & floors
    for (let j = 0; j < level_height; j++) {
        for (let i = 0; i < level_width; i++) {
            if (level_floors[i + j * level_width]) {
                PSG.queue("Floor", i, j);
            } else if (level_walls[i + j * level_width]) {
                PSG.queue("Wall", i, j);
            }
        }
    }

    // moving stuff:
    PSG.queueExtra("Player", visual_state.player_sprite.position, visual_state.player_sprite.size);
    visual_state.crates_sprites.forEach(spr => {
        PSG.queueExtra("Crate", spr.position, spr.size);
    })

    PSG.draw();

    loop_id = requestAnimationFrame(update);
}
