!function(){function e(e,t,r,n){Object.defineProperty(e,t,{get:r,set:n,enumerable:!0,configurable:!0})}function t(e){return e&&e.__esModule?e.default:e}var r="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},o={},i=r.parcelRequire94c2;null==i&&((i=function(e){if(e in n)return n[e].exports;if(e in o){var t=o[e];delete o[e];var r={id:e,exports:{}};return n[e]=r,t.call(r.exports,r,r.exports),r.exports}var i=Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,t){o[e]=t},r.parcelRequire94c2=i),i.register("iE7OH",function(t,r){"use strict";e(t.exports,"register",function(){return n},function(e){return n=e}),e(t.exports,"resolve",function(){return o},function(e){return o=e});var n,o,i={};n=function(e){for(var t=Object.keys(e),r=0;r<t.length;r++)i[t[r]]=e[t[r]]},o=function(e){var t=i[e];if(null==t)throw Error("Could not resolve bundle with id "+e);return t}}),i.register("aNJCr",function(t,r){e(t.exports,"getBundleURL",function(){return n},function(e){return n=e});"use strict";var n,o={};n=function(e){var t=o[e];return t||(t=function(){try{throw Error()}catch(t){var e=(""+t.stack).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^)\n]+/g);if(e)return(""+e[2]).replace(/^((?:https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/.+)\/[^/]+$/,"$1")+"/"}return"/"}(),o[e]=t),t}}),i("iE7OH").register(JSON.parse('{"6XD96":"index.bf18a4a6.js","dmpJf":"sprite.22ec2077.png","j20FQ":"walls_312.cb79a6c7.png","hnbg0":"floor_312.8cddc3eb.png","kzlhX":"player_puzzlescript.5728a87e.png","jYpdJ":"crate_puzzlescript.92620967.png","kYUDX":"index.a7a224eb.js"}'));var s=i("6MzNI");function a(e,t,r){return Math.max(t,Math.min(r,e))}class u{constructor(e=0,t=0){this.x=e,this.y=t}static #e=(()=>{this.zero=new u(0,0)})();static copy(e,t){return(t=t||new u).x=e.x,t.y=e.y,t}static add(e,t,r){return(r=r||new u).x=e.x+t.x,r.y=e.y+t.y,r}static sub(e,t,r){return(r=r||new u).x=e.x-t.x,r.y=e.y-t.y,r}static negate(e,t){return(t=t||new u).x=-e.x,t.y=-e.y,t}static scale(e,t,r){return(r=r||new u).x=e.x*t,r.y=e.y*t,r}static lerp(e,t,r,n){return(n=n||new u).x=e.x*(1-r)+t.x*r,n.y=e.y*(1-r)+t.y*r,n}static isZero(e){return 0==e.x&&0==e.y}static equals(e,t){return e.x==t.x&&e.y==t.y}static map2(e,t,r,n){return(n=n||new u).x=r(e.x,t.x),n.y=r(e.y,t.y),n}}var c={};c="#version 300 es\n#define GLSLIFY 1\n\n// [0, 1]^2\nin vec2 a_vertex;\n\n// pixels for everything\nuniform vec2 u_resolution;\nuniform vec2 u_position;\nuniform vec2 u_size;\n\nout vec2 v_texcoord;\n\nvoid main() {\n    // if size is 100 & screen is 400, then\n    // clip space result width will be .5\n    vec2 pos = 2.0 * a_vertex * u_size / u_resolution;\n\n    // if position is 200 & screen is 400, then\n    // clip space result offset will be .5\n    pos += 2.0 * u_position / u_resolution;\n\n    // pos of 0 should go to the top left\n    pos -= vec2(1, 1);\n\n    // ypos = down\n    pos.y = -pos.y;\n\n    gl_Position = vec4(pos, 0, 1);\n\n    v_texcoord = a_vertex;\n}\n\n// todo: investigate glslify";var l={};l="#version 300 es\nprecision highp float;\n#define GLSLIFY 1\n\nin vec2 v_texcoord;\n\nuniform sampler2D u_texture;\n\nout vec4 out_color;\n\nvoid main() {\n    out_color = texture(u_texture, v_texcoord);\n}";let p=document.querySelector("#c").getContext("webgl2",{alpha:!1});p.clearColor(.5,.5,.75,1),p.enable(p.BLEND),p.blendFunc(p.SRC_ALPHA,p.ONE_MINUS_SRC_ALPHA),s.resizeCanvasToDisplaySize(p.canvas),p.viewport(0,0,p.drawingBufferWidth,p.drawingBufferHeight);var d={};d=i("aNJCr").getBundleURL("6XD96")+"../"+i("iE7OH").resolve("dmpJf");let _=s.createTexture(p,{src:new URL(d).toString()}),f=s.createProgramInfo(p,[t(c),t(l)]),y=s.createBufferInfoFromArrays(p,{a_vertex:{data:[1,1,0,1,1,0,0,0,1,0,0,1],numComponents:2}}),x=s.createVertexArrayInfo(p,f,y),h=s.createProgramInfo(p,[`#version 300 es

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
    `]);var v={};v=i("aNJCr").getBundleURL("6XD96")+"../"+i("iE7OH").resolve("j20FQ");let m=s.createTexture(p,{src:new URL(v).toString(),mag:p.NEAREST,wrap:p.REPEAT}),g=`
####!!
#.O#!!
#..###
#@P..#
#..*.#
#..###
####!!
`.trim(),w=g.split("\n").map(e=>e.trim()),A=w.length,b=w[0].length;console.assert(w.every(e=>e.length==b),"Bad ascii level");let R=w.map(e=>e.split("").map(e=>"#"==e)).flat();function E(e,t){return!(e<0)&&!(e>=b)&&!(t<0)&&!(t>=A)&&R[e+t*b]}let T=b+1,F=A+1,S=new Float32Array(4*T*F);for(let e=0;e<F;e++)for(let t=0;t<T;t++){let r=(t+e*T)*4;S[r+0]=t,S[r+1]=e;let n=function(e,t){let r=E(e-0,t-1)?1:0,n=E(e-0,t-0)?2:0,o=E(e-1,t-0)?4:0;return[[0,3],[0,2],[1,3],[1,0],[0,0],[2,3],[3,0],[1,1],[3,3],[1,2],[0,1],[2,2],[3,2],[3,1],[2,0],[2,1]][(E(e-1,t-1)?8:0)+r+o+n]}(t,e);S[r+2]=n[0],S[r+3]=n[1]}let B=p.createBuffer();p.bindBuffer(p.ARRAY_BUFFER,B),p.bufferData(p.ARRAY_BUFFER,S,p.STATIC_DRAW);let U=s.createVertexArrayInfo(p,h,s.createBufferInfoFromArrays(p,{a_position:{buffer:B,type:p.FLOAT,numComponents:2,stride:16,offset:0,divisor:1},a_tileindex:{buffer:B,type:p.FLOAT,numComponents:2,stride:16,offset:8,divisor:1},a_vertex:{data:[1,1,0,1,1,0,0,0,1,0,0,1],numComponents:2}}));var I={};I=i("aNJCr").getBundleURL("6XD96")+"../"+i("iE7OH").resolve("hnbg0");let C=s.createTexture(p,{src:new URL(I).toString(),mag:p.NEAREST,wrap:p.REPEAT}),D=w.map(e=>e.split("").map(e=>"#"!=e&&"!"!=e)).flat(),L=new Float32Array(4*b*A),H=0;for(let e=0;e<A;e++)for(let t=0;t<b;t++)D[t+e*b]&&(L[4*H+0]=t,L[4*H+1]=e,S[4*H+2]=0,S[4*H+3]=0,H+=1);let N=p.createBuffer();p.bindBuffer(p.ARRAY_BUFFER,N),p.bufferData(p.ARRAY_BUFFER,L,p.STATIC_DRAW);let O=s.createVertexArrayInfo(p,h,s.createBufferInfoFromArrays(p,{a_position:{buffer:N,type:p.FLOAT,numComponents:2,stride:16,offset:0,divisor:1},a_tileindex:{buffer:N,type:p.FLOAT,numComponents:2,stride:16,offset:8,divisor:1},a_vertex:{data:[1,1,0,1,1,0,0,0,1,0,0,1],numComponents:2}})),z=s.createProgramInfo(p,[`#version 300 es

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
    `]);console.assert(!0,"Can't draw that many sprites, change the code to use u32 indices.");var P=0,Y=new Float32Array(64),q=new Float32Array(64);let k=new Uint16Array(192);for(let e=0;e<32;e+=1)k[6*e+0]=4*e+0,k[6*e+1]=4*e+1,k[6*e+2]=4*e+2,k[6*e+3]=4*e+1,k[6*e+4]=4*e+3,k[6*e+5]=4*e+2;let j=s.createBufferInfoFromArrays(p,{a_position:{data:Y,numComponents:2,drawType:p.DYNAMIC_DRAW},a_texcoord:{data:q,numComponents:2,drawType:p.DYNAMIC_DRAW},indices:{data:k,drawType:p.STATIC_DRAW}}),J=j.attribs.a_position.buffer,K=j.attribs.a_texcoord.buffer,W=s.createVertexArrayInfo(p,z,j);var X={};X=i("aNJCr").getBundleURL("6XD96")+"../"+i("iE7OH").resolve("kzlhX");let G=s.createTexture(p,{src:new URL(X).toString(),mag:p.NEAREST,wrap:p.REPEAT});var M={};M=i("aNJCr").getBundleURL("6XD96")+"../"+i("iE7OH").resolve("jYpdJ");let V=s.createTexture(p,{src:new URL(M).toString(),mag:p.NEAREST,wrap:p.REPEAT}),Q={debug_x:0,debug_y:0,player_pos:new u(2,3),crates_pos:[new u(1,3),new u(3,4)]};class Z{constructor(e,t){this.original_pos=e,this.dir=t}execute(){u.add(this.original_pos,this.dir,Q.player_pos)}animTurn(e){u.add(this.original_pos,u.scale(this.dir,e),er.player_pos),Y[8*ei+0]=er.player_pos.x,Y[8*ei+1]=er.player_pos.y,Y[8*ei+2]=er.player_pos.x+1,Y[8*ei+3]=er.player_pos.y,Y[8*ei+4]=er.player_pos.x,Y[8*ei+5]=er.player_pos.y+1,Y[8*ei+6]=er.player_pos.x+1,Y[8*ei+7]=er.player_pos.y+1}undo(){u.copy(this.original_pos,Q.player_pos)}}class ${constructor(e,t,r){this.crate_index=e,this.original_pos=t,this.dir=r,this.extra_command=new Z(u.sub(t,r),r)}execute(){u.add(this.original_pos,this.dir,Q.crates_pos[this.crate_index]),this.extra_command.execute()}animTurn(e){let t=u.add(this.original_pos,u.scale(this.dir,e)),r=es[this.crate_index];this.extra_command.animTurn(e),Y[8*r+0]=t.x,Y[8*r+1]=t.y,Y[8*r+2]=t.x+1,Y[8*r+3]=t.y,Y[8*r+4]=t.x,Y[8*r+5]=t.y+1,Y[8*r+6]=t.x+1,Y[8*r+7]=t.y+1}undo(){u.copy(this.original_pos,Q.crates_pos[this.crate_index]),this.extra_command.undo()}}class ee{constructor(e,t){this.pos=e,this.dir=t}execute(){throw Error("not an executable command")}animTurn(e){u.add(this.pos,u.scale(this.dir,e*(1-e)),er.player_pos),Y[8*ei+0]=er.player_pos.x,Y[8*ei+1]=er.player_pos.y,Y[8*ei+2]=er.player_pos.x+1,Y[8*ei+3]=er.player_pos.y,Y[8*ei+4]=er.player_pos.x,Y[8*ei+5]=er.player_pos.y+1,Y[8*ei+6]=er.player_pos.x+1,Y[8*ei+7]=er.player_pos.y+1}undo(){throw Error("not an undoable command")}}let et=[],er={turn_time:0,player_pos:u.copy(Q.player_pos)},en=null,eo=null,ei=P;P+=1,Y[8*ei+0]=Q.player_pos.x,Y[8*ei+1]=Q.player_pos.y,Y[8*ei+2]=Q.player_pos.x+1,Y[8*ei+3]=Q.player_pos.y,Y[8*ei+4]=Q.player_pos.x,Y[8*ei+5]=Q.player_pos.y+1,Y[8*ei+6]=Q.player_pos.x+1,Y[8*ei+7]=Q.player_pos.y+1,q[8*ei+0]=0,q[8*ei+1]=0,q[8*ei+2]=1,q[8*ei+3]=0,q[8*ei+4]=0,q[8*ei+5]=1,q[8*ei+6]=1,q[8*ei+7]=1;let es=[];Q.crates_pos.forEach(e=>{let t=P;es.push(t),P+=1,Y[8*t+0]=e.x,Y[8*t+1]=e.y,Y[8*t+2]=e.x+1,Y[8*t+3]=e.y,Y[8*t+4]=e.x,Y[8*t+5]=e.y+1,Y[8*t+6]=e.x+1,Y[8*t+7]=e.y+1,q[8*t+0]=0,q[8*t+1]=0,q[8*t+2]=1,q[8*t+3]=0,q[8*t+4]=0,q[8*t+5]=1,q[8*t+6]=1,q[8*t+7]=1});let ea={pressed:{},queued:[]};requestAnimationFrame(function e(t){let r=(t-eu)*.001;if(eu=t,s.resizeCanvasToDisplaySize(p.canvas)&&p.viewport(0,0,p.drawingBufferWidth,p.drawingBufferHeight),ea.pressed.KeyA&&(Q.debug_x-=1),ea.pressed.KeyD&&(Q.debug_x+=1),ea.pressed.KeyW&&(Q.debug_y-=1),ea.pressed.KeyS&&(Q.debug_y+=1),ea.queued.length>0&&null===en&&null===eo){let e=ea.queued.shift();if("KeyZ"==e)et.length>0&&((eo=et.pop()).undo(),er.turn_time=1);else{let t=new u;switch(e){case"KeyD":t.x=1;break;case"KeyA":t.x=-1;break;case"KeyW":t.y=-1;break;case"KeyS":t.y=1}if(0!=t.x||0!=t.y){let e=u.add(Q.player_pos,t);if(E(e.x,e.y))en=new ee(Q.player_pos,t);else{let r=Q.crates_pos.findIndex(t=>u.equals(e,t));if(-1==r)(en=new Z(u.copy(Q.player_pos),t)).execute(),et.push(en);else{let e=u.add(Q.crates_pos[r],t);E(e.x,e.y)||Q.crates_pos.some(t=>u.equals(e,t))?en=new ee(Q.player_pos,t):((en=new $(r,u.copy(Q.crates_pos[r]),t)).execute(),et.push(en))}}}}}null!==en?(er.turn_time+=r/.05,er.turn_time=a(er.turn_time,0,1),en.animTurn(er.turn_time),er.turn_time>=1&&(en=null,er.turn_time=0)):null!==eo&&(er.turn_time-=r/.05,er.turn_time=a(er.turn_time,0,1),eo.animTurn(er.turn_time),er.turn_time<=0&&(eo=null,er.turn_time=0)),p.clear(p.COLOR_BUFFER_BIT),p.useProgram(f.program),s.setBuffersAndAttributes(p,f,x),s.setUniforms(f,{u_texture:_,u_resolution:[p.canvas.width,p.canvas.height],u_size:[50,50],u_position:[Q.debug_x,Q.debug_y]}),s.drawBufferInfo(p,y),p.useProgram(h.program),p.bindVertexArray(U.vertexArrayObject),s.setUniformsAndBindTextures(h,{u_origin:[-(64*T)/p.canvas.width,64*F/p.canvas.height],u_basis:[128/p.canvas.width,-128/p.canvas.height],u_sheet_count:[4,4],u_sheet:m}),p.drawArraysInstanced(p.TRIANGLES,0,6,T*F),p.bindVertexArray(O.vertexArrayObject),s.setUniformsAndBindTextures(h,{u_origin:[-(64*b)/p.canvas.width,64*A/p.canvas.height],u_basis:[128/p.canvas.width,-128/p.canvas.height],u_sheet_count:[1,1],u_sheet:C}),p.drawArraysInstanced(p.TRIANGLES,0,6,H),p.bindBuffer(p.ARRAY_BUFFER,J),p.bufferSubData(p.ARRAY_BUFFER,0,Y),p.bindBuffer(p.ARRAY_BUFFER,K),p.bufferSubData(p.ARRAY_BUFFER,0,q),p.useProgram(z.program),p.bindVertexArray(W.vertexArrayObject),s.setUniformsAndBindTextures(z,{u_origin:[-(64*b)/p.canvas.width,64*A/p.canvas.height],u_basis:[128/p.canvas.width,-128/p.canvas.height],u_texture:G}),p.drawElements(p.TRIANGLES,6,p.UNSIGNED_SHORT,12*ei),s.setUniformsAndBindTextures(z,{u_origin:[-(64*b)/p.canvas.width,64*A/p.canvas.height],u_basis:[128/p.canvas.width,-128/p.canvas.height],u_texture:V}),p.drawElements(p.TRIANGLES,12,p.UNSIGNED_SHORT,12*es[0]),requestAnimationFrame(e)}),document.addEventListener("keydown",function(e){console.log("keydown"),ea.pressed[e.code]=!0,ea.queued.push(e.code)}),document.addEventListener("keyup",function(e){console.log("keyup"),ea.pressed[e.code]=!1});let eu=0}();
//# sourceMappingURL=index.bf18a4a6.js.map
