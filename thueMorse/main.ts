import * as twgl from "twgl.js";
import { lerp } from "../kommon/math";

const canvas = document.querySelector("#c") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

let loop_id = requestAnimationFrame(update);
document.addEventListener("keydown", onKeyDown);
// document.addEventListener("keyup", onKeyUp);
document.addEventListener("click", onClick);

function onKeyDown(ev: KeyboardEvent) {
    switch (ev.code) {
        case "KeyA":
            onInput(true);
            break;
        case "KeyD":
            onInput(false);
            break;
        default:
            break;
    }
}

function onClick(ev: MouseEvent) {
    console.log(ev);
    onInput(ev.pageX < window.innerWidth / 2);
}

let cur_turn = 0;
let prev_player_address = [0];
let player_address = [0];
let anim_turn = false;
/** between 0 & 1 */
let anim_t = 0.0;
const anim_duration = .3;

// starts as true;
function thueMorse(n: number) {
    let res = true;
    while (n > 0) {
        if (n % 2 == 1) {
            res = !res;
        }
        n = n >> 1;
    }
    return res;
}

function depth(n: number) {
    let res = 0;
    let cur_at_depth = 4;
    n -= cur_at_depth;
    while (n > 0) {
        res += 1;
        cur_at_depth *= 4;
        n -= cur_at_depth;
    }
    return res;
}

function nextAdress(address: number[]) {
    if (address.every(d => d == 3)) {
        let result = Array(address.length + 1).fill(0);
        result[0] = 1;
        return result;
    }
    let result = address.slice();
    for (let k = result.length - 1; k >= 0; k--) {
        if (result[k] !== 3) {
            result[k] += 1;
            return result;
        }
        result[k] = 0;
    }
    throw new Error("???");
}

function onInput(is_left: boolean) {
    anim_t = 0;
    if (is_left == thueMorse(cur_turn)) {
        cur_turn += 1;
        anim_turn = player_address.every(d => d == 3);
        prev_player_address = player_address.slice();
        player_address = nextAdress(player_address);
        console.log("prev: ", prev_player_address)
        console.log("cur: ", player_address)
    } else {
        // lost!
        alert("lost!")
        cur_turn = 0;
        anim_turn = false;
        player_address = [0];
    }
}

function getVisiting(address: number[], player?: number[]): 0 | 1 | 2 {
    player = player || player_address;
    for (let k = 0; k < Math.min(address.length, player.length); k++) {
        if (address[k] < player[k]) {
            return 0;
        } else if (address[k] > player[k]) {
            return 2;
        }
    }
    return 1;
}

const colors_asdf = ["#5FAD67", "#A9F05F", "#5889A2"];
// visiting: "past" | "present" | "future"
function drawTiles(x: number, y: number, w: number, h: number, address: number[], flip: boolean) {
    if (address.length < player_address.length) {
        // still bigger than the player, recurse more
        let x1 = x;
        let x2 = x + w / 2;
        if (flip) {
            x1 = x + w / 2;
            x2 = x;
        }

        drawTiles(x1, y, w / 2, h / 4, address.concat([0]), flip);
        drawTiles(x2, y + h / 4, w / 2, h / 4, address.concat([1]), !flip);
        drawTiles(x2, y + h / 2, w / 2, h / 4, address.concat([2]), !flip);
        drawTiles(x1, y + h * .75, w / 2, h / 4, address.concat([3]), flip);
    } else {
        // plain quad
        let visiting = getVisiting(address);
        ctx.fillStyle = colors_asdf[visiting];
        ctx.fillRect(x, y, w, h);
    }
}

const colors_v2_left = ["red", "pink", "darkred"];
const colors_v2_right = ["green", "lime", "darkgreen"];
function drawTilesV2(x: number, y: number, w: number, h: number, address: number[], flip: boolean) {
    if (address.length < player_address.length) {
        // still bigger than the player, recurse more
        let x1 = x;
        let x2 = x + w / 2;
        let y1 = y;
        let y2 = y + h / 2;

        drawTilesV2(x1, y1, w / 2, h / 2, address.concat([0]), flip);
        drawTilesV2(x2, y1, w / 2, h / 2, address.concat([1]), !flip);
        drawTilesV2(x1, y2, w / 2, h / 2, address.concat([2]), !flip);
        drawTilesV2(x2, y2, w / 2, h / 2, address.concat([3]), flip);

        if (getVisiting(address) == 0) {
            // fully in the past
            let colors = flip ? colors_v2_left : colors_v2_right
            ctx.fillStyle = colors[1];
            let border = w / 8;
            if (
                player_address[player_address.length - 1] == 0 // has player changed square?
                && (!anim_turn ?
                    getVisiting(address, prev_player_address) == 1 : // did we just visit this square?
                    getVisiting(address, [0].concat(prev_player_address)) == 1)) // special case: if zooming, fake the address
            {
                border *= anim_t;
            }
            thickBorder(x, y, w, h, border);
        }
    } else {
        // plain quad
        let colors = flip ? colors_v2_left : colors_v2_right

        let visiting = getVisiting(address);
        if (visiting == 0) {
            ctx.fillStyle = colors[0];
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = colors[1];
            thickBorder(x, y, w, h, w / 8);
        }
        if (visiting == 1) {
            ctx.fillStyle = colors[1];
            thickBorder(x, y, w, h, w / 8);
        }
    }
}


function drawTilesV3(x: number, y: number, w: number, h: number, address: number[], flip: boolean) {
    if (address.length < player_address.length) {
        // still bigger than the player, recurse more
        let x1 = x;
        let x2 = x + w / 2;
        let y1 = y;
        let y2 = y + h / 2;

        if (flip) {
            x1 = x + w / 2;
            x2 = x;
        }

        drawTilesV3(x1, y1, w / 2, h / 2, address.concat([0]), flip);
        drawTilesV3(x2, y1, w / 2, h / 2, address.concat([1]), !flip);
        drawTilesV3(x2, y2, w / 2, h / 2, address.concat([2]), !flip);
        drawTilesV3(x1, y2, w / 2, h / 2, address.concat([3]), flip);

        if (getVisiting(address) == 0) {
            // fully in the past
            let colors = flip ? colors_v2_left : colors_v2_right
            ctx.fillStyle = colors[1];
            let border = w / 8;
            if (
                player_address[player_address.length - 1] == 0 // has player changed square?
                && (!anim_turn ?
                    getVisiting(address, prev_player_address) == 1 : // did we just visit this square?
                    getVisiting(address, [0].concat(prev_player_address)) == 1)) // special case: if zooming, fake the address
            {
                border *= anim_t;
            }
            thickBorder(x, y, w, h, border);
        }
    } else {
        // plain quad
        let colors = flip ? colors_v2_left : colors_v2_right

        let visiting = getVisiting(address);
        if (visiting == 0) {
            ctx.fillStyle = colors[0];
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = colors[1];
            thickBorder(x, y, w, h, w / 8);
        }
        if (visiting == 1) {
            ctx.fillStyle = colors[1];
            thickBorder(x, y, w, h, w / 8);
        }
    }
}

function thickBorder(x: number, y: number, w: number, h: number, border: number) {
    ctx.fillRect(x, y, w, border);
    ctx.fillRect(x, y + h - border, w, border);
    ctx.fillRect(x, y, border, h);
    ctx.fillRect(x + w - border, y, border, h);
}

let time_last = 0;
function update(time_cur: number) {
    twgl.resizeCanvasToDisplaySize(canvas);

    let delta = (time_cur - time_last) * 0.001;
    time_last = time_cur;

    ctx.fillStyle = "#4E5E5E";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    anim_t += delta / anim_duration;
    anim_t = Math.min(1.0, anim_t);

    let x = 0;
    let y = 0;
    let w = canvas.width;
    let h = canvas.height;

    if (anim_turn) {
        w = lerp(w * 2, w, anim_t);
        // h = lerp(h * 4, h, anim_t); // style 1: vertical
        h = lerp(h * 2, h, anim_t); // style 2: squares
    }

    // drawTiles(x, y, w, h, [], false);
    // drawTilesV2(x, y, w, h, [], false);
    drawTilesV3(x, y, w, h, [], false);

    // cheat
    // while (cur_turn < 1023) {
    //     onInput(thueMorse(cur_turn));
    // }

    loop_id = requestAnimationFrame(update);
}
