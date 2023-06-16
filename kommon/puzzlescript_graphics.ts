import * as twgl from "twgl.js"
import { Vec2, max } from "./math";
import pack from "bin-pack";
import Color from "color";

export class UVRect {
    constructor(
        public left: number,
        public top: number,
        public right: number,
        public bottom: number,
    ) { }
}

// vec2 for position, vec2 for uv -> 4
const VERTEX_SIZE = 4;

export class PuzzleScriptGraphics {
    /** The shader used to render the sprites. */
    program_info: twgl.ProgramInfo;
    /** Sprite names to uvs */
    mapping: Record<string, UVRect>;

    n_queued: number = 0;
    vertices_cpu: Float32Array;
    vertices_gpu: WebGLBuffer;
    buffer_info: twgl.BufferInfo;
    vao_info: twgl.VertexArrayInfo;
    atlas_texture: WebGLTexture;

    origin: Vec2;
    basis: Vec2;

    constructor(
        public gl: WebGL2RenderingContext,
        sprites_data: Record<string, [string[], string]>,
    ) {
        // todo: shader that allows pixelart rotation
        this.program_info = twgl.createProgramInfo(gl, [
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

        const max_n_sprites = 2048;
        console.assert((max_n_sprites * 6) < (1 << 16), "Can't draw that many sprites, change the code to use u32 indices.");

        this.vertices_cpu = new Float32Array(max_n_sprites * VERTEX_SIZE);
        this.vertices_gpu = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_gpu);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices_cpu, gl.DYNAMIC_DRAW);

        const vertex_indices = new Uint16Array(max_n_sprites * 6);
        for (let k = 0; k < max_n_sprites; k += 1) {
            // top left triangle
            vertex_indices[k * 6 + 0] = k * VERTEX_SIZE + 0;
            vertex_indices[k * 6 + 1] = k * VERTEX_SIZE + 1;
            vertex_indices[k * 6 + 2] = k * VERTEX_SIZE + 2;
            // bottom right triangle
            vertex_indices[k * 6 + 3] = k * VERTEX_SIZE + 1;
            vertex_indices[k * 6 + 4] = k * VERTEX_SIZE + 3;
            vertex_indices[k * 6 + 5] = k * VERTEX_SIZE + 2;
        }

        this.buffer_info = twgl.createBufferInfoFromArrays(gl, {
            a_position: {
                buffer: this.vertices_gpu,
                numComponents: 2,
                type: Float32Array,
                offset: 0,
                stride: VERTEX_SIZE * 4,
            },
            a_texcoord: {
                buffer: this.vertices_gpu,
                numComponents: 2,
                type: Float32Array,
                offset: 2 * 4,
                stride: VERTEX_SIZE * 4,
            },
            indices: {
                data: vertex_indices,
                drawType: gl.STATIC_DRAW,
            },
        });

        this.vao_info = twgl.createVertexArrayInfo(gl, this.program_info, this.buffer_info);

        // for now, no margin, let's see how it goes
        let sprites: {
            width: number,
            height: number,
            spr_rows: string[],
            spr_colors: string[],
            spr_name: string,
        }[] = [];
        for (const [spr_name, spr_data] of Object.entries(sprites_data)) {
            let spr_rows = spr_data[1].trim().split("\n").map(x => x.trim());
            sprites.push({
                width: max(spr_rows.map(x => x.length))!,
                height: spr_rows.length,
                spr_rows: spr_rows,
                spr_colors: spr_data[0],
                spr_name: spr_name,
            });
        }
        let pack_result = pack(sprites, { inPlace: true });
        let texture_cpu = new Uint8Array(4 * pack_result.height * pack_result.width);
        this.mapping = {};
        sprites.forEach(spr => {
            // @ts-ignore
            let x = spr.x;
            // @ts-ignore
            let y = spr.y;
            let rgba_colors = spr.spr_colors.map(color_str => {
                if (color_str == "darkbrown") {
                    return [123, 54, 23, 255]; // random lol
                }
                let res = Color(color_str).array()
                res.push(255)
                return res
            });
            this.mapping[spr.spr_name] = new UVRect(x / pack_result.width, y / pack_result.height, (x + spr.width) / pack_result.width, (y + spr.height) / pack_result.height)
            for (let j = 0; j < spr.width; j++) {
                for (let i = 0; i < spr.height; i++) {
                    let char = spr.spr_rows[j].charAt(i);
                    if (char === ".") continue;
                    let pixel_color = rgba_colors[Number(char)];
                    let cur_index = ((x + i) + (y + j) * pack_result.width) * 4;
                    texture_cpu[cur_index + 0] = pixel_color[0];
                    texture_cpu[cur_index + 1] = pixel_color[1];
                    texture_cpu[cur_index + 2] = pixel_color[2];
                    texture_cpu[cur_index + 3] = pixel_color[3];
                }
            }
        })

        this.atlas_texture = twgl.createTexture(gl, {
            src: texture_cpu,
            width: pack_result.width,
            height: pack_result.height,
            format: gl.RGBA,
            mag: gl.NEAREST,
        });

        console.log(this.mapping);
    }

    centerLevel(level_width: number, level_height: number, sprite_size: number) {
        this.origin = new Vec2(- level_width * sprite_size / this.gl.canvas.width, level_height * sprite_size / this.gl.canvas.height);
        this.basis = new Vec2(2 * sprite_size / this.gl.canvas.width, -2 * sprite_size / this.gl.canvas.height);

        // console.log("psg origin: ", this.origin.x, this.origin.y)
        // console.log("psg basis: ", this.basis.x, this.basis.y)
    }

    queue(sprite_name: string, i: number, j: number) {
        this.queueExtra(sprite_name, new Vec2(i, j), Vec2.one);
    }

    queueExtra(sprite_name: string, pos: Vec2, size: Vec2) {
        let base_index = this.n_queued * 4 * VERTEX_SIZE;
        let uv_data = this.mapping[sprite_name];
        if (uv_data === undefined) {
            throw new Error(`cant find sprite name ${sprite_name}`);

        }
        // tl vertex
        this.vertices_cpu[base_index + 0] = pos.x;
        this.vertices_cpu[base_index + 1] = pos.y;
        this.vertices_cpu[base_index + 2] = uv_data.left;
        this.vertices_cpu[base_index + 3] = uv_data.top;

        // tr vertex
        this.vertices_cpu[base_index + 4] = pos.x + size.x;
        this.vertices_cpu[base_index + 5] = pos.y;
        this.vertices_cpu[base_index + 6] = uv_data.right;
        this.vertices_cpu[base_index + 7] = uv_data.top;

        // bl vertex
        this.vertices_cpu[base_index + 8] = pos.x;
        this.vertices_cpu[base_index + 9] = pos.y + size.y;
        this.vertices_cpu[base_index + 10] = uv_data.left;
        this.vertices_cpu[base_index + 11] = uv_data.bottom;

        // br vertex
        this.vertices_cpu[base_index + 12] = pos.x + size.x;
        this.vertices_cpu[base_index + 13] = pos.y + size.y;
        this.vertices_cpu[base_index + 14] = uv_data.right;
        this.vertices_cpu[base_index + 15] = uv_data.bottom;

        this.n_queued += 1;
    }

    draw() {
        let gl = this.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_gpu);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices_cpu, 0, this.n_queued * 4 * VERTEX_SIZE);

        gl.useProgram(this.program_info.program)
        gl.bindVertexArray(this.vao_info.vertexArrayObject!);

        twgl.setUniformsAndBindTextures(this.program_info, {
            u_origin: [this.origin.x, this.origin.y],
            u_basis: [this.basis.x, this.basis.y],
            u_texture: this.atlas_texture,
        });
        gl.drawElements(gl.TRIANGLES, 6 * this.n_queued, gl.UNSIGNED_SHORT, 0);
        this.n_queued = 0;
    }
}