function e(e,r,t,o){Object.defineProperty(e,r,{get:t,set:o,enumerable:!0,configurable:!0})}var r="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},o={},i=r.parcelRequire94c2;null==i&&((i=function(e){if(e in t)return t[e].exports;if(e in o){var r=o[e];delete o[e];var i={id:e,exports:{}};return t[e]=i,r.call(i.exports,i,i.exports),i.exports}var n=Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}).register=function(e,r){o[e]=r},r.parcelRequire94c2=i),i.register("kyEFX",function(r,t){"use strict";e(r.exports,"register",function(){return o},function(e){return o=e}),e(r.exports,"resolve",function(){return i},function(e){return i=e});var o,i,n={};o=function(e){for(var r=Object.keys(e),t=0;t<r.length;t++)n[r[t]]=e[r[t]]},i=function(e){var r=n[e];if(null==r)throw Error("Could not resolve bundle with id "+e);return r}}),i("kyEFX").register(JSON.parse('{"8k7rn":"index.53cfa28c.js","lKBZw":"sprite.c1d1c491.png","4dT7S":"index.b3ee02c2.js"}'));var n=i("amYBK");const s=document.querySelector("#c");s.width=1,s.height=1;const u=s.getContext("webgl2");u.clearColor(.5,.5,.75,1);const a=n.createProgramInfo(u,[`#version 300 es
    
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
        `,`#version 300 es
        precision highp float;
    
        in vec2 v_texcoord;
    
        uniform sampler2D u_texture;
        
        out vec4 out_color;
    
        void main() {
            out_color = texture(u_texture, v_texcoord);
        }
        `]),c=n.createBufferInfoFromArrays(u,{a_vertex:{data:[1,1,0,1,1,0,0,0,1,0,0,1],numComponents:2}});var f={};f=new URL("../"+i("kyEFX").resolve("lKBZw"),import.meta.url).toString();const l=n.createTextures(u,{sprite_1:{src:new URL(f).toString()}});let d=123,p=234,v=0;requestAnimationFrame(function e(r){var t,o,i;n.resizeCanvasToDisplaySize(s)&&(u.viewport(0,0,u.drawingBufferWidth,u.drawingBufferHeight),n.setUniforms(a,{u_resolution:[u.canvas.width,u.canvas.height]}));let f=r-v;v=r,d=(d+f)%u.canvas.width,p=(p+f)%u.canvas.height,u.clear(u.COLOR_BUFFER_BIT),t=l.sprite_1,o=d,i=p,u.useProgram(a.program),n.setBuffersAndAttributes(u,a,c),n.setUniforms(a,{u_texture:t,u_resolution:[u.canvas.width,u.canvas.height],u_size:[200,200],u_position:[o,i]}),n.drawBufferInfo(u,c),requestAnimationFrame(e)});
//# sourceMappingURL=index.53cfa28c.js.map
