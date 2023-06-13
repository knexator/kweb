!function(){function e(e,t,r,n){Object.defineProperty(e,t,{get:r,set:n,enumerable:!0,configurable:!0})}var t,r,n="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o={},i={},a=n.parcelRequire94c2;null==a&&((a=function(e){if(e in o)return o[e].exports;if(e in i){var t=i[e];delete i[e];var r={id:e,exports:{}};return o[e]=r,t.call(r.exports,r,r.exports),r.exports}var n=Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}).register=function(e,t){i[e]=t},n.parcelRequire94c2=a),a.register("iE7OH",function(t,r){"use strict";e(t.exports,"register",function(){return n},function(e){return n=e}),e(t.exports,"resolve",function(){return o},function(e){return o=e});var n,o,i={};n=function(e){for(var t=Object.keys(e),r=0;r<t.length;r++)i[t[r]]=e[t[r]]},o=function(e){var t=i[e];if(null==t)throw Error("Could not resolve bundle with id "+e);return t}}),a.register("aNJCr",function(t,r){e(t.exports,"getBundleURL",function(){return n},function(e){return n=e});"use strict";var n,o={};n=function(e){var t=o[e];return t||(t=function(){try{throw Error()}catch(t){var e=(""+t.stack).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^)\n]+/g);if(e)return(""+e[2]).replace(/^((?:https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/.+)\/[^/]+$/,"$1")+"/"}return"/"}(),o[e]=t),t}}),a("iE7OH").register(JSON.parse('{"6AQrP":"index.43afd494.js","6ARMr":"sprite.c1d1c491.png","F43bv":"index.e022d464.js"}'));var l=a("6MzNI"),s={},c=new(((t=function(){function e(e){return o.appendChild(e.dom),e}function r(e){for(var t=0;t<o.children.length;t++)o.children[t].style.display=t===e?"block":"none";n=e}var n=0,o=document.createElement("div");o.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",o.addEventListener("click",function(e){e.preventDefault(),r(++n%o.children.length)},!1);var i=(performance||Date).now(),a=i,l=0,s=e(new t.Panel("FPS","#0ff","#002")),c=e(new t.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var f=e(new t.Panel("MB","#f08","#201"));return r(0),{REVISION:16,dom:o,addPanel:e,showPanel:r,begin:function(){i=(performance||Date).now()},end:function(){l++;var e=(performance||Date).now();if(c.update(e-i,200),e>a+1e3&&(s.update(1e3*l/(e-a),100),a=e,l=0,f)){var t=performance.memory;f.update(t.usedJSHeapSize/1048576,t.jsHeapSizeLimit/1048576)}return e},update:function(){i=this.end()},domElement:o,setMode:r}}).Panel=function(e,t,r){var n=1/0,o=0,i=Math.round,a=i(window.devicePixelRatio||1),l=80*a,s=48*a,c=3*a,f=2*a,u=3*a,d=15*a,p=74*a,m=30*a,v=document.createElement("canvas");v.width=l,v.height=s,v.style.cssText="width:80px;height:48px";var h=v.getContext("2d");return h.font="bold "+9*a+"px Helvetica,Arial,sans-serif",h.textBaseline="top",h.fillStyle=r,h.fillRect(0,0,l,s),h.fillStyle=t,h.fillText(e,c,f),h.fillRect(u,d,p,m),h.fillStyle=r,h.globalAlpha=.9,h.fillRect(u,d,p,m),{dom:v,update:function(s,g){n=Math.min(n,s),o=Math.max(o,s),h.fillStyle=r,h.globalAlpha=1,h.fillRect(0,0,l,d),h.fillStyle=t,h.fillText(i(s)+" "+e+" ("+i(n)+"-"+i(o)+")",c,f),h.drawImage(v,u+a,d,p-a,m,u,d,p-a,m),h.fillRect(u+p-a,d,a,m),h.fillStyle=r,h.globalAlpha=.9,h.fillRect(u+p-a,d,a,i((1-s/g)*m))}}},(r=t)&&r.__esModule)?r.default:r);c.showPanel(0),document.body.appendChild(c.dom);let f=document.querySelector("#c");f.width=1,f.height=1;let u=f.getContext("webgl2");u.clearColor(.5,.5,.75,1);let d=l.createProgramInfo(u,[`#version 300 es
    
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
    `]),p=new Float32Array(2e3);for(let e=0;e<1e3;e++)p[2*e+0]=1e3*Math.random(),p[2*e+1]=1e3*Math.random();let m=new Float32Array(2e3);for(let e=0;e<1e3;e++)m[2*e+0]=100+50*Math.random(),m[2*e+1]=100+50*Math.random();let v=l.createBufferInfoFromArrays(u,{a_vertex:{data:[1,1,0,1,1,0,0,0,1,0,0,1],numComponents:2},i_position:{data:p,numComponents:2,divisor:1,drawType:u.DYNAMIC_DRAW},i_size:{data:m,numComponents:2,divisor:1,drawType:u.STATIC_DRAW}});var h={};h=a("aNJCr").getBundleURL("6AQrP")+"../"+a("iE7OH").resolve("6ARMr");let g=l.createTextures(u,{sprite_1:{src:new URL(h).toString()}}),w=0;requestAnimationFrame(function e(t){c.begin(),l.resizeCanvasToDisplaySize(f)&&(u.viewport(0,0,u.drawingBufferWidth,u.drawingBufferHeight),u.useProgram(d.program),l.setUniforms(d,{u_resolution:[u.canvas.width,u.canvas.height]}));let r=t-w;w=t;for(let e=0;e<1e3;e++){let t=p[2*e+0],n=p[2*e+1];p[2*e+0]=(t+r)%u.canvas.width,p[2*e+1]=(n+r)%u.canvas.height}u.clear(u.COLOR_BUFFER_BIT),l.setAttribInfoBufferFromArray(u,v.attribs.i_position,p),u.useProgram(d.program),l.setBuffersAndAttributes(u,d,v),l.setUniforms(d,{u_texture:g.sprite_1,u_resolution:[u.canvas.width,u.canvas.height]}),l.drawBufferInfo(u,v,u.TRIANGLES,v.numElements,0,1e3),c.end(),requestAnimationFrame(e)})}();
//# sourceMappingURL=index.43afd494.js.map
