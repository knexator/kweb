function e(e,t,r,n){Object.defineProperty(e,t,{get:r,set:n,enumerable:!0,configurable:!0})}function t(e){return e&&e.__esModule?e.default:e}var r="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},o={},s=r.parcelRequire94c2;null==s&&((s=function(e){if(e in n)return n[e].exports;if(e in o){var t=o[e];delete o[e];var r={id:e,exports:{}};return n[e]=r,t.call(r.exports,r,r.exports),r.exports}var s=Error("Cannot find module '"+e+"'");throw s.code="MODULE_NOT_FOUND",s}).register=function(e,t){o[e]=t},r.parcelRequire94c2=s),s.register("kyEFX",function(t,r){"use strict";e(t.exports,"register",function(){return n},function(e){return n=e}),e(t.exports,"resolve",function(){return o},function(e){return o=e});var n,o,s={};n=function(e){for(var t=Object.keys(e),r=0;r<t.length;r++)s[t[r]]=e[t[r]]},o=function(e){var t=s[e];if(null==t)throw Error("Could not resolve bundle with id "+e);return t}}),s("kyEFX").register(JSON.parse('{"iPudu":"index.14469d99.js","lRZia":"sprite.22ec2077.png","3UC5c":"walls_312.cb79a6c7.png","6pQwl":"floor_312.8cddc3eb.png","6cxlj":"player_puzzlescript.5728a87e.png","aV9ow":"index.c1f757b2.js"}'));var i=s("amYBK"),a={};a="#version 300 es\n#define GLSLIFY 1\n\n// [0, 1]^2\nin vec2 a_vertex;\n\n// pixels for everything\nuniform vec2 u_resolution;\nuniform vec2 u_position;\nuniform vec2 u_size;\n\nout vec2 v_texcoord;\n\nvoid main() {\n    // if size is 100 & screen is 400, then\n    // clip space result width will be .5\n    vec2 pos = 2.0 * a_vertex * u_size / u_resolution;\n\n    // if position is 200 & screen is 400, then\n    // clip space result offset will be .5\n    pos += 2.0 * u_position / u_resolution;\n\n    // pos of 0 should go to the top left\n    pos -= vec2(1, 1);\n\n    // ypos = down\n    pos.y = -pos.y;\n\n    gl_Position = vec4(pos, 0, 1);\n\n    v_texcoord = a_vertex;\n}\n\n// todo: investigate glslify";var u={};u="#version 300 es\nprecision highp float;\n#define GLSLIFY 1\n\nin vec2 v_texcoord;\n\nuniform sampler2D u_texture;\n\nout vec4 out_color;\n\nvoid main() {\n    out_color = texture(u_texture, v_texcoord);\n}";class c{constructor(e=0,t=0){this.x=e,this.y=t}static #e=(()=>{this.zero=new c(0,0)})();static copy(e,t){return(t=t||new c).x=e.x,t.y=e.y,t}static add(e,t,r){return(r=r||new c).x=e.x+t.x,r.y=e.y+t.y,r}static sub(e,t,r){return(r=r||new c).x=e.x-t.x,r.y=e.y-t.y,r}static negate(e,t){return(t=t||new c).x=-e.x,t.y=-e.y,t}static isZero(e){return 0==e.x&&0==e.y}static map2(e,t,r,n){return(n=n||new c).x=r(e.x,t.x),n.y=r(e.y,t.y),n}}const f=document.querySelector("#c").getContext("webgl2",{alpha:!1});f.clearColor(.5,.5,.75,1),f.enable(f.BLEND),f.blendFunc(f.SRC_ALPHA,f.ONE_MINUS_SRC_ALPHA),i.resizeCanvasToDisplaySize(f.canvas),f.viewport(0,0,f.drawingBufferWidth,f.drawingBufferHeight);var d={};d=new URL("../"+s("kyEFX").resolve("lRZia"),import.meta.url).toString();const l=i.createTexture(f,{src:new URL(d).toString()}),p=i.createProgramInfo(f,[t(a),t(u)]),_=i.createBufferInfoFromArrays(f,{a_vertex:{data:[1,1,0,1,1,0,0,0,1,0,0,1],numComponents:2}}),y=i.createVertexArrayInfo(f,p,_),v=i.createProgramInfo(f,[`#version 300 es

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
    `,`#version 300 es
    precision highp float;
    
    in vec2 v_texcoord;

    uniform sampler2D u_sheet;

    out vec4 out_color;

    void main() {
        out_color = texture(u_sheet, v_texcoord);
    }
    `]);var x={};x=new URL("../"+s("kyEFX").resolve("3UC5c"),import.meta.url).toString();const m=i.createTexture(f,{src:new URL(x).toString(),mag:f.NEAREST,wrap:f.REPEAT}),g=`
####!!
#.O#!!
#..###
#@P..#
#..*.#
#..###
####!!
`.trim(),A=g.split("\n").map(e=>e.trim()),h=A.length,w=A[0].length;console.assert(A.every(e=>e.length==w),"Bad ascii level");const b=A.map(e=>e.split("").map(e=>"#"==e)).flat();function R(e,t){return!(e<0)&&!(e>=w)&&!(t<0)&&!(t>=h)&&b[e+t*w]}const F=w+1,E=h+1,S=new Float32Array(4*F*E);for(let e=0;e<E;e++)for(let t=0;t<F;t++){let r=(t+e*F)*4;S[r+0]=t,S[r+1]=e;let n=function(e,t){let r=R(e-0,t-1)?1:0,n=R(e-0,t-0)?2:0,o=R(e-1,t-0)?4:0;return[[0,3],[0,2],[1,3],[1,0],[0,0],[2,3],[3,0],[1,1],[3,3],[1,2],[0,1],[2,2],[3,2],[3,1],[2,0],[2,1]][(R(e-1,t-1)?8:0)+r+o+n]}(t,e);S[r+2]=n[0],S[r+3]=n[1]}const B=f.createBuffer();f.bindBuffer(f.ARRAY_BUFFER,B),f.bufferData(f.ARRAY_BUFFER,S,f.STATIC_DRAW);let T=i.createVertexArrayInfo(f,v,i.createBufferInfoFromArrays(f,{a_position:{buffer:B,type:f.FLOAT,numComponents:2,stride:16,offset:0,divisor:1},a_tileindex:{buffer:B,type:f.FLOAT,numComponents:2,stride:16,offset:8,divisor:1},a_vertex:{data:[1,1,0,1,1,0,0,0,1,0,0,1],numComponents:2}}));var L={};L=new URL("../"+s("kyEFX").resolve("6pQwl"),import.meta.url).toString();const U=i.createTexture(f,{src:new URL(L).toString(),mag:f.NEAREST,wrap:f.REPEAT});let C=A.map(e=>e.split("").map(e=>"#"!=e&&"!"!=e)).flat();const I=new Float32Array(4*w*h);let O=0;for(let e=0;e<h;e++)for(let t=0;t<w;t++)C[t+e*w]&&(I[4*O+0]=t,I[4*O+1]=e,S[4*O+2]=0,S[4*O+3]=0,O+=1);const D=f.createBuffer();f.bindBuffer(f.ARRAY_BUFFER,D),f.bufferData(f.ARRAY_BUFFER,I,f.STATIC_DRAW);let H=i.createVertexArrayInfo(f,v,i.createBufferInfoFromArrays(f,{a_position:{buffer:D,type:f.FLOAT,numComponents:2,stride:16,offset:0,divisor:1},a_tileindex:{buffer:D,type:f.FLOAT,numComponents:2,stride:16,offset:8,divisor:1},a_vertex:{data:[1,1,0,1,1,0,0,0,1,0,0,1],numComponents:2}}));var k=0,P=new Float32Array(128);const N=f.createBuffer();f.bindBuffer(f.ARRAY_BUFFER,N),f.bufferData(f.ARRAY_BUFFER,P,f.DYNAMIC_DRAW);let z=i.createVertexArrayInfo(f,v,i.createBufferInfoFromArrays(f,{a_position:{buffer:N,type:f.FLOAT,numComponents:2,stride:16,offset:0,divisor:1},a_tileindex:{buffer:N,type:f.FLOAT,numComponents:2,stride:16,offset:8,divisor:1},a_vertex:{data:[1,1,0,1,1,0,0,0,1,0,0,1],numComponents:2}}));var Y={};Y=new URL("../"+s("kyEFX").resolve("6cxlj"),import.meta.url).toString();const q=i.createTexture(f,{src:new URL(Y).toString(),mag:f.NEAREST,wrap:f.REPEAT});let j={debug_x:0,debug_y:0,player_pos:new c(2,3)},K={player_offset:new c(0,0)},V=k;k+=1,P[4*V+0]=j.player_pos.x,P[4*V+1]=j.player_pos.y,P[4*V+2]=0,P[4*V+3]=0;let W={pressed:{},queued:[]};requestAnimationFrame(function e(t){let r=(t-M)*.001;if(M=t,i.resizeCanvasToDisplaySize(f.canvas)&&f.viewport(0,0,f.drawingBufferWidth,f.drawingBufferHeight),W.pressed.KeyA&&(j.debug_x-=1),W.pressed.KeyD&&(j.debug_x+=1),W.pressed.KeyW&&(j.debug_y-=1),W.pressed.KeyS&&(j.debug_y+=1),W.queued.length>0&&c.isZero(K.player_offset)){let e=W.queued.shift(),t=new c;switch(e){case"KeyD":t.x=1;break;case"KeyA":t.x=-1;break;case"KeyW":t.y=-1;break;case"KeyS":t.y=1}if(0!=t.x||0!=t.y){let e=c.add(j.player_pos,t);R(e.x,e.y)||(c.copy(e,j.player_pos),c.sub(K.player_offset,t,K.player_offset))}}c.isZero(K.player_offset)||(c.map2(K.player_offset,c.zero,(e,t)=>{var n;return n=r/.05,e>t?Math.max(e-n,t):e<t?Math.min(e+n,t):t},K.player_offset),P[4*V+0]=j.player_pos.x+K.player_offset.x,P[4*V+1]=j.player_pos.y+K.player_offset.y),f.clear(f.COLOR_BUFFER_BIT),f.useProgram(p.program),i.setBuffersAndAttributes(f,p,y),i.setUniforms(p,{u_texture:l,u_resolution:[f.canvas.width,f.canvas.height],u_size:[50,50],u_position:[j.debug_x,j.debug_y]}),i.drawBufferInfo(f,_),f.useProgram(v.program),f.bindVertexArray(T.vertexArrayObject),i.setUniformsAndBindTextures(v,{u_origin:[-(64*F)/f.canvas.width,64*E/f.canvas.height],u_basis:[128/f.canvas.width,-128/f.canvas.height],u_sheet_count:[4,4],u_sheet:m}),f.drawArraysInstanced(f.TRIANGLES,0,6,F*E),f.bindVertexArray(H.vertexArrayObject),i.setUniformsAndBindTextures(v,{u_origin:[-(64*w)/f.canvas.width,64*h/f.canvas.height],u_basis:[128/f.canvas.width,-128/f.canvas.height],u_sheet_count:[1,1],u_sheet:U}),f.drawArraysInstanced(f.TRIANGLES,0,6,O),f.bindBuffer(f.ARRAY_BUFFER,N),f.bufferSubData(f.ARRAY_BUFFER,0,P),f.bindVertexArray(z.vertexArrayObject),i.setUniformsAndBindTextures(v,{u_origin:[-(64*w)/f.canvas.width,64*h/f.canvas.height],u_basis:[128/f.canvas.width,-128/f.canvas.height],u_sheet_count:[1,1],u_sheet:q}),f.drawArraysInstanced(f.TRIANGLES,0,6,k),requestAnimationFrame(e)}),document.addEventListener("keydown",function(e){console.log("keydown"),W.pressed[e.code]=!0,W.queued.push(e.code)}),document.addEventListener("keyup",function(e){console.log("keyup"),W.pressed[e.code]=!1});let M=0;
//# sourceMappingURL=index.14469d99.js.map
