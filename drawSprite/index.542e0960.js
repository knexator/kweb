!function(){function e(e,r,t,o){Object.defineProperty(e,r,{get:t,set:o,enumerable:!0,configurable:!0})}var r="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},o={},n=r.parcelRequire94c2;null==n&&((n=function(e){if(e in t)return t[e].exports;if(e in o){var r=o[e];delete o[e];var n={id:e,exports:{}};return t[e]=n,r.call(n.exports,n,n.exports),n.exports}var i=Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,r){o[e]=r},r.parcelRequire94c2=n),n.register("iE7OH",function(r,t){"use strict";e(r.exports,"register",function(){return o},function(e){return o=e}),e(r.exports,"resolve",function(){return n},function(e){return n=e});var o,n,i={};o=function(e){for(var r=Object.keys(e),t=0;t<r.length;t++)i[r[t]]=e[r[t]]},n=function(e){var r=i[e];if(null==r)throw Error("Could not resolve bundle with id "+e);return r}}),n.register("aNJCr",function(r,t){e(r.exports,"getBundleURL",function(){return o},function(e){return o=e});"use strict";var o,n={};o=function(e){var r=n[e];return r||(r=function(){try{throw Error()}catch(r){var e=(""+r.stack).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^)\n]+/g);if(e)return(""+e[2]).replace(/^((?:https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/.+)\/[^/]+$/,"$1")+"/"}return"/"}(),n[e]=r),r}}),n("iE7OH").register(JSON.parse('{"6NAsU":"index.542e0960.js","bUqvR":"sprite.c1d1c491.png","jAELV":"index.482400a9.js"}'));var i=n("6MzNI");let s=document.querySelector("#c");s.width=1,s.height=1;let u=s.getContext("webgl2");u.clearColor(.5,.5,.75,1);let a=i.createProgramInfo(u,[`#version 300 es
    
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
        `]),c=i.createBufferInfoFromArrays(u,{a_vertex:{data:[1,1,0,1,1,0,0,0,1,0,0,1],numComponents:2}});var f={};f=n("aNJCr").getBundleURL("6NAsU")+"../"+n("iE7OH").resolve("bUqvR");let l=i.createTextures(u,{sprite_1:{src:new URL(f).toString()}}),p=123,v=234,d=0;requestAnimationFrame(function e(r){var t,o,n;i.resizeCanvasToDisplaySize(s)&&(u.viewport(0,0,u.drawingBufferWidth,u.drawingBufferHeight),i.setUniforms(a,{u_resolution:[u.canvas.width,u.canvas.height]}));let f=r-d;d=r,p=(p+f)%u.canvas.width,v=(v+f)%u.canvas.height,u.clear(u.COLOR_BUFFER_BIT),t=l.sprite_1,o=p,n=v,u.useProgram(a.program),i.setBuffersAndAttributes(u,a,c),i.setUniforms(a,{u_texture:t,u_resolution:[u.canvas.width,u.canvas.height],u_size:[200,200],u_position:[o,n]}),i.drawBufferInfo(u,c),requestAnimationFrame(e)})}();
//# sourceMappingURL=index.542e0960.js.map
