function e(e,t,r,n){Object.defineProperty(e,t,{get:r,set:n,enumerable:!0,configurable:!0})}function t(e){return e&&e.__esModule?e.default:e}var r="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},i={},s=r.parcelRequire94c2;null==s&&((s=function(e){if(e in n)return n[e].exports;if(e in i){var t=i[e];delete i[e];var r={id:e,exports:{}};return n[e]=r,t.call(r.exports,r,r.exports),r.exports}var s=Error("Cannot find module '"+e+"'");throw s.code="MODULE_NOT_FOUND",s}).register=function(e,t){i[e]=t},r.parcelRequire94c2=s),s.register("kyEFX",function(t,r){"use strict";e(t.exports,"register",function(){return n},function(e){return n=e}),e(t.exports,"resolve",function(){return i},function(e){return i=e});var n,i,s={};n=function(e){for(var t=Object.keys(e),r=0;r<t.length;r++)s[t[r]]=e[t[r]]},i=function(e){var t=s[e];if(null==t)throw Error("Could not resolve bundle with id "+e);return t}}),s("kyEFX").register(JSON.parse('{"gi6r7":"index.d232555d.js","5TaR7":"sprite.22ec2077.png","6PWe3":"walls_312.cb79a6c7.png","5Oroq":"floor_312.8cddc3eb.png","gQMdV":"player_puzzlescript.5728a87e.png","8p6MJ":"crate_puzzlescript.92620967.png","bB1AD":"index.9c3702eb.js"}'));var o=s("amYBK");function a(e,t,r){return Math.max(t,Math.min(r,e))}class u{constructor(e=0,t=0,r=0,n=0){this.x=e,this.y=t,this.z=r,this.w=n}static fromHex(e){var t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);if(null===t)throw Error(`can't parse hex: ${e}`);return new u(parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16),255)}static #e=(()=>{this.zero=new u(0,0,0,0)})();static #t=(()=>{this.one=new u(1,1,1,1)})()}class c{constructor(e=0,t=0){this.x=e,this.y=t}toString(){return`Vec2(${this.x}, ${this.y})`}static #e=(()=>{this.tmp=new c(0,0)})();static #t=(()=>{this.tmp1=new c(0,0)})();static #r=(()=>{this.tmp2=new c(0,0)})();static #n=(()=>{this.tmp3=new c(0,0)})();static #i=(()=>{this.zero=new c(0,0)})();static #s=(()=>{this.one=new c(1,1)})();static set(e,t,r){return e.x=t,e.y=r,e}static copy(e,t){return(t=t||new c).x=e.x,t.y=e.y,t}static add(e,t,r){return(r=r||new c).x=e.x+t.x,r.y=e.y+t.y,r}static sub(e,t,r){return(r=r||new c).x=e.x-t.x,r.y=e.y-t.y,r}static mul(e,t,r){return(r=r||new c).x=e.x*t.x,r.y=e.y*t.y,r}static div(e,t,r){return(r=r||new c).x=e.x/t.x,r.y=e.y/t.y,r}static round(e,t){return(t=t||new c).x=Math.round(e.x),t.y=Math.round(e.y),t}static negate(e,t){return(t=t||new c).x=-e.x,t.y=-e.y,t}static scale(e,t,r){return(r=r||new c).x=e.x*t,r.y=e.y*t,r}static lerp(e,t,r,n){return(n=n||new c).x=e.x*(1-r)+t.x*r,n.y=e.y*(1-r)+t.y*r,n}static inBounds(e,t){var r,n,i,s;return r=e.x,n=t.x,r>=0&&r<n&&(i=e.y,s=t.y,i>=0&&i<s)}static onBorder(e,t){var r,n,i,s;return r=e.x,n=t.x,0==r||r+1===n||(i=e.y,s=t.y,0==i||i+1===s)}static isZero(e){return 0===e.x&&0===e.y}static equals(e,t){return e.x===t.x&&e.y===t.y}static map1(e,t,r){return(r=r||new c).x=t(e.x),r.y=t(e.y),r}static map2(e,t,r,n){return(n=n||new c).x=r(e.x,t.x),n.y=r(e.y,t.y),n}static roundToCardinal(e){return Math.abs(e.x)>=Math.abs(e.y)?e.x>=0?"xpos":"xneg":e.y>=0?"ypos":"yneg"}}var d={};d="#version 300 es\n#define GLSLIFY 1\n\n// [0, 1]^2\nin vec2 a_vertex;\n\n// pixels for everything\nuniform vec2 u_resolution;\nuniform vec2 u_position;\nuniform vec2 u_size;\n\nout vec2 v_texcoord;\n\nvoid main() {\n    // if size is 100 & screen is 400, then\n    // clip space result width will be .5\n    vec2 pos = 2.0 * a_vertex * u_size / u_resolution;\n\n    // if position is 200 & screen is 400, then\n    // clip space result offset will be .5\n    pos += 2.0 * u_position / u_resolution;\n\n    // pos of 0 should go to the top left\n    pos -= vec2(1, 1);\n\n    // ypos = down\n    pos.y = -pos.y;\n\n    gl_Position = vec4(pos, 0, 1);\n\n    v_texcoord = a_vertex;\n}\n\n// todo: investigate glslify";var p={};p="#version 300 es\nprecision highp float;\n#define GLSLIFY 1\n\nin vec2 v_texcoord;\n\nuniform sampler2D u_texture;\n\nout vec4 out_color;\n\nvoid main() {\n    out_color = texture(u_texture, v_texcoord);\n}";const _=document.querySelector("#c").getContext("webgl2",{alpha:!1});_.clearColor(.5,.5,.75,1),_.enable(_.BLEND),_.blendFunc(_.SRC_ALPHA,_.ONE_MINUS_SRC_ALPHA),o.resizeCanvasToDisplaySize(_.canvas),_.viewport(0,0,_.drawingBufferWidth,_.drawingBufferHeight);var l={};l=new URL("../"+s("kyEFX").resolve("5TaR7"),import.meta.url).toString();const f=o.createTexture(_,{src:new URL(l).toString()}),x=o.createProgramInfo(_,[t(d),t(p)]),y=o.createBufferInfoFromArrays(_,{a_vertex:{data:[1,1,0,1,1,0,0,0,1,0,0,1],numComponents:2}}),m=o.createVertexArrayInfo(_,x,y),h=o.createProgramInfo(_,[`#version 300 es

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
    `]);var v={};v=new URL("../"+s("kyEFX").resolve("6PWe3"),import.meta.url).toString();const g=o.createTexture(_,{src:new URL(v).toString(),mag:_.NEAREST,wrap:_.REPEAT}),w=`
####!!
#.O#!!
#..###
#@P..#
#..*.#
#..###
####!!
`.trim(),b=w.split("\n").map(e=>e.trim()),A=b.length,R=b[0].length;console.assert(b.every(e=>e.length==R),"Bad ascii level");const E=b.map(e=>e.split("").map(e=>"#"==e)).flat();function T(e,t){return!(e<0)&&!(e>=R)&&!(t<0)&&!(t>=A)&&E[e+t*R]}const F=R+1,S=A+1,B=new Float32Array(4*F*S);for(let e=0;e<S;e++)for(let t=0;t<F;t++){let r=(t+e*F)*4;B[r+0]=t,B[r+1]=e;let n=function(e,t){let r=T(e-0,t-1)?1:0,n=T(e-0,t-0)?2:0,i=T(e-1,t-0)?4:0;return[[0,3],[0,2],[1,3],[1,0],[0,0],[2,3],[3,0],[1,1],[3,3],[1,2],[0,1],[2,2],[3,2],[3,1],[2,0],[2,1]][(T(e-1,t-1)?8:0)+r+i+n]}(t,e);B[r+2]=n[0],B[r+3]=n[1]}const I=_.createBuffer();_.bindBuffer(_.ARRAY_BUFFER,I),_.bufferData(_.ARRAY_BUFFER,B,_.STATIC_DRAW);let z=o.createVertexArrayInfo(_,h,o.createBufferInfoFromArrays(_,{a_position:{buffer:I,type:_.FLOAT,numComponents:2,stride:16,offset:0,divisor:1},a_tileindex:{buffer:I,type:_.FLOAT,numComponents:2,stride:16,offset:8,divisor:1},a_vertex:{data:[1,1,0,1,1,0,0,0,1,0,0,1],numComponents:2}}));var U={};U=new URL("../"+s("kyEFX").resolve("5Oroq"),import.meta.url).toString();const L=o.createTexture(_,{src:new URL(U).toString(),mag:_.NEAREST,wrap:_.REPEAT});let C=b.map(e=>e.split("").map(e=>"#"!=e&&"!"!=e)).flat();const D=new Float32Array(4*R*A);let H=0;for(let e=0;e<A;e++)for(let t=0;t<R;t++)C[t+e*R]&&(D[4*H+0]=t,D[4*H+1]=e,B[4*H+2]=0,B[4*H+3]=0,H+=1);const O=_.createBuffer();_.bindBuffer(_.ARRAY_BUFFER,O),_.bufferData(_.ARRAY_BUFFER,D,_.STATIC_DRAW);let N=o.createVertexArrayInfo(_,h,o.createBufferInfoFromArrays(_,{a_position:{buffer:O,type:_.FLOAT,numComponents:2,stride:16,offset:0,divisor:1},a_tileindex:{buffer:O,type:_.FLOAT,numComponents:2,stride:16,offset:8,divisor:1},a_vertex:{data:[1,1,0,1,1,0,0,0,1,0,0,1],numComponents:2}}));const P=o.createProgramInfo(_,[`#version 300 es

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
    `,`#version 300 es
    precision highp float;
    
    in vec2 v_texcoord;

    uniform sampler2D u_texture;

    out vec4 out_color;

    void main() {
        out_color = texture(u_texture, v_texcoord);
    }
    `]);console.assert(!0,"Can't draw that many sprites, change the code to use u32 indices.");var k=0,q=new Float32Array(64),M=new Float32Array(64);const Y=new Uint16Array(192);for(let e=0;e<32;e+=1)Y[6*e+0]=4*e+0,Y[6*e+1]=4*e+1,Y[6*e+2]=4*e+2,Y[6*e+3]=4*e+1,Y[6*e+4]=4*e+3,Y[6*e+5]=4*e+2;let W=o.createBufferInfoFromArrays(_,{a_position:{data:q,numComponents:2,drawType:_.DYNAMIC_DRAW},a_texcoord:{data:M,numComponents:2,drawType:_.DYNAMIC_DRAW},indices:{data:Y,drawType:_.STATIC_DRAW}});const K=W.attribs.a_position.buffer,V=W.attribs.a_texcoord.buffer,G=o.createVertexArrayInfo(_,P,W);var j={};j=new URL("../"+s("kyEFX").resolve("gQMdV"),import.meta.url).toString();const X=o.createTexture(_,{src:new URL(j).toString(),mag:_.NEAREST,wrap:_.REPEAT});var $={};$=new URL("../"+s("kyEFX").resolve("8p6MJ"),import.meta.url).toString();const J=o.createTexture(_,{src:new URL($).toString(),mag:_.NEAREST,wrap:_.REPEAT});let Q={debug_x:0,debug_y:0,player_pos:new c(2,3),crates_pos:[new c(1,3),new c(3,4)]};class Z{constructor(e,t){this.original_pos=e,this.dir=t}execute(){c.add(this.original_pos,this.dir,Q.player_pos)}animTurn(e){c.add(this.original_pos,c.scale(this.dir,e),en.player_sprite.position),ea(en.player_sprite)}undoAnimTurn(e){this.animTurn(1-e)}undo(){c.copy(this.original_pos,Q.player_pos)}}class ee{constructor(e,t,r){this.crate_index=e,this.original_pos=t,this.dir=r,this.extra_command=new Z(c.sub(t,r),r)}execute(){c.add(this.original_pos,this.dir,Q.crates_pos[this.crate_index]),this.extra_command.execute()}animTurn(e){c.add(this.original_pos,c.scale(this.dir,e),en.crates_sprites[this.crate_index].position),ea(en.crates_sprites[this.crate_index]),this.extra_command.animTurn(e)}undoAnimTurn(e){var t;this.extra_command.animTurn(1-e);let r=c.add(this.original_pos,new c(.5,.5));e<.5?(c.scale(c.one,1-2*e,en.crates_sprites[this.crate_index].size),c.add(r,this.dir,r)):(c.scale(c.one,2*e-1,en.crates_sprites[this.crate_index].size),c.copy(this.original_pos,en.crates_sprites[this.crate_index].position)),t=en.crates_sprites[this.crate_index],c.sub(r,c.scale(t.size,.5),t.position),ea(en.crates_sprites[this.crate_index])}undo(){c.copy(this.original_pos,Q.crates_pos[this.crate_index]),this.extra_command.undo()}}class et{constructor(e,t){this.pos=e,this.dir=t}execute(){throw Error("not an executable command")}animTurn(e){c.add(this.pos,c.scale(this.dir,e*(1-e)),en.player_sprite.position),ea(en.player_sprite)}undoAnimTurn(e){throw Error("not an undoable command")}undo(){throw Error("not an undoable command")}}let er=[],en={turn_time:0,player_sprite:eo(c.copy(Q.player_pos),c.copy(c.one),c.copy(c.zero),c.copy(c.one)),crates_sprites:Q.crates_pos.map(e=>eo(c.copy(e),c.copy(c.one),c.copy(c.zero),c.copy(c.one)))},ei=null,es=null;function eo(e,t,r,n){let i=k;k+=1;let s={buffer_index:i,position:e,size:t,uv_pos:r,uv_size:n};return ea(s),M[8*s.buffer_index+0]=s.uv_pos.x,M[8*s.buffer_index+1]=s.uv_pos.y,M[8*s.buffer_index+2]=s.uv_pos.x+s.uv_size.x,M[8*s.buffer_index+3]=s.uv_pos.y,M[8*s.buffer_index+4]=s.uv_pos.x,M[8*s.buffer_index+5]=s.uv_pos.y+s.uv_size.x,M[8*s.buffer_index+6]=s.uv_pos.x+s.uv_size.x,M[8*s.buffer_index+7]=s.uv_pos.y+s.uv_size.x,s}function ea(e){q[8*e.buffer_index+0]=e.position.x,q[8*e.buffer_index+1]=e.position.y,q[8*e.buffer_index+2]=e.position.x+e.size.x,q[8*e.buffer_index+3]=e.position.y,q[8*e.buffer_index+4]=e.position.x,q[8*e.buffer_index+5]=e.position.y+e.size.x,q[8*e.buffer_index+6]=e.position.x+e.size.x,q[8*e.buffer_index+7]=e.position.y+e.size.x}let eu={pressed:{},queued:[]};requestAnimationFrame(function e(t){let r=(t-ec)*.001;if(ec=t,o.resizeCanvasToDisplaySize(_.canvas)&&_.viewport(0,0,_.drawingBufferWidth,_.drawingBufferHeight),eu.pressed.KeyA&&(Q.debug_x-=1),eu.pressed.KeyD&&(Q.debug_x+=1),eu.pressed.KeyW&&(Q.debug_y-=1),eu.pressed.KeyS&&(Q.debug_y+=1),eu.queued.length>0&&null===ei&&null===es){let e=eu.queued.shift();if("KeyZ"==e)er.length>0&&((es=er.pop()).undo(),en.turn_time=0);else{let t=new c;switch(e){case"KeyD":t.x=1;break;case"KeyA":t.x=-1;break;case"KeyW":t.y=-1;break;case"KeyS":t.y=1}if(0!=t.x||0!=t.y){let e=c.add(Q.player_pos,t);if(T(e.x,e.y))ei=new et(Q.player_pos,t);else{let r=Q.crates_pos.findIndex(t=>c.equals(e,t));if(-1==r)(ei=new Z(c.copy(Q.player_pos),t)).execute(),er.push(ei);else{let e=c.add(Q.crates_pos[r],t);T(e.x,e.y)||Q.crates_pos.some(t=>c.equals(e,t))?ei=new et(Q.player_pos,t):((ei=new ee(r,c.copy(Q.crates_pos[r]),t)).execute(),er.push(ei))}}}}}null!==ei?(en.turn_time+=r/.05,en.turn_time=a(en.turn_time,0,1),ei.animTurn(en.turn_time),en.turn_time>=1&&(ei=null,en.turn_time=0)):null!==es&&(en.turn_time+=r/.05,en.turn_time=a(en.turn_time,0,1),es.undoAnimTurn(en.turn_time),en.turn_time>=1&&(es=null,en.turn_time=0)),_.clear(_.COLOR_BUFFER_BIT),_.useProgram(x.program),o.setBuffersAndAttributes(_,x,m),o.setUniforms(x,{u_texture:f,u_resolution:[_.canvas.width,_.canvas.height],u_size:[50,50],u_position:[Q.debug_x,Q.debug_y]}),o.drawBufferInfo(_,y),_.useProgram(h.program),_.bindVertexArray(z.vertexArrayObject),o.setUniformsAndBindTextures(h,{u_origin:[-(64*F)/_.canvas.width,64*S/_.canvas.height],u_basis:[128/_.canvas.width,-128/_.canvas.height],u_sheet_count:[4,4],u_sheet:g}),_.drawArraysInstanced(_.TRIANGLES,0,6,F*S),_.bindVertexArray(N.vertexArrayObject),o.setUniformsAndBindTextures(h,{u_origin:[-(64*R)/_.canvas.width,64*A/_.canvas.height],u_basis:[128/_.canvas.width,-128/_.canvas.height],u_sheet_count:[1,1],u_sheet:L}),_.drawArraysInstanced(_.TRIANGLES,0,6,H),_.bindBuffer(_.ARRAY_BUFFER,K),_.bufferSubData(_.ARRAY_BUFFER,0,q),_.bindBuffer(_.ARRAY_BUFFER,V),_.bufferSubData(_.ARRAY_BUFFER,0,M),_.useProgram(P.program),_.bindVertexArray(G.vertexArrayObject),o.setUniformsAndBindTextures(P,{u_origin:[-(64*R)/_.canvas.width,64*A/_.canvas.height],u_basis:[128/_.canvas.width,-128/_.canvas.height],u_texture:X}),_.drawElements(_.TRIANGLES,6,_.UNSIGNED_SHORT,12*en.player_sprite.buffer_index),o.setUniformsAndBindTextures(P,{u_origin:[-(64*R)/_.canvas.width,64*A/_.canvas.height],u_basis:[128/_.canvas.width,-128/_.canvas.height],u_texture:J}),_.drawElements(_.TRIANGLES,12,_.UNSIGNED_SHORT,12*en.crates_sprites[0].buffer_index),requestAnimationFrame(e)}),document.addEventListener("keydown",function(e){console.log("keydown"),eu.pressed[e.code]=!0,eu.queued.push(e.code)}),document.addEventListener("keyup",function(e){console.log("keyup"),eu.pressed[e.code]=!1});let ec=0;
//# sourceMappingURL=index.d232555d.js.map
