// knexator's canvas

import * as twgl from "twgl.js";
import { Vec2 } from "./math";

export function initFromSelector(canvas_selector: string): WebGL2RenderingContext {
    const canvas = document.querySelector(canvas_selector)! as HTMLCanvasElement;

    // Assumption 1: the canvas itself is always opaque.
    const gl = canvas.getContext("webgl2", { alpha: false })!;

    // Assumption 2: shader output isn't premultiplied 
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Assumption 3: use this default background color
    gl.clearColor(0.5, 0.5, 0.75, 1.0);

    // Assumption 4: canvas inner size is the same as display size
    twgl.resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    return gl;
}

export function clientSize(gl: WebGL2RenderingContext): Vec2 {
    let canvas = gl.canvas as HTMLCanvasElement;
    return new Vec2(canvas.clientWidth, canvas.clientHeight);
}


export class Patch {
    data: Uint8ClampedArray
    constructor(
        public size: Vec2,
        data?: Uint8ClampedArray,
    ) {
        if (data === undefined) {
            this.data = new Uint8ClampedArray(size.x * size.y * 4);
        } else {
            this.data = data;
        }
    }
}

// from https://www.fabiofranchino.com/log/load-an-image-with-javascript-using-await/
export function imageFromUrl(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // to avoid CORS if used with Canvas
        img.src = url
        img.onload = () => {
            resolve(img);
        }
        img.onerror = e => {
            reject(e);
        }
    })
}

export function canvasFromImage(img: HTMLImageElement): CanvasRenderingContext2D {
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    return ctx;
}

export function patchFromCanvas(ctx: CanvasRenderingContext2D): Patch {
    let data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;
    return new Patch(new Vec2(ctx.canvas.width, ctx.canvas.height), data);
}

export async function patchFromUrl(url: string): Promise<Patch> {
    return patchFromCanvas(canvasFromImage(await imageFromUrl(url)));
}
