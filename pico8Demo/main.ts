import * as twgl from "twgl.js";
import { Rectangle, Vec2, Vec4, clamp, mod, onBorder, randomInt } from "../kommon/math";
import { Patch, clientSize, initFromSelector, patchFromUrl } from "../kommon/kanvas";
import { DefaultDict, fromCount, objectMap, zip } from "../kommon/kommon";
import { Grid2D } from "../kommon/grid2D";

function setPixel(patch: Patch, p: Vec2, col: Vec4) {
    let base_index = 4 * (Math.round(p.x) + Math.round(p.y) * patch.size.x);
    patch.data[base_index + 0] = col.x;
    patch.data[base_index + 1] = col.y;
    patch.data[base_index + 2] = col.z;
    patch.data[base_index + 3] = col.w;
}

function setPixelBoundCheck(patch: Patch, p: Vec2, col: Vec4) {
    if (Vec2.inBounds(p, patch.size)) {
        setPixel(patch, p, col);
    }
}

function getPixel(patch: Patch, p: Vec2): Vec4 {
    let base_index = 4 * (Math.round(p.x) + Math.round(p.y) * patch.size.x);
    return new Vec4(
        patch.data[base_index + 0],
        patch.data[base_index + 1],
        patch.data[base_index + 2],
        patch.data[base_index + 3],
    );
}

function drawCircleOutline(patch: Patch, center: Vec2, radius: number, col: Vec4) {
    let out_pos = new Vec2();
    let drawInEachOctant = function() {
        let drawMirrored = function(delta: Vec2) {
            Vec2.add(center, delta, out_pos);
            setPixelBoundCheck(patch, out_pos, col);    
            Vec2.sub(center, delta, out_pos);
            setPixelBoundCheck(patch, out_pos, col);    
        }

        drawMirrored(cur_delta);
        drawMirrored(new Vec2(cur_delta.y, cur_delta.x));
        drawMirrored(new Vec2(-cur_delta.x, cur_delta.y));
        drawMirrored(new Vec2(-cur_delta.y, cur_delta.x));
    }

    let radius_sq = radius * radius;
    let cur_delta = new Vec2(radius, 0);
    drawInEachOctant();
    let DDA = -2 * cur_delta.x * cur_delta.x + 2 * cur_delta.x - 2 * cur_delta.y * cur_delta.y + 2 * radius_sq - 1;
    while (cur_delta.x >= cur_delta.y) {
        // Naive
        /*
        let A = Vec2.add(cur_delta, new Vec2(-1, 1));
        let B = Vec2.add(cur_delta, new Vec2(0, 1));
        let error_A = Math.abs(Vec2.distSq(A) - radius_sq);
        let error_B = Math.abs(Vec2.distSq(B) - radius_sq);
        if (error_A < error_B) {
            cur_delta = A;
        } else {
            cur_delta = B;
        }
        */
        /*
        // Casey's trick
        cur_delta.y += 1;
        if (-2 * cur_delta.x * cur_delta.x + 2 * cur_delta.x - 2 * cur_delta.y * cur_delta.y + 2 * radius_sq - 1 < 0) {
            cur_delta.x -= 1;
        }
        */
       // Digital Differential Analyzer
       if (DDA < 0) {
           DDA += 4 * cur_delta.x - 4;
           cur_delta.x -= 1;
        }
        cur_delta.y += 1;
        DDA += -2 - 4 * cur_delta.y; // this could also use a DDA approach, to avoid the multiplication by 4
        drawInEachOctant();
    }
}

function drawLine(patch: Patch, a: Vec2, b: Vec2, col: Vec4) {
    Vec2.round(a, a);
    Vec2.round(b, b);

    let dx = Math.abs(b.x - a.x);
    let sx = a.x < b.x ? 1 : -1
    let dy = -Math.abs(b.y - a.y)
    let sy = a.y < b.y ? 1 : -1
    let error = dx + dy

    while (true) {
        setPixel(patch, a, col);
        if (Vec2.equals(a, b)) {
            break;
        }
        let e2 = 2 * error
        if (e2 >= dy) {
            if (a.x === b.x) {
                break;
            }
            error += dy;
            a.x += sx;
        }
        if (e2 <= dx) {
            if (a.y === b.y) {
                break;
            }
            error += dx;
            a.y += sy;
        }
    }
}

function drawFunction(patch: Patch, fn: (pos: Vec2) => Vec4) {
    let pos = new Vec2();
    for (let j = 0; j < patch.size.y; j++) {
        for (let i = 0; i < patch.size.x; i++) {
            Vec2.set(pos, i, j);
            let result = fn(pos);
            setPixel(patch, pos, result);
        }
    }
}

function blit(dst: Patch, src: Patch, pos: Vec2, combine_fn: (dst_color: Vec4, src_color: Vec4) => Vec4) {
    let src_pos = new Vec2();
    let dst_pos = new Vec2();
    for (let j = 0; j < src.size.y; j++) {
        for (let i = 0; i < src.size.x; i++) {
            Vec2.set(src_pos, i, j);
            Vec2.add(pos, src_pos, dst_pos);
            if (!Vec2.inBounds(dst_pos, dst.size)) {
                continue;
            }
            let src_pixel = getPixel(src, src_pos);
            let dst_pixel = getPixel(dst, dst_pos);
            let new_pixel = combine_fn(dst_pixel, src_pixel);
            setPixel(dst, dst_pos, new_pixel);
        }
    }
}

function extract(src: Patch, top_left: Vec2, size: Vec2): Patch {
    let dst = new Patch(size);

    let src_pos = new Vec2();
    let dst_pos = new Vec2();
    for (let j = 0; j < size.y; j++) {
        for (let i = 0; i < size.x; i++) {
            Vec2.set(dst_pos, i, j);
            Vec2.add(top_left, dst_pos, src_pos);
            let cur_pixel = Vec2.inBounds(src_pos, src.size) ?
                getPixel(src, src_pos) : new Vec4(0, 0, 0, 0);
            setPixel(dst, dst_pos, cur_pixel);
        }
    }
    return dst;
}

function splitSpritesheet(src: Patch, count: Vec2, margin: number = 0): Patch[] {
    let result: Patch[] = [];
    // compute how much space there is left after removing margins
    let usable_space = (margin === 0) ? src.size : Vec2.sub(src.size, Vec2.scale(Vec2.add(count, Vec2.one), margin));
    let spr_size = Vec2.div(usable_space, count);
    if (!Number.isInteger(spr_size.x) || !Number.isInteger(spr_size.y)) {
        throw new Error(`Can't extract ${count} sprites from a texture of size ${src.size} and a margin between sprites of ${margin}; each sprite would have a non-fractional size of ${spr_size}`);
    }
    let cur_top_left = new Vec2(margin, margin);
    for (let sj = 0; sj < count.y; sj++) {
        for (let si = 0; si < count.x; si++) {
            result.push(extract(src, cur_top_left, spr_size));
            cur_top_left.x += spr_size.x + margin;
        }
        cur_top_left.x = margin;
        cur_top_left.y += spr_size.y + margin;
    }
    return result;
}

const alphaMask = (dst: Vec4, src: Vec4) => src.w === 0 ? dst : src;

async function main() {
    let screen = new Patch(new Vec2(128, 128));
    let cursor_sprite = await patchFromUrl((new URL('cursor.png', import.meta.url)).toString());
    let pastries_atlas = await patchFromUrl((new URL('pastries.png', import.meta.url)).toString());
    let font_atlas = await patchFromUrl((new URL('font_pico8.png', import.meta.url)).toString());
    let _font_sprites = splitSpritesheet(font_atlas, new Vec2(16, 4), 1);
    let _font_letters = `ABCDEFGHIJKLMNOPQRSTUVWXYZ()[]{}0123456789+-*/.,:;<>=?"#$%&!@^_~`;
    let font_sprites: Record<string, Patch> = Object.fromEntries(zip(_font_letters, _font_sprites));

    let font_outline_sprites = objectMap(font_sprites, char_spr => {
        let result = new Patch(Vec2.add(char_spr.size, new Vec2(2, 2)));
        const neighs = [new Vec2(-1, -1), new Vec2(0, -1), new Vec2(1, -1), new Vec2(-1, 0), new Vec2(1, 0), new Vec2(-1, 1), new Vec2(0, 1), new Vec2(1, 1)];
        let neigh_pos = new Vec2();
        drawFunction(result, pos => {
            let any_neigh = neighs.some(delta => {
                Vec2.add(pos, delta, neigh_pos);
                Vec2.sub(neigh_pos, Vec2.one, neigh_pos);
                if (Vec2.inBounds(neigh_pos, char_spr.size)) {
                    return getPixel(char_spr, neigh_pos).w > 0;
                } else {
                    return false;
                }
            });
            return any_neigh ? Vec4.one : Vec4.zero;
        });
        return result;
    })

    function printLine(text: string, top_left: Vec2, color: Vec4) {
        let cur_top_left = Vec2.copy(top_left);
        for (let char of text) {
            if (char !== ' ') {
                if (!(char in font_sprites)) {
                    throw new Error(`char ${char} not avaliable on atlas`);
                }
                blit(screen, font_sprites[char], cur_top_left, alphaMask);
            }
            cur_top_left.x += 4;
        }
    }

    function printLineOutlined(text: string, top_left: Vec2, text_color: Vec4, outline_color: Vec4) {
        let cur_top_left = Vec2.sub(top_left, new Vec2(1, 1));
        for (let char of text) {
            if (char !== ' ') {
                if (!(char in font_sprites)) {
                    throw new Error(`char ${char} not avaliable on atlas`);
                }
                blit(screen, font_outline_sprites[char], cur_top_left, alphaMask);
                // draw here or at the end?
                // blit(screen, font_sprites[char], Vec2.add(cur_top_left, new Vec2(1, 1)), (dst_color, src_color) => src_color.w === 0 ? dst_color : text_color);
            }
            cur_top_left.x += 4;
        }
        printLine(text, top_left, text_color);
    }


    let pastries = splitSpritesheet(pastries_atlas, new Vec2(8, 2));
    let sprite = pastries[2];
    // let sprite = extract(pastries_atlas, new Vec2(0, 0), new Vec2(16, 16));

    // init
    const gl = initFromSelector("#c");
    gl.canvas.width = screen.size.x;
    gl.canvas.height = screen.size.y;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    let screen_texture = twgl.createTexture(gl, {
        mag: gl.NEAREST,
        min: gl.LINEAR,
        format: gl.RGBA,
        width: screen.size.x,
        height: screen.size.y,
        type: gl.UNSIGNED_BYTE,
        src: screen.data,
    });

    // draw a texture
    const program_info = twgl.createProgramInfo(gl, [
        // vs
        `#version 300 es

    in vec2 a_pos;
    in vec2 a_uv;

    out vec2 v_uv;

    void main() {
        v_uv = a_uv;
        gl_Position = vec4(a_pos, 0.0, 1.0);
    }
    `,
        // fs
        `#version 300 es
    precision highp float;

    in vec2 v_uv;
    
    uniform sampler2D u_tex;

    out vec4 out_color;
    void main() {
        out_color = texture(u_tex, v_uv);
    }
    `
    ]);

    // single full screen quad 
    const buffer_info = twgl.createBufferInfoFromArrays(gl, {
        a_pos: {
            data: [
                // tri 1, top left
                -1.0, -1.0,
                1.0, 1.0,
                -1.0, 1.0,
                // tri 2, bot right
                -1.0, -1.0,
                1.0, -1.0,
                1.0, 1.0,
            ],
            numComponents: 2,
            // stride, offset, etc. if needed
        },
        a_uv: {
            data: [
                // tri 1, top left
                0.0, 1.0,
                1.0, 0.0,
                0.0, 0.0,
                // tri 2, bot right
                0.0, 1.0,
                1.0, 1.0,
                1.0, 0.0,
            ],
            numComponents: 2,
            // stride, offset, etc. if needed
        },
    });
    const vao_info = twgl.createVertexArrayInfo(gl, program_info, buffer_info);

    let mouse_state = {
        cur_pos: new Vec2(0, 0),
    };

    window.addEventListener("mousemove", ev => {
        Vec2.set(mouse_state.cur_pos, ev.clientX, ev.clientY);
        Vec2.div(mouse_state.cur_pos, clientSize(gl), mouse_state.cur_pos);
        Vec2.mul(mouse_state.cur_pos, screen.size, mouse_state.cur_pos);
        Vec2.map1(mouse_state.cur_pos, x => Math.floor(x), mouse_state.cur_pos);
        Vec2.map2(mouse_state.cur_pos, screen.size, (m, s) => clamp(m, 0, s - 1), mouse_state.cur_pos);
    });

    type KeyState = {
        cur_pressed: boolean,
        prev_pressed: boolean,
    };
    let keyboard_state = new DefaultDict<KeyState>(() => { return { cur_pressed: false, prev_pressed: false } });
    window.addEventListener("keydown", ev => {
        keyboard_state[ev.code].cur_pressed = true;
    });
    window.addEventListener("keyup", ev => {
        keyboard_state[ev.code].cur_pressed = false;
    });
    function update_keyboard_state() {
        for (const k in keyboard_state) {
            keyboard_state[k].prev_pressed = keyboard_state[k].cur_pressed;
        }
    }

    function keyJustPressed(key: string) {
        return keyboard_state[key].cur_pressed && !keyboard_state[key].prev_pressed;
    }
    // function inputAxis(neg_keys: string[], pos_keys: string[]) {
    //     let result = 0;
    //     if (neg_keys.some(k => keyJustPressed(k))) result -= 1;
    //     if (pos_keys.some(k => keyJustPressed(k))) result += 1;
    //     return result;
    // }
    function genericAxis(neg: boolean, pos: boolean): -1 | 0 | 1 {
        return neg ? (pos ? 0 : -1) : (pos ? 1 : 0);
    }
    function stepMovementInput(): Vec2 {
        return new Vec2(
            genericAxis(["ArrowLeft", "KeyA"].some(keyJustPressed), ["ArrowRight", "KeyD"].some(keyJustPressed)),
            genericAxis(["ArrowUp", "KeyW"].some(keyJustPressed), ["ArrowDown", "KeyS"].some(keyJustPressed))
        )
    }

    const BOARD_SIZE = new Vec2(4, 4);
    const N_PASTRIES = 4;
    let board_state = Grid2D.initV(BOARD_SIZE, p => randomInt(0, N_PASTRIES));
    let cursor_tile = new Vec2(0, 0);

    const TILE_SIZE = new Vec2(18, 16);
    let tile_background = new Patch(TILE_SIZE);
    drawFunction(tile_background, pos => {
        if (Vec2.onBorder(pos, TILE_SIZE)) {
            return Vec4.zero;
        } else {
            // on a corner of the inner rect?
            if (onBorder(pos.x, 1, TILE_SIZE.x - 1) && onBorder(pos.y, 1, TILE_SIZE.y - 1)) {
                return Vec4.zero;
            } else {
                return Vec4.fromHex("#C2C3C7");
            }
        }
    });

    let last_time = 0;
    function update(cur_time) {
        // stats.update();
        gl.clear(gl.COLOR_BUFFER_BIT);

        // game logic
        Vec2.add(cursor_tile, stepMovementInput(), cursor_tile);
        Vec2.map2(cursor_tile, BOARD_SIZE, (v, s) => clamp(v, 0, s - 1), cursor_tile);

        // visuals
        drawFunction(screen, pos => {
            let c = (pos.x ^ pos.y) % 256;
            return new Vec4(c, c, c, 255);
        });        
        drawLine(screen, new Vec2(64, 64), mouse_state.cur_pos, new Vec4(255, 0, 0, 255));
        let text = "HELLO WORLD!";
        printLineOutlined(text, new Vec2(Math.sin(cur_time * .005) * 30 + 64 - text.length * 2, 22), new Vec4(255, 128, 255, 255), new Vec4(128, 0, 128, 255));
        // printLineOutlined(text, new Vec2(Math.sin(cur_time) + 64 - , 64), new Vec4(255, 128, 255, 255), new Vec4(128, 0, 128, 255));

        let tiles_top_left = Rectangle.fromParams({ center: new Vec2(64, 64), size: Vec2.mul(BOARD_SIZE, TILE_SIZE) }).topLeft;
        board_state.forEachV((index: Vec2, pastry: number) => {
            let tile_top_left = Vec2.add(tiles_top_left, Vec2.mul(index, TILE_SIZE));
            let selected = Vec2.equals(index, cursor_tile);
            if (!selected) {
                blit(screen, tile_background, tile_top_left, alphaMask);
                let color_shadow = Vec4.fromHex("#83769C");
                blit(screen, pastries[pastry], Vec2.add(tile_top_left, new Vec2(1, 0)), (dst, src) => src.w > 0 ? color_shadow : dst);
                blit(screen, pastries[pastry], Vec2.add(tile_top_left, new Vec2(1, -1)), alphaMask);
            } else {
                let color_tilebg_active = Vec4.fromHex("#FF77A8");
                blit(screen, tile_background, tile_top_left, (dst, src) => src.w > 0 ? color_tilebg_active : dst);
                let color_shadow_active = Vec4.fromHex("#FF004D");
                blit(screen, pastries[pastry], Vec2.add(tile_top_left, new Vec2(1, 0)), (dst, src) => src.w > 0 ? color_shadow_active : dst);
                blit(screen, pastries[pastry], Vec2.add(tile_top_left, new Vec2(1, Math.sin(cur_time * .01) - 2)), alphaMask);
            }
        });
        let cursor_pos = Vec2.add(tiles_top_left, Vec2.mul(cursor_tile, TILE_SIZE));
        Vec2.add(cursor_pos, new Vec2(14, 12), cursor_pos);
        if (mod(cur_time, 800) > 650) {
            Vec2.sub(cursor_pos, Vec2.one, cursor_pos);
        }
        blit(screen, cursor_sprite, cursor_pos, alphaMask);
        drawCircleOutline(screen, mouse_state.cur_pos, 8, new Vec4(0, 255, 0, 255));
        // drawCircleOutline(screen, mouse_state.cur_pos, Math.round(15 + Math.sin(cur_time * .003) * 8), new Vec4(0, 255, 0, 255));

        twgl.setTextureFromArray(gl, screen_texture, screen.data);
        gl.useProgram(program_info.program);
        // Set the VAO (single gl call)
        twgl.setBuffersAndAttributes(gl, program_info, vao_info);
        twgl.setUniformsAndBindTextures(program_info, {
            u_tex: screen_texture,
        });
        twgl.drawBufferInfo(gl, buffer_info);

        update_keyboard_state();
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);

}

main();