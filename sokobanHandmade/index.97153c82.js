!function(){function e(e,t,r,n){Object.defineProperty(e,t,{get:r,set:n,enumerable:!0,configurable:!0})}function t(e){return e&&e.__esModule?e.default:e}var r="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},i={},s=r.parcelRequire94c2;null==s&&((s=function(e){if(e in n)return n[e].exports;if(e in i){var t=i[e];delete i[e];var r={id:e,exports:{}};return n[e]=r,t.call(r.exports,r,r.exports),r.exports}var s=Error("Cannot find module '"+e+"'");throw s.code="MODULE_NOT_FOUND",s}).register=function(e,t){i[e]=t},r.parcelRequire94c2=s),s.register("iE7OH",function(t,r){"use strict";e(t.exports,"register",function(){return n},function(e){return n=e}),e(t.exports,"resolve",function(){return i},function(e){return i=e});var n,i,s={};n=function(e){for(var t=Object.keys(e),r=0;r<t.length;r++)s[t[r]]=e[t[r]]},i=function(e){var t=s[e];if(null==t)throw Error("Could not resolve bundle with id "+e);return t}}),s.register("aNJCr",function(t,r){e(t.exports,"getBundleURL",function(){return n},function(e){return n=e});"use strict";var n,i={};n=function(e){var t=i[e];return t||(t=function(){try{throw Error()}catch(t){var e=(""+t.stack).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^)\n]+/g);if(e)return(""+e[2]).replace(/^((?:https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/.+)\/[^/]+$/,"$1")+"/"}return"/"}(),i[e]=t),t}}),s("iE7OH").register(JSON.parse('{"98W14":"index.97153c82.js","1x5K9":"sprite.22ec2077.png","5H61v":"walls_312.cb79a6c7.png","8jFaA":"floor_312.8cddc3eb.png","kCJGW":"player_puzzlescript.5728a87e.png","jO1gE":"crate_puzzlescript.92620967.png","e3yn0":"index.b8865dd2.js"}'));var o=s("6MzNI");function a(e,t,r){return Math.max(t,Math.min(r,e))}class u{constructor(e=0,t=0){this.x=e,this.y=t}set(e,t){return this.x=e,this.y=t,this}static #e=(()=>{this.tmp=new u(0,0)})();static #t=(()=>{this.tmp1=new u(0,0)})();static #r=(()=>{this.tmp2=new u(0,0)})();static #n=(()=>{this.tmp3=new u(0,0)})();static #i=(()=>{this.zero=new u(0,0)})();static #s=(()=>{this.one=new u(1,1)})();static copy(e,t){return(t=t||new u).x=e.x,t.y=e.y,t}static add(e,t,r){return(r=r||new u).x=e.x+t.x,r.y=e.y+t.y,r}static sub(e,t,r){return(r=r||new u).x=e.x-t.x,r.y=e.y-t.y,r}static negate(e,t){return(t=t||new u).x=-e.x,t.y=-e.y,t}static scale(e,t,r){return(r=r||new u).x=e.x*t,r.y=e.y*t,r}static lerp(e,t,r,n){return(n=n||new u).x=e.x*(1-r)+t.x*r,n.y=e.y*(1-r)+t.y*r,n}static isZero(e){return 0==e.x&&0==e.y}static equals(e,t){return e.x==t.x&&e.y==t.y}static map2(e,t,r,n){return(n=n||new u).x=r(e.x,t.x),n.y=r(e.y,t.y),n}}var c={};c="#version 300 es\n#define GLSLIFY 1\n\n// [0, 1]^2\nin vec2 a_vertex;\n\n// pixels for everything\nuniform vec2 u_resolution;\nuniform vec2 u_position;\nuniform vec2 u_size;\n\nout vec2 v_texcoord;\n\nvoid main() {\n    // if size is 100 & screen is 400, then\n    // clip space result width will be .5\n    vec2 pos = 2.0 * a_vertex * u_size / u_resolution;\n\n    // if position is 200 & screen is 400, then\n    // clip space result offset will be .5\n    pos += 2.0 * u_position / u_resolution;\n\n    // pos of 0 should go to the top left\n    pos -= vec2(1, 1);\n\n    // ypos = down\n    pos.y = -pos.y;\n\n    gl_Position = vec4(pos, 0, 1);\n\n    v_texcoord = a_vertex;\n}\n\n// todo: investigate glslify";var d={};d="#version 300 es\nprecision highp float;\n#define GLSLIFY 1\n\nin vec2 v_texcoord;\n\nuniform sampler2D u_texture;\n\nout vec4 out_color;\n\nvoid main() {\n    out_color = texture(u_texture, v_texcoord);\n}";let _=document.querySelector("#c").getContext("webgl2",{alpha:!1});_.clearColor(.5,.5,.75,1),_.enable(_.BLEND),_.blendFunc(_.SRC_ALPHA,_.ONE_MINUS_SRC_ALPHA),o.resizeCanvasToDisplaySize(_.canvas),_.viewport(0,0,_.drawingBufferWidth,_.drawingBufferHeight);var p={};p=s("aNJCr").getBundleURL("98W14")+"../"+s("iE7OH").resolve("1x5K9");let l=o.createTexture(_,{src:new URL(p).toString()}),f=o.createProgramInfo(_,[t(c),t(d)]),x=o.createBufferInfoFromArrays(_,{a_vertex:{data:[1,1,0,1,1,0,0,0,1,0,0,1],numComponents:2}}),v=o.createVertexArrayInfo(_,f,x),h=o.createProgramInfo(_,[`#version 300 es

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
    `]);var m={};m=s("aNJCr").getBundleURL("98W14")+"../"+s("iE7OH").resolve("5H61v");let y=o.createTexture(_,{src:new URL(m).toString(),mag:_.NEAREST,wrap:_.REPEAT}),g=`
####!!
#.O#!!
#..###
#@P..#
#..*.#
#..###
####!!
`.trim(),b=g.split("\n").map(e=>e.trim()),w=b.length,A=b[0].length;console.assert(b.every(e=>e.length==A),"Bad ascii level");let R=b.map(e=>e.split("").map(e=>"#"==e)).flat();function E(e,t){return!(e<0)&&!(e>=A)&&!(t<0)&&!(t>=w)&&R[e+t*A]}let T=A+1,F=w+1,S=new Float32Array(4*T*F);for(let e=0;e<F;e++)for(let t=0;t<T;t++){let r=(t+e*T)*4;S[r+0]=t,S[r+1]=e;let n=function(e,t){let r=E(e-0,t-1)?1:0,n=E(e-0,t-0)?2:0,i=E(e-1,t-0)?4:0;return[[0,3],[0,2],[1,3],[1,0],[0,0],[2,3],[3,0],[1,1],[3,3],[1,2],[0,1],[2,2],[3,2],[3,1],[2,0],[2,1]][(E(e-1,t-1)?8:0)+r+i+n]}(t,e);S[r+2]=n[0],S[r+3]=n[1]}let B=_.createBuffer();_.bindBuffer(_.ARRAY_BUFFER,B),_.bufferData(_.ARRAY_BUFFER,S,_.STATIC_DRAW);let C=o.createVertexArrayInfo(_,h,o.createBufferInfoFromArrays(_,{a_position:{buffer:B,type:_.FLOAT,numComponents:2,stride:16,offset:0,divisor:1},a_tileindex:{buffer:B,type:_.FLOAT,numComponents:2,stride:16,offset:8,divisor:1},a_vertex:{data:[1,1,0,1,1,0,0,0,1,0,0,1],numComponents:2}}));var z={};z=s("aNJCr").getBundleURL("98W14")+"../"+s("iE7OH").resolve("8jFaA");let I=o.createTexture(_,{src:new URL(z).toString(),mag:_.NEAREST,wrap:_.REPEAT}),U=b.map(e=>e.split("").map(e=>"#"!=e&&"!"!=e)).flat(),L=new Float32Array(4*A*w),H=0;for(let e=0;e<w;e++)for(let t=0;t<A;t++)U[t+e*A]&&(L[4*H+0]=t,L[4*H+1]=e,S[4*H+2]=0,S[4*H+3]=0,H+=1);let O=_.createBuffer();_.bindBuffer(_.ARRAY_BUFFER,O),_.bufferData(_.ARRAY_BUFFER,L,_.STATIC_DRAW);let N=o.createVertexArrayInfo(_,h,o.createBufferInfoFromArrays(_,{a_position:{buffer:O,type:_.FLOAT,numComponents:2,stride:16,offset:0,divisor:1},a_tileindex:{buffer:O,type:_.FLOAT,numComponents:2,stride:16,offset:8,divisor:1},a_vertex:{data:[1,1,0,1,1,0,0,0,1,0,0,1],numComponents:2}})),D=o.createProgramInfo(_,[`#version 300 es

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
    `]);console.assert(!0,"Can't draw that many sprites, change the code to use u32 indices.");var P=0,W=new Float32Array(64),q=new Float32Array(64);let Y=new Uint16Array(192);for(let e=0;e<32;e+=1)Y[6*e+0]=4*e+0,Y[6*e+1]=4*e+1,Y[6*e+2]=4*e+2,Y[6*e+3]=4*e+1,Y[6*e+4]=4*e+3,Y[6*e+5]=4*e+2;let j=o.createBufferInfoFromArrays(_,{a_position:{data:W,numComponents:2,drawType:_.DYNAMIC_DRAW},a_texcoord:{data:q,numComponents:2,drawType:_.DYNAMIC_DRAW},indices:{data:Y,drawType:_.STATIC_DRAW}}),k=j.attribs.a_position.buffer,K=j.attribs.a_texcoord.buffer,G=o.createVertexArrayInfo(_,D,j);var J={};J=s("aNJCr").getBundleURL("98W14")+"../"+s("iE7OH").resolve("kCJGW");let M=o.createTexture(_,{src:new URL(J).toString(),mag:_.NEAREST,wrap:_.REPEAT});var V={};V=s("aNJCr").getBundleURL("98W14")+"../"+s("iE7OH").resolve("jO1gE");let Z=o.createTexture(_,{src:new URL(V).toString(),mag:_.NEAREST,wrap:_.REPEAT}),$={debug_x:0,debug_y:0,player_pos:new u(2,3),crates_pos:[new u(1,3),new u(3,4)]};class Q{constructor(e,t){this.original_pos=e,this.dir=t}execute(){u.add(this.original_pos,this.dir,$.player_pos)}animTurn(e){u.add(this.original_pos,u.scale(this.dir,e),er.player_sprite.position),eo(er.player_sprite)}undoAnimTurn(e){this.animTurn(1-e)}undo(){u.copy(this.original_pos,$.player_pos)}}class X{constructor(e,t,r){this.crate_index=e,this.original_pos=t,this.dir=r,this.extra_command=new Q(u.sub(t,r),r)}execute(){u.add(this.original_pos,this.dir,$.crates_pos[this.crate_index]),this.extra_command.execute()}animTurn(e){u.add(this.original_pos,u.scale(this.dir,e),er.crates_sprites[this.crate_index].position),eo(er.crates_sprites[this.crate_index]),this.extra_command.animTurn(e)}undoAnimTurn(e){var t;this.extra_command.animTurn(1-e);let r=u.add(this.original_pos,new u(.5,.5));e<.5?(u.scale(u.one,1-2*e,er.crates_sprites[this.crate_index].size),u.add(r,this.dir,r)):(u.scale(u.one,2*e-1,er.crates_sprites[this.crate_index].size),u.copy(this.original_pos,er.crates_sprites[this.crate_index].position)),t=er.crates_sprites[this.crate_index],u.sub(r,u.scale(t.size,.5),t.position),eo(er.crates_sprites[this.crate_index])}undo(){u.copy(this.original_pos,$.crates_pos[this.crate_index]),this.extra_command.undo()}}class ee{constructor(e,t){this.pos=e,this.dir=t}execute(){throw Error("not an executable command")}animTurn(e){u.add(this.pos,u.scale(this.dir,e*(1-e)),er.player_sprite.position),eo(er.player_sprite)}undoAnimTurn(e){throw Error("not an undoable command")}undo(){throw Error("not an undoable command")}}let et=[],er={turn_time:0,player_sprite:es(u.copy($.player_pos),u.copy(u.one),u.copy(u.zero),u.copy(u.one)),crates_sprites:$.crates_pos.map(e=>es(u.copy(e),u.copy(u.one),u.copy(u.zero),u.copy(u.one)))},en=null,ei=null;function es(e,t,r,n){let i=P;P+=1;let s={buffer_index:i,position:e,size:t,uv_pos:r,uv_size:n};return eo(s),q[8*s.buffer_index+0]=s.uv_pos.x,q[8*s.buffer_index+1]=s.uv_pos.y,q[8*s.buffer_index+2]=s.uv_pos.x+s.uv_size.x,q[8*s.buffer_index+3]=s.uv_pos.y,q[8*s.buffer_index+4]=s.uv_pos.x,q[8*s.buffer_index+5]=s.uv_pos.y+s.uv_size.x,q[8*s.buffer_index+6]=s.uv_pos.x+s.uv_size.x,q[8*s.buffer_index+7]=s.uv_pos.y+s.uv_size.x,s}function eo(e){W[8*e.buffer_index+0]=e.position.x,W[8*e.buffer_index+1]=e.position.y,W[8*e.buffer_index+2]=e.position.x+e.size.x,W[8*e.buffer_index+3]=e.position.y,W[8*e.buffer_index+4]=e.position.x,W[8*e.buffer_index+5]=e.position.y+e.size.x,W[8*e.buffer_index+6]=e.position.x+e.size.x,W[8*e.buffer_index+7]=e.position.y+e.size.x}let ea={pressed:{},queued:[]};requestAnimationFrame(function e(t){let r=(t-eu)*.001;if(eu=t,o.resizeCanvasToDisplaySize(_.canvas)&&_.viewport(0,0,_.drawingBufferWidth,_.drawingBufferHeight),ea.pressed.KeyA&&($.debug_x-=1),ea.pressed.KeyD&&($.debug_x+=1),ea.pressed.KeyW&&($.debug_y-=1),ea.pressed.KeyS&&($.debug_y+=1),ea.queued.length>0&&null===en&&null===ei){let e=ea.queued.shift();if("KeyZ"==e)et.length>0&&((ei=et.pop()).undo(),er.turn_time=0);else{let t=new u;switch(e){case"KeyD":t.x=1;break;case"KeyA":t.x=-1;break;case"KeyW":t.y=-1;break;case"KeyS":t.y=1}if(0!=t.x||0!=t.y){let e=u.add($.player_pos,t);if(E(e.x,e.y))en=new ee($.player_pos,t);else{let r=$.crates_pos.findIndex(t=>u.equals(e,t));if(-1==r)(en=new Q(u.copy($.player_pos),t)).execute(),et.push(en);else{let e=u.add($.crates_pos[r],t);E(e.x,e.y)||$.crates_pos.some(t=>u.equals(e,t))?en=new ee($.player_pos,t):((en=new X(r,u.copy($.crates_pos[r]),t)).execute(),et.push(en))}}}}}null!==en?(er.turn_time+=r/.05,er.turn_time=a(er.turn_time,0,1),en.animTurn(er.turn_time),er.turn_time>=1&&(en=null,er.turn_time=0)):null!==ei&&(er.turn_time+=r/.05,er.turn_time=a(er.turn_time,0,1),ei.undoAnimTurn(er.turn_time),er.turn_time>=1&&(ei=null,er.turn_time=0)),_.clear(_.COLOR_BUFFER_BIT),_.useProgram(f.program),o.setBuffersAndAttributes(_,f,v),o.setUniforms(f,{u_texture:l,u_resolution:[_.canvas.width,_.canvas.height],u_size:[50,50],u_position:[$.debug_x,$.debug_y]}),o.drawBufferInfo(_,x),_.useProgram(h.program),_.bindVertexArray(C.vertexArrayObject),o.setUniformsAndBindTextures(h,{u_origin:[-(64*T)/_.canvas.width,64*F/_.canvas.height],u_basis:[128/_.canvas.width,-128/_.canvas.height],u_sheet_count:[4,4],u_sheet:y}),_.drawArraysInstanced(_.TRIANGLES,0,6,T*F),_.bindVertexArray(N.vertexArrayObject),o.setUniformsAndBindTextures(h,{u_origin:[-(64*A)/_.canvas.width,64*w/_.canvas.height],u_basis:[128/_.canvas.width,-128/_.canvas.height],u_sheet_count:[1,1],u_sheet:I}),_.drawArraysInstanced(_.TRIANGLES,0,6,H),_.bindBuffer(_.ARRAY_BUFFER,k),_.bufferSubData(_.ARRAY_BUFFER,0,W),_.bindBuffer(_.ARRAY_BUFFER,K),_.bufferSubData(_.ARRAY_BUFFER,0,q),_.useProgram(D.program),_.bindVertexArray(G.vertexArrayObject),o.setUniformsAndBindTextures(D,{u_origin:[-(64*A)/_.canvas.width,64*w/_.canvas.height],u_basis:[128/_.canvas.width,-128/_.canvas.height],u_texture:M}),_.drawElements(_.TRIANGLES,6,_.UNSIGNED_SHORT,12*er.player_sprite.buffer_index),o.setUniformsAndBindTextures(D,{u_origin:[-(64*A)/_.canvas.width,64*w/_.canvas.height],u_basis:[128/_.canvas.width,-128/_.canvas.height],u_texture:Z}),_.drawElements(_.TRIANGLES,12,_.UNSIGNED_SHORT,12*er.crates_sprites[0].buffer_index),requestAnimationFrame(e)}),document.addEventListener("keydown",function(e){console.log("keydown"),ea.pressed[e.code]=!0,ea.queued.push(e.code)}),document.addEventListener("keyup",function(e){console.log("keyup"),ea.pressed[e.code]=!1});let eu=0}();
//# sourceMappingURL=index.97153c82.js.map
