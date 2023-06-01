function e(e,t,n,o){Object.defineProperty(e,t,{get:n,set:o,enumerable:!0,configurable:!0})}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},o={},r=t.parcelRequire94c2;null==r&&((r=function(e){if(e in n)return n[e].exports;if(e in o){var t=o[e];delete o[e];var r={id:e,exports:{}};return n[e]=r,t.call(r.exports,r,r.exports),r.exports}var i=Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,t){o[e]=t},t.parcelRequire94c2=r),r.register("kyEFX",function(t,n){"use strict";e(t.exports,"register",function(){return o},function(e){return o=e}),e(t.exports,"resolve",function(){return r},function(e){return r=e});var o,r,i={};o=function(e){for(var t=Object.keys(e),n=0;n<t.length;n++)i[t[n]]=e[t[n]]},r=function(e){var t=i[e];if(null==t)throw Error("Could not resolve bundle with id "+e);return t}}),r("kyEFX").register(JSON.parse('{"hzugU":"index.8d82ff1a.js","8oBKS":"sprite.c1d1c491.png","7J4eV":"index.81441363.js"}'));var i=r("amYBK"),a=new(function(e){return e&&e.__esModule?e.default:e}(function(){var e=function(){function t(e){return r.appendChild(e.dom),e}function n(e){for(var t=0;t<r.children.length;t++)r.children[t].style.display=t===e?"block":"none";o=e}var o=0,r=document.createElement("div");r.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",r.addEventListener("click",function(e){e.preventDefault(),n(++o%r.children.length)},!1);var i=(performance||Date).now(),a=i,l=0,s=t(new e.Panel("FPS","#0ff","#002")),c=t(new e.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var u=t(new e.Panel("MB","#f08","#201"));return n(0),{REVISION:16,dom:r,addPanel:t,showPanel:n,begin:function(){i=(performance||Date).now()},end:function(){l++;var e=(performance||Date).now();if(c.update(e-i,200),e>a+1e3&&(s.update(1e3*l/(e-a),100),a=e,l=0,u)){var t=performance.memory;u.update(t.usedJSHeapSize/1048576,t.jsHeapSizeLimit/1048576)}return e},update:function(){i=this.end()},domElement:r,setMode:n}};return e.Panel=function(e,t,n){var o=1/0,r=0,i=Math.round,a=i(window.devicePixelRatio||1),l=80*a,s=48*a,c=3*a,u=2*a,f=3*a,d=15*a,p=74*a,m=30*a,v=document.createElement("canvas");v.width=l,v.height=s,v.style.cssText="width:80px;height:48px";var h=v.getContext("2d");return h.font="bold "+9*a+"px Helvetica,Arial,sans-serif",h.textBaseline="top",h.fillStyle=n,h.fillRect(0,0,l,s),h.fillStyle=t,h.fillText(e,c,u),h.fillRect(f,d,p,m),h.fillStyle=n,h.globalAlpha=.9,h.fillRect(f,d,p,m),{dom:v,update:function(s,g){o=Math.min(o,s),r=Math.max(r,s),h.fillStyle=n,h.globalAlpha=1,h.fillRect(0,0,l,d),h.fillStyle=t,h.fillText(i(s)+" "+e+" ("+i(o)+"-"+i(r)+")",c,u),h.drawImage(v,f+a,d,p-a,m,f,d,p-a,m),h.fillRect(f+p-a,d,a,m),h.fillStyle=n,h.globalAlpha=.9,h.fillRect(f+p-a,d,a,i((1-s/g)*m))}}},e}()));a.showPanel(0),document.body.appendChild(a.dom);const l=document.querySelector("#c");l.width=1,l.height=1;const s=l.getContext("webgl2");s.clearColor(.5,.5,.75,1);const c=i.createProgramInfo(s,[`#version 300 es
    
    uniform vec2 u_resolution;
    
    // [0, 1]^2
    in vec2 a_vertex;

    // instancing
    in vec2 i_position;
    in vec2 i_size;

    out vec2 v_texcoord;

    void main() {
        // if size is 100 & screen is 400, then
        // clip space result width will be .5
        vec2 pos = 2.0 * a_vertex * i_size / u_resolution;

        // if position is 200 & screen is 400, then
        // clip space result offset will be .5
        pos += 2.0 * i_position / u_resolution;

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
    `]);let u=new Float32Array(2e3);for(let e=0;e<1e3;e++)u[2*e+0]=1e3*Math.random(),u[2*e+1]=1e3*Math.random();let f=new Float32Array(2e3);for(let e=0;e<1e3;e++)f[2*e+0]=100+50*Math.random(),f[2*e+1]=100+50*Math.random();const d=i.createBufferInfoFromArrays(s,{a_vertex:{data:[1,1,0,1,1,0,0,0,1,0,0,1],numComponents:2},i_position:{data:u,numComponents:2,divisor:1,drawType:s.DYNAMIC_DRAW},i_size:{data:f,numComponents:2,divisor:1,drawType:s.STATIC_DRAW}});var p={};p=new URL("../"+r("kyEFX").resolve("8oBKS"),import.meta.url).toString();const m=i.createTextures(s,{sprite_1:{src:new URL(p).toString()}});let v=0;requestAnimationFrame(function e(t){a.begin(),i.resizeCanvasToDisplaySize(l)&&(s.viewport(0,0,s.drawingBufferWidth,s.drawingBufferHeight),s.useProgram(c.program),i.setUniforms(c,{u_resolution:[s.canvas.width,s.canvas.height]}));let n=t-v;v=t;for(let e=0;e<1e3;e++){let t=u[2*e+0],o=u[2*e+1];u[2*e+0]=(t+n)%s.canvas.width,u[2*e+1]=(o+n)%s.canvas.height}s.clear(s.COLOR_BUFFER_BIT),i.setAttribInfoBufferFromArray(s,d.attribs.i_position,u),s.useProgram(c.program),i.setBuffersAndAttributes(s,c,d),i.setUniforms(c,{u_texture:m.sprite_1,u_resolution:[s.canvas.width,s.canvas.height]}),i.drawBufferInfo(s,d,s.TRIANGLES,d.numElements,0,1e3),a.end(),requestAnimationFrame(e)});
//# sourceMappingURL=index.8d82ff1a.js.map
