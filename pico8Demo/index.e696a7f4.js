function e(e,t,r,n){Object.defineProperty(e,t,{get:r,set:n,enumerable:!0,configurable:!0})}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},r={},n={},i=t.parcelRequire94c2;null==i&&((i=function(e){if(e in r)return r[e].exports;if(e in n){var t=n[e];delete n[e];var i={id:e,exports:{}};return r[e]=i,t.call(i.exports,i,i.exports),i.exports}var o=Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}).register=function(e,t){n[e]=t},t.parcelRequire94c2=i),i.register("kyEFX",function(t,r){"use strict";e(t.exports,"register",function(){return n},function(e){return n=e}),e(t.exports,"resolve",function(){return i},function(e){return i=e});var n,i,o={};n=function(e){for(var t=Object.keys(e),r=0;r<t.length;r++)o[t[r]]=e[t[r]]},i=function(e){var t=o[e];if(null==t)throw Error("Could not resolve bundle with id "+e);return t}}),i("kyEFX").register(JSON.parse('{"aGbME":"index.e696a7f4.js","5x25J":"cursor.492cd7c0.png","7DZNl":"pastries.2a5816cb.png","cKQNC":"font_pico8.b37ecd4f.png","bB1AD":"index.9c3702eb.js"}'));var o=i("amYBK");function s(e,t,r){return Math.max(t,Math.min(r,e))}function a(e,t,r){return e==t||e+1===r}class u{constructor(e=0,t=0,r=0,n=0){this.x=e,this.y=t,this.z=r,this.w=n}static fromHex(e){var t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);if(null===t)throw Error(`can't parse hex: ${e}`);return new u(parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16),255)}static #e=(()=>{this.zero=new u(0,0,0,0)})();static #t=(()=>{this.one=new u(1,1,1,1)})()}class c{constructor(e=0,t=0){this.x=e,this.y=t}toString(){return`Vec2(${this.x}, ${this.y})`}static #e=(()=>{this.tmp=new c(0,0)})();static #t=(()=>{this.tmp1=new c(0,0)})();static #r=(()=>{this.tmp2=new c(0,0)})();static #n=(()=>{this.tmp3=new c(0,0)})();static #i=(()=>{this.zero=new c(0,0)})();static #o=(()=>{this.one=new c(1,1)})();static set(e,t,r){return e.x=t,e.y=r,e}static copy(e,t){return(t=t||new c).x=e.x,t.y=e.y,t}static add(e,t,r){return(r=r||new c).x=e.x+t.x,r.y=e.y+t.y,r}static sub(e,t,r){return(r=r||new c).x=e.x-t.x,r.y=e.y-t.y,r}static mul(e,t,r){return(r=r||new c).x=e.x*t.x,r.y=e.y*t.y,r}static div(e,t,r){return(r=r||new c).x=e.x/t.x,r.y=e.y/t.y,r}static round(e,t){return(t=t||new c).x=Math.round(e.x),t.y=Math.round(e.y),t}static negate(e,t){return(t=t||new c).x=-e.x,t.y=-e.y,t}static scale(e,t,r){return(r=r||new c).x=e.x*t,r.y=e.y*t,r}static lerp(e,t,r,n){return(n=n||new c).x=e.x*(1-r)+t.x*r,n.y=e.y*(1-r)+t.y*r,n}static inBounds(e,t){var r,n,i,o;return r=e.x,n=t.x,r>=0&&r<n&&(i=e.y,o=t.y,i>=0&&i<o)}static onBorder(e,t){return a(e.x,0,t.x)||a(e.y,0,t.y)}static isZero(e){return 0===e.x&&0===e.y}static equals(e,t){return e.x===t.x&&e.y===t.y}static map1(e,t,r){return(r=r||new c).x=t(e.x),r.y=t(e.y),r}static map2(e,t,r,n){return(n=n||new c).x=r(e.x,t.x),n.y=r(e.y,t.y),n}static roundToCardinal(e){return Math.abs(e.x)>=Math.abs(e.y)?e.x>=0?"xpos":"xneg":e.y>=0?"ypos":"yneg"}}class d{constructor(e,t){this.topLeft=e,this.size=t}static fromParams(e){let t=new c,r=new c;if(void 0!==e.topLeft){if(c.copy(e.topLeft,t),void 0!==e.size)c.copy(e.size,r);else if(void 0!==e.bottomRight)c.sub(e.bottomRight,t,r);else if(void 0!==e.center)c.sub(e.center,t,r),c.scale(r,2,r);else throw Error("not enough data to compute rect");return new d(t,r)}if(void 0!==e.center){if(void 0!==e.size)c.copy(e.size,r);else if(void 0!==e.bottomRight)c.sub(e.bottomRight,e.center,r),c.scale(r,2,r);else throw Error("not enough data to compute rect");return c.sub(e.center,c.scale(r,.5),t),new d(t,r)}throw Error("unimplemented")}}var o=i("amYBK");class l{constructor(e,t){this.size=e,void 0===t?this.data=new Uint8ClampedArray(e.x*e.y*4):this.data=t}}async function w(e){var t;let r,n,i;return i=(t=await new Promise((t,r)=>{let n=new Image;n.crossOrigin="Anonymous",n.src=e,n.onload=()=>{t(n)},n.onerror=e=>{r(e)}}),(r=document.createElement("canvas")).width=t.width,r.height=t.height,(n=r.getContext("2d")).drawImage(t,0,0),n).getImageData(0,0,n.canvas.width,n.canvas.height).data,new l(new c(n.canvas.width,n.canvas.height),i)}class h{constructor(e){return new Proxy({},{get:(t,r)=>(r in t||(t[r]=e()),t[r])})}}class f{constructor(e,t,r){this.width=e,this.height=t,this.data=r}get(e,t,r){if(!this.inBounds(e,t)){if(3==arguments.length)return r;throw Error(`get at (${e}, ${t}) was out of bounds, and no default argument was given`)}return this.data[e+t*this.width]}getV(e,t){return 2==arguments.length?this.get(e.x,e.y,t):this.get(e.x,e.y)}set(e,t,r){if(!this.inBounds(e,t))throw Error(`can't set at (${e}, ${t}); out of bounds`);this.data[e+t*this.width]=r}setV(e,t){return this.set(e.x,e.y,t)}inBounds(e,t){return e>=0&&e<this.width&&t>=0&&t<this.height}inBoundsV(e){return this.inBounds(e.x,e.y)}forEach(e){for(let t=0;t<this.width;t++)for(let r=0;r<this.height;r++)e(t,r,this.data[t+r*this.width])}forEachV(e){for(let t=0;t<this.width;t++)for(let r=0;r<this.height;r++)e({x:t,y:r},this.data[t+r*this.width])}filter(e){let t=[];for(let r=0;r<this.width;r++)for(let n=0;n<this.height;n++)e(r,n,this.data[r+n*this.width])&&t.push(this.data[r+n*this.width]);return t}static init(e,t,r){let n=[];for(let i=0;i<t;i++)for(let t=0;t<e;t++)n.push(r(t,i));return new f(e,t,n)}static initV(e,t){let r=[];for(let n=0;n<e.y;n++)for(let i=0;i<e.x;i++)r.push(t({x:i,y:n}));return new f(e.x,e.y,r)}}function x(e,t,r){let n=4*(Math.round(t.x)+Math.round(t.y)*e.size.x);e.data[n+0]=r.x,e.data[n+1]=r.y,e.data[n+2]=r.z,e.data[n+3]=r.w}function y(e,t){let r=4*(Math.round(t.x)+Math.round(t.y)*e.size.x);return new u(e.data[r+0],e.data[r+1],e.data[r+2],e.data[r+3])}function p(e,t){let r=new c;for(let n=0;n<e.size.y;n++)for(let i=0;i<e.size.x;i++){c.set(r,i,n);let o=t(r);x(e,r,o)}}function m(e,t,r,n){let i=new c,o=new c;for(let s=0;s<t.size.y;s++)for(let a=0;a<t.size.x;a++){if(c.set(i,a,s),c.add(r,i,o),!c.inBounds(o,e.size))continue;let u=y(t,i),d=n(y(e,o),u);x(e,o,d)}}function g(e,t,r=0){let n=[],i=0===r?e.size:c.sub(e.size,c.scale(c.add(t,c.one),r)),o=c.div(i,t);if(!Number.isInteger(o.x)||!Number.isInteger(o.y))throw Error(`Can't extract ${t} sprites from a texture of size ${e.size} and a margin between sprites of ${r}; each sprite would have a non-fractional size of ${o}`);let s=new c(r,r);for(let i=0;i<t.y;i++){for(let i=0;i<t.x;i++)n.push(function(e,t,r){let n=new l(r),i=new c,o=new c;for(let s=0;s<r.y;s++)for(let a=0;a<r.x;a++)c.set(o,a,s),c.add(t,o,i),x(n,o,c.inBounds(i,e.size)?y(e,i):new u(0,0,0,0));return n}(e,s,o)),s.x+=o.x+r;s.x=r,s.y+=o.y+r}return n}const v=(e,t)=>0===t.w?e:t;var _={};_=new URL("../"+i("kyEFX").resolve("5x25J"),import.meta.url).toString();var b={};b=new URL("../"+i("kyEFX").resolve("7DZNl"),import.meta.url).toString();var E={};E=new URL("../"+i("kyEFX").resolve("cKQNC"),import.meta.url).toString(),async function(){let e=new l(new c(128,128)),t=await w(new URL(_).toString()),r=await w(new URL(b).toString()),n=Object.fromEntries(function*(...e){let t=e.map(e=>e[Symbol.iterator]());for(;;){let e=t.map(e=>e.next());if(e.some(e=>e.done))return;yield e.map(e=>e.value)}}('ABCDEFGHIJKLMNOPQRSTUVWXYZ()[]{}0123456789+-*/.,:;<>=?"#$%&!@^_~',g(await w(new URL(E).toString()),new c(16,4),1))),i=function(e,t){let r={};for(let[n,i]of Object.entries(e))r[n]=t(i);return r}(n,e=>{let t=new l(c.add(e.size,new c(2,2))),r=[new c(-1,-1),new c(0,-1),new c(1,-1),new c(-1,0),new c(1,0),new c(-1,1),new c(0,1),new c(1,1)],n=new c;return p(t,t=>r.some(r=>(c.add(t,r,n),c.sub(n,c.one,n),!!c.inBounds(n,e.size)&&y(e,n).w>0))?u.one:u.zero),t}),z=g(r,new c(8,2)),A=z[2],B=function(e){let t=document.querySelector("#c"),r=t.getContext("webgl2",{alpha:!1});return r.enable(r.BLEND),r.blendFunc(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA),r.clearColor(.5,.5,.75,1),o.resizeCanvasToDisplaySize(t),r.viewport(0,0,r.drawingBufferWidth,r.drawingBufferHeight),r}(0);B.canvas.width=e.size.x,B.canvas.height=e.size.y,B.viewport(0,0,B.drawingBufferWidth,B.drawingBufferHeight);let R=o.createTexture(B,{mag:B.NEAREST,min:B.LINEAR,format:B.RGBA,width:e.size.x,height:e.size.y,type:B.UNSIGNED_BYTE,src:e.data}),L=o.createProgramInfo(B,[`#version 300 es

    in vec2 a_pos;
    in vec2 a_uv;

    out vec2 v_uv;

    void main() {
        v_uv = a_uv;
        gl_Position = vec4(a_pos, 0.0, 1.0);
    }
    `,`#version 300 es
    precision highp float;

    in vec2 v_uv;
    
    uniform sampler2D u_tex;

    out vec4 out_color;
    void main() {
        out_color = texture(u_tex, v_uv);
    }
    `]),F=o.createBufferInfoFromArrays(B,{a_pos:{data:[-1,-1,1,1,-1,1,-1,-1,1,-1,1,1],numComponents:2},a_uv:{data:[0,1,1,0,0,0,0,1,1,1,1,0],numComponents:2}}),S=o.createVertexArrayInfo(B,L,F),H={cur_pos:new c(0,0)};window.addEventListener("mousemove",t=>{let r;c.set(H.cur_pos,t.clientX,t.clientY),c.div(H.cur_pos,(r=B.canvas,new c(r.clientWidth,r.clientHeight)),H.cur_pos),c.mul(H.cur_pos,e.size,H.cur_pos),c.map1(H.cur_pos,e=>Math.floor(e),H.cur_pos),c.map2(H.cur_pos,e.size,(e,t)=>s(e,0,t-1),H.cur_pos)});let C=new h(()=>({cur_pressed:!1,prev_pressed:!1}));function M(e){return C[e].cur_pressed&&!C[e].prev_pressed}window.addEventListener("keydown",e=>{C[e.code].cur_pressed=!0}),window.addEventListener("keyup",e=>{C[e.code].cur_pressed=!1});let I=new c(4,4),N=f.initV(I,e=>0+Math.floor(4*Math.random())),D=new c(0,0),O=new c(18,16),U=new l(O);p(U,e=>c.onBorder(e,O)?u.zero:a(e.x,1,O.x-1)&&a(e.y,1,O.y-1)?u.zero:u.fromHex("#C2C3C7")),requestAnimationFrame(function r(a){var l,w,h,f;B.clear(B.COLOR_BUFFER_BIT),c.add(D,new c((l=["ArrowLeft","KeyA"].some(M),w=["ArrowRight","KeyD"].some(M),l?w?0:-1:w?1:0),(h=["ArrowUp","KeyW"].some(M),f=["ArrowDown","KeyS"].some(M),h?f?0:-1:f?1:0)),D),c.map2(D,I,(e,t)=>s(e,0,t-1),D),p(e,e=>{let t=(e.x^e.y)%256;return new u(t,t,t,255)}),m(e,A,H.cur_pos,(e,t)=>t.w<128?e:t),function(e,t,r,n){c.round(t,t),c.round(r,r);let i=Math.abs(r.x-t.x),o=t.x<r.x?1:-1,s=-Math.abs(r.y-t.y),a=t.y<r.y?1:-1,u=i+s;for(;x(e,t,n),!c.equals(t,r);){let e=2*u;if(e>=s){if(t.x===r.x)break;u+=s,t.x+=o}if(e<=i){if(t.y===r.y)break;u+=i,t.y+=a}}}(e,new c(64,64),H.cur_pos,new u(255,0,0,255));let y="HELLO WORLD!";!function(t,r,o,s){let a=c.sub(r,new c(1,1));for(let r of t){if(" "!==r){if(!(r in n))throw Error(`char ${r} not avaliable on atlas`);m(e,i[r],a,v)}a.x+=4}!function(t,r,i){let o=c.copy(r);for(let r of t){if(" "!==r){if(!(r in n))throw Error(`char ${r} not avaliable on atlas`);m(e,n[r],o,v)}o.x+=4}}(t,r,0)}(y,new c(30*Math.sin(.005*a)+64-2*y.length,22),new u(255,128,255,255),new u(128,0,128,255));let g=d.fromParams({center:new c(64,64),size:c.mul(I,O)}).topLeft;N.forEachV((t,r)=>{let n=c.add(g,c.mul(t,O));if(c.equals(t,D)){let t=u.fromHex("#FF77A8");m(e,U,n,(e,r)=>r.w>0?t:e);let i=u.fromHex("#FF004D");m(e,z[r],c.add(n,new c(1,0)),(e,t)=>t.w>0?i:e),m(e,z[r],c.add(n,new c(1,Math.sin(.01*a)-2)),v)}else{m(e,U,n,v);let t=u.fromHex("#83769C");m(e,z[r],c.add(n,new c(1,0)),(e,r)=>r.w>0?t:e),m(e,z[r],c.add(n,new c(1,-1)),v)}});let _=c.add(g,c.mul(D,O));c.add(_,new c(14,12),_),(a%800+800)%800>650&&c.sub(_,c.one,_),m(e,t,_,v),o.setTextureFromArray(B,R,e.data),B.useProgram(L.program),o.setBuffersAndAttributes(B,L,S),o.setUniformsAndBindTextures(L,{u_tex:R}),o.drawBufferInfo(B,F),function(){for(let e in C)C[e].prev_pressed=C[e].cur_pressed}(),requestAnimationFrame(r)})}();
//# sourceMappingURL=index.e696a7f4.js.map
