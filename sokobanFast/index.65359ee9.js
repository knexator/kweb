!function(){function t(t){return t&&t.__esModule?t.default:t}var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},i={},r={},s=e.parcelRequire94c2;null==s&&((s=function(t){if(t in i)return i[t].exports;if(t in r){var e=r[t];delete r[t];var s={id:t,exports:{}};return i[t]=s,e.call(s.exports,s,s.exports),s.exports}var o=Error("Cannot find module '"+t+"'");throw o.code="MODULE_NOT_FOUND",o}).register=function(t,e){r[t]=e},e.parcelRequire94c2=s);var o=s("6MzNI");function n(t,e,i){return Math.max(e,Math.min(i,t))}class h{constructor(t=0,e=0){this.x=t,this.y=e}set(t,e){return this.x=t,this.y=e,this}static #t=(()=>{this.tmp=new h(0,0)})();static #e=(()=>{this.tmp1=new h(0,0)})();static #i=(()=>{this.tmp2=new h(0,0)})();static #r=(()=>{this.tmp3=new h(0,0)})();static #s=(()=>{this.zero=new h(0,0)})();static #o=(()=>{this.one=new h(1,1)})();static copy(t,e){return(e=e||new h).x=t.x,e.y=t.y,e}static add(t,e,i){return(i=i||new h).x=t.x+e.x,i.y=t.y+e.y,i}static sub(t,e,i){return(i=i||new h).x=t.x-e.x,i.y=t.y-e.y,i}static negate(t,e){return(e=e||new h).x=-t.x,e.y=-t.y,e}static scale(t,e,i){return(i=i||new h).x=t.x*e,i.y=t.y*e,i}static lerp(t,e,i,r){return(r=r||new h).x=t.x*(1-i)+e.x*i,r.y=t.y*(1-i)+e.y*i,r}static isZero(t){return 0==t.x&&0==t.y}static equals(t,e){return t.x==e.x&&t.y==e.y}static map2(t,e,i,r){return(r=r||new h).x=i(t.x,e.x),r.y=i(t.y,e.y),r}}"use strict";var o=s("6MzNI"),a={},u={},c=function(){};c.prototype={fit:function(t){var e,i,r,s,o=t.length,n=o>0?t[0].width:0,h=o>0?t[0].height:0;for(e=0,this.root={x:0,y:0,width:n,height:h};e<o;e++)r=t[e],(i=this.findNode(this.root,r.width,r.height))?(s=this.splitNode(i,r.width,r.height),r.x=s.x,r.y=s.y):(s=this.growNode(r.width,r.height),r.x=s.x,r.y=s.y)},findNode:function(t,e,i){return t.used?this.findNode(t.right,e,i)||this.findNode(t.down,e,i):e<=t.width&&i<=t.height?t:null},splitNode:function(t,e,i){return t.used=!0,t.down={x:t.x,y:t.y+i,width:t.width,height:t.height-i},t.right={x:t.x+e,y:t.y,width:t.width-e,height:i},t},growNode:function(t,e){var i=t<=this.root.width,r=e<=this.root.height,s=r&&this.root.height>=this.root.width+t,o=i&&this.root.width>=this.root.height+e;return s?this.growRight(t,e):o?this.growDown(t,e):r?this.growRight(t,e):i?this.growDown(t,e):null},growRight:function(t,e){var i;return(this.root={used:!0,x:0,y:0,width:this.root.width+t,height:this.root.height,down:this.root,right:{x:this.root.width,y:0,width:t,height:this.root.height}},i=this.findNode(this.root,t,e))?this.splitNode(i,t,e):null},growDown:function(t,e){var i;return(this.root={used:!0,x:0,y:0,width:this.root.width,height:this.root.height+e,down:{x:0,y:this.root.height,width:this.root.width,height:e},right:this.root},i=this.findNode(this.root,t,e))?this.splitNode(i,t,e):null}},u=c,a=function(t,e){e=e||{};var i=new u,r=e.inPlace||!1,s=t.map(function(t){return r?t:{width:t.width,height:t.height,item:t}});s=s.sort(function(t,e){return e.width*e.height-t.width*t.height}),i.fit(s);var o={width:s.reduce(function(t,e){return Math.max(t,e.x+e.width)},0),height:s.reduce(function(t,e){return Math.max(t,e.y+e.height)},0)};return r||(o.items=s),o};var d=s("9AT65");class l{constructor(t,e,i,r){this.left=t,this.top=e,this.right=i,this.bottom=r}}let p=document.querySelector("#c").getContext("webgl2",{alpha:!1});p.clearColor(.5,.5,.75,1),p.enable(p.BLEND),p.blendFunc(p.SRC_ALPHA,p.ONE_MINUS_SRC_ALPHA),o.resizeCanvasToDisplaySize(p.canvas),p.viewport(0,0,p.drawingBufferWidth,p.drawingBufferHeight);let _=new class{constructor(e,i){this.gl=e,this.n_queued=0,this.program_info=o.createProgramInfo(e,[`#version 300 es
        
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
            `]),console.assert(!0,"Can't draw that many sprites, change the code to use u32 indices."),this.vertices_cpu=new Float32Array(8192),this.vertices_gpu=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.vertices_gpu),e.bufferData(e.ARRAY_BUFFER,this.vertices_cpu,e.DYNAMIC_DRAW);let r=new Uint16Array(12288);for(let t=0;t<2048;t+=1)r[6*t+0]=4*t+0,r[6*t+1]=4*t+1,r[6*t+2]=4*t+2,r[6*t+3]=4*t+1,r[6*t+4]=4*t+3,r[6*t+5]=4*t+2;this.buffer_info=o.createBufferInfoFromArrays(e,{a_position:{buffer:this.vertices_gpu,numComponents:2,type:Float32Array,offset:0,stride:16},a_texcoord:{buffer:this.vertices_gpu,numComponents:2,type:Float32Array,offset:8,stride:16},indices:{data:r,drawType:e.STATIC_DRAW}}),this.vao_info=o.createVertexArrayInfo(e,this.program_info,this.buffer_info);let s=[];for(let[t,e]of Object.entries(i)){let i=e[1].trim().split("\n").map(t=>t.trim());s.push({width:function(t){if(0!==t.length)return t[function(t){if(0===t.length)return;let e=0,i=t[0];for(let r=1;r<t.length;r++)t[r]>i&&(i=t[r],e=r);return e}(t)]}(i.map(t=>t.length)),height:i.length,spr_rows:i,spr_colors:e[0],spr_name:t})}let n=t(a)(s,{inPlace:!0}),h=new Uint8Array(4*n.height*n.width);this.mapping={},s.forEach(e=>{let i=e.x,r=e.y,s=e.spr_colors.map(e=>{if("darkbrown"==e)return[123,54,23,255];let i=t(d)(e).array();return i.push(255),i});this.mapping[e.spr_name]=new l(i/n.width,r/n.height,(i+e.width)/n.width,(r+e.height)/n.height);for(let t=0;t<e.width;t++)for(let o=0;o<e.height;o++){let a=e.spr_rows[t].charAt(o);if("."===a)continue;let u=s[Number(a)],c=(i+o+(r+t)*n.width)*4;h[c+0]=u[0],h[c+1]=u[1],h[c+2]=u[2],h[c+3]=u[3]}}),this.atlas_texture=o.createTexture(e,{src:h,width:n.width,height:n.height,format:e.RGBA,mag:e.NEAREST}),console.log(this.mapping)}centerLevel(t,e,i){this.origin=new h(-t*i/this.gl.canvas.width,e*i/this.gl.canvas.height),this.basis=new h(2*i/this.gl.canvas.width,-2*i/this.gl.canvas.height)}queue(t,e,i){this.queueExtra(t,new h(e,i),h.one)}queueExtra(t,e,i){let r=4*this.n_queued*4,s=this.mapping[t];if(void 0===s)throw Error(`cant find sprite name ${t}`);this.vertices_cpu[r+0]=e.x,this.vertices_cpu[r+1]=e.y,this.vertices_cpu[r+2]=s.left,this.vertices_cpu[r+3]=s.top,this.vertices_cpu[r+4]=e.x+i.x,this.vertices_cpu[r+5]=e.y,this.vertices_cpu[r+6]=s.right,this.vertices_cpu[r+7]=s.top,this.vertices_cpu[r+8]=e.x,this.vertices_cpu[r+9]=e.y+i.y,this.vertices_cpu[r+10]=s.left,this.vertices_cpu[r+11]=s.bottom,this.vertices_cpu[r+12]=e.x+i.x,this.vertices_cpu[r+13]=e.y+i.y,this.vertices_cpu[r+14]=s.right,this.vertices_cpu[r+15]=s.bottom,this.n_queued+=1}draw(){let t=this.gl;t.bindBuffer(t.ARRAY_BUFFER,this.vertices_gpu),t.bufferSubData(t.ARRAY_BUFFER,0,this.vertices_cpu,0,4*this.n_queued*4),t.useProgram(this.program_info.program),t.bindVertexArray(this.vao_info.vertexArrayObject),o.setUniformsAndBindTextures(this.program_info,{u_origin:[this.origin.x,this.origin.y],u_basis:[this.basis.x,this.basis.y],u_texture:this.atlas_texture}),t.drawElements(t.TRIANGLES,6*this.n_queued,t.UNSIGNED_SHORT,0),this.n_queued=0}}(p,{Floor:[["lightgreen","green"],`
      11111
      01111
      11101
      11111
      10111
    `],Wall:[["brown","darkbrown"],`
      00010
      11111
      01000
      11111
      00010
    `],Player:[["black","orange","white","blue"],`
      .000.
      .111.
      22222
      .333.
      .3.3.
    `],Crate:[["orange"],`
      00000
      0...0
      0...0
      0...0
      00000
    `]}),g=`
####!!
#.O#!!
#..###
#@P..#
#..*.#
#..###
####!!
`.trim(),f=g.split("\n").map(t=>t.trim()),w=f.length,y=f[0].length;console.assert(f.every(t=>t.length==y),"Bad ascii level");let m=f.map(t=>t.split("").map(t=>"#"==t)).flat();function x(t,e){return!(t<0)&&!(t>=y)&&!(e<0)&&!(e>=w)&&m[t+e*y]}let v=f.map(t=>t.split("").map(t=>"#"!=t&&"!"!=t)).flat(),b={debug_x:0,debug_y:0,player_pos:new h(2,3),crates_pos:[new h(1,3),new h(3,4)]};class A{constructor(t,e){this.original_pos=t,this.dir=e}execute(){h.add(this.original_pos,this.dir,b.player_pos)}animTurn(t){h.add(this.original_pos,h.scale(this.dir,t),q.player_sprite.position)}undoAnimTurn(t){this.animTurn(1-t)}undo(){h.copy(this.original_pos,b.player_pos)}}class R{constructor(t,e,i){this.crate_index=t,this.original_pos=e,this.dir=i,this.extra_command=new A(h.sub(e,i),i)}execute(){h.add(this.original_pos,this.dir,b.crates_pos[this.crate_index]),this.extra_command.execute()}animTurn(t){h.add(this.original_pos,h.scale(this.dir,t),q.crates_sprites[this.crate_index].position),this.extra_command.animTurn(t)}undoAnimTurn(t){var e;this.extra_command.animTurn(1-t);let i=h.add(this.original_pos,new h(.5,.5));t<.5?(h.scale(h.one,1-2*t,q.crates_sprites[this.crate_index].size),h.add(i,this.dir,i)):(h.scale(h.one,2*t-1,q.crates_sprites[this.crate_index].size),h.copy(this.original_pos,q.crates_sprites[this.crate_index].position)),e=q.crates_sprites[this.crate_index],h.sub(i,h.scale(e.size,.5),e.position)}undo(){h.copy(this.original_pos,b.crates_pos[this.crate_index]),this.extra_command.undo()}}class E{constructor(t,e){this.pos=t,this.dir=e}execute(){throw Error("not an executable command")}animTurn(t){h.add(this.pos,h.scale(this.dir,t*(1-t)),q.player_sprite.position)}undoAnimTurn(t){throw Error("not an undoable command")}undo(){throw Error("not an undoable command")}}let T=[],q={turn_time:0,player_sprite:B(h.copy(b.player_pos),h.copy(h.one),h.copy(h.zero),h.copy(h.one)),crates_sprites:b.crates_pos.map(t=>B(h.copy(t),h.copy(h.one),h.copy(h.zero),h.copy(h.one)))},N=null,F=null;function B(t,e,i,r){return{buffer_index:0,position:t,size:e,uv_pos:i,uv_size:r}}let z={pressed:{},queued:[]};requestAnimationFrame(function t(e){let i=(e-D)*.001;if(D=e,o.resizeCanvasToDisplaySize(p.canvas)&&p.viewport(0,0,p.drawingBufferWidth,p.drawingBufferHeight),z.queued.length>0&&null===N&&null===F){let t=z.queued.shift();if("KeyZ"==t)T.length>0&&((F=T.pop()).undo(),q.turn_time=0);else{let e=new h;switch(t){case"KeyD":e.x=1;break;case"KeyA":e.x=-1;break;case"KeyW":e.y=-1;break;case"KeyS":e.y=1}if(0!=e.x||0!=e.y){let t=h.add(b.player_pos,e);if(x(t.x,t.y))N=new E(b.player_pos,e);else{let i=b.crates_pos.findIndex(e=>h.equals(t,e));if(-1==i)(N=new A(h.copy(b.player_pos),e)).execute(),T.push(N);else{let t=h.add(b.crates_pos[i],e);x(t.x,t.y)||b.crates_pos.some(e=>h.equals(t,e))?N=new E(b.player_pos,e):((N=new R(i,h.copy(b.crates_pos[i]),e)).execute(),T.push(N))}}}}}null!==N?(q.turn_time+=i/.05,q.turn_time=n(q.turn_time,0,1),N.animTurn(q.turn_time),q.turn_time>=1&&(N=null,q.turn_time=0)):null!==F&&(q.turn_time+=i/.05,q.turn_time=n(q.turn_time,0,1),F.undoAnimTurn(q.turn_time),q.turn_time>=1&&(F=null,q.turn_time=0)),p.clear(p.COLOR_BUFFER_BIT),_.centerLevel(y,w,64);for(let t=0;t<w;t++)for(let e=0;e<y;e++)v[e+t*y]?_.queue("Floor",e,t):m[e+t*y]&&_.queue("Wall",e,t);_.queueExtra("Player",q.player_sprite.position,q.player_sprite.size),q.crates_sprites.forEach(t=>{_.queueExtra("Crate",t.position,t.size)}),_.draw(),requestAnimationFrame(t)}),document.addEventListener("keydown",function(t){console.log("keydown"),z.pressed[t.code]=!0,z.queued.push(t.code)}),document.addEventListener("keyup",function(t){console.log("keyup"),z.pressed[t.code]=!1});let D=0}();
//# sourceMappingURL=index.65359ee9.js.map
