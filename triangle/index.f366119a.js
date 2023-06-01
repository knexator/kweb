function e(e){return e&&e.__esModule?e.default:e}var n="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},o={},i=n.parcelRequire94c2;null==i&&((i=function(e){if(e in t)return t[e].exports;if(e in o){var n=o[e];delete o[e];var i={id:e,exports:{}};return t[e]=i,n.call(i.exports,i,i.exports),i.exports}var r=Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,n){o[e]=n},n.parcelRequire94c2=i);var r=i("amYBK"),l=i("0FWmF"),a=new(e(function(){var e=function(){function n(e){return i.appendChild(e.dom),e}function t(e){for(var n=0;n<i.children.length;n++)i.children[n].style.display=n===e?"block":"none";o=e}var o=0,i=document.createElement("div");i.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",i.addEventListener("click",function(e){e.preventDefault(),t(++o%i.children.length)},!1);var r=(performance||Date).now(),l=r,a=0,f=n(new e.Panel("FPS","#0ff","#002")),c=n(new e.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var d=n(new e.Panel("MB","#f08","#201"));return t(0),{REVISION:16,dom:i,addPanel:n,showPanel:t,begin:function(){r=(performance||Date).now()},end:function(){a++;var e=(performance||Date).now();if(c.update(e-r,200),e>l+1e3&&(f.update(1e3*a/(e-l),100),l=e,a=0,d)){var n=performance.memory;d.update(n.usedJSHeapSize/1048576,n.jsHeapSizeLimit/1048576)}return e},update:function(){r=this.end()},domElement:i,setMode:t}};return e.Panel=function(e,n,t){var o=1/0,i=0,r=Math.round,l=r(window.devicePixelRatio||1),a=80*l,f=48*l,c=3*l,d=2*l,u=3*l,s=15*l,p=74*l,m=30*l,v=document.createElement("canvas");v.width=a,v.height=f,v.style.cssText="width:80px;height:48px";var h=v.getContext("2d");return h.font="bold "+9*l+"px Helvetica,Arial,sans-serif",h.textBaseline="top",h.fillStyle=t,h.fillRect(0,0,a,f),h.fillStyle=n,h.fillText(e,c,d),h.fillRect(u,s,p,m),h.fillStyle=t,h.globalAlpha=.9,h.fillRect(u,s,p,m),{dom:v,update:function(f,g){o=Math.min(o,f),i=Math.max(i,f),h.fillStyle=t,h.globalAlpha=1,h.fillRect(0,0,a,s),h.fillStyle=n,h.fillText(r(f)+" "+e+" ("+r(o)+"-"+r(i)+")",c,d),h.drawImage(v,u+l,s,p-l,m,u,s,p-l,m),h.fillRect(u+p-l,s,l,m),h.fillStyle=t,h.globalAlpha=.9,h.fillRect(u+p-l,s,l,r((1-f/g)*m))}}},e}()));a.showPanel(0),document.body.appendChild(a.dom);const f=document.querySelector("#c"),c=f.getContext("webgl2");c.clearColor(.5,.5,.75,1),c.enable(c.BLEND),c.blendFunc(c.SRC_ALPHA,c.ONE_MINUS_SRC_ALPHA),r.resizeCanvasToDisplaySize(f),c.viewport(0,0,c.drawingBufferWidth,c.drawingBufferHeight);const d=r.createProgramInfo(c,[`#version 300 es

    in vec2 a_position;

    out vec3 v_col;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_col = vec3(a_position, 1.0);
    }
    `,`#version 300 es
    precision highp float;

    in vec3 v_col;

    uniform vec3 u_tint;

    out vec4 out_color;
    void main() {
        out_color = vec4(v_col * u_tint, 1);
    }
    `]),u=r.createBufferInfoFromArrays(c,{a_position:{data:[0,0,0,.8,.5,0],numComponents:2}}),s=r.createVertexArrayInfo(c,d,u);console.log(d),console.log(u),console.log(s),requestAnimationFrame(function n(t){a.update(),r.resizeCanvasToDisplaySize(f)&&c.viewport(0,0,c.drawingBufferWidth,c.drawingBufferHeight),c.clear(c.COLOR_BUFFER_BIT);let o=e(l)({h:.1*t%360,s:100,v:100});c.useProgram(d.program),r.setBuffersAndAttributes(c,d,s),r.setUniformsAndBindTextures(d,{u_tint:o.unitArray()}),r.drawBufferInfo(c,u),requestAnimationFrame(n)});
//# sourceMappingURL=index.f366119a.js.map
