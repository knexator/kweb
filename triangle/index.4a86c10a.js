!function(){function e(e){return e&&e.__esModule?e.default:e}var n,t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o={},i={},r=t.parcelRequire94c2;null==r&&((r=function(e){if(e in o)return o[e].exports;if(e in i){var n=i[e];delete i[e];var t={id:e,exports:{}};return o[e]=t,n.call(t.exports,t,t.exports),t.exports}var r=Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,n){i[e]=n},t.parcelRequire94c2=r);var l=r("6MzNI"),a=r("9AT65"),f={},c=new(e(((n=function(){function e(e){return i.appendChild(e.dom),e}function t(e){for(var n=0;n<i.children.length;n++)i.children[n].style.display=n===e?"block":"none";o=e}var o=0,i=document.createElement("div");i.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",i.addEventListener("click",function(e){e.preventDefault(),t(++o%i.children.length)},!1);var r=(performance||Date).now(),l=r,a=0,f=e(new n.Panel("FPS","#0ff","#002")),c=e(new n.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var d=e(new n.Panel("MB","#f08","#201"));return t(0),{REVISION:16,dom:i,addPanel:e,showPanel:t,begin:function(){r=(performance||Date).now()},end:function(){a++;var e=(performance||Date).now();if(c.update(e-r,200),e>l+1e3&&(f.update(1e3*a/(e-l),100),l=e,a=0,d)){var n=performance.memory;d.update(n.usedJSHeapSize/1048576,n.jsHeapSizeLimit/1048576)}return e},update:function(){r=this.end()},domElement:i,setMode:t}}).Panel=function(e,n,t){var o=1/0,i=0,r=Math.round,l=r(window.devicePixelRatio||1),a=80*l,f=48*l,c=3*l,d=2*l,u=3*l,s=15*l,p=74*l,m=30*l,v=document.createElement("canvas");v.width=a,v.height=f,v.style.cssText="width:80px;height:48px";var h=v.getContext("2d");return h.font="bold "+9*l+"px Helvetica,Arial,sans-serif",h.textBaseline="top",h.fillStyle=t,h.fillRect(0,0,a,f),h.fillStyle=n,h.fillText(e,c,d),h.fillRect(u,s,p,m),h.fillStyle=t,h.globalAlpha=.9,h.fillRect(u,s,p,m),{dom:v,update:function(f,g){o=Math.min(o,f),i=Math.max(i,f),h.fillStyle=t,h.globalAlpha=1,h.fillRect(0,0,a,s),h.fillStyle=n,h.fillText(r(f)+" "+e+" ("+r(o)+"-"+r(i)+")",c,d),h.drawImage(v,u+l,s,p-l,m,u,s,p-l,m),h.fillRect(u+p-l,s,l,m),h.fillStyle=t,h.globalAlpha=.9,h.fillRect(u+p-l,s,l,r((1-f/g)*m))}}},n)));c.showPanel(0),document.body.appendChild(c.dom);let d=document.querySelector("#c"),u=d.getContext("webgl2");u.clearColor(.5,.5,.75,1),u.enable(u.BLEND),u.blendFunc(u.SRC_ALPHA,u.ONE_MINUS_SRC_ALPHA),l.resizeCanvasToDisplaySize(d),u.viewport(0,0,u.drawingBufferWidth,u.drawingBufferHeight);let s=l.createProgramInfo(u,[`#version 300 es

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
    `]),p=l.createBufferInfoFromArrays(u,{a_position:{data:[0,0,0,.8,.5,0],numComponents:2}}),m=l.createVertexArrayInfo(u,s,p);console.log(s),console.log(p),console.log(m),requestAnimationFrame(function n(t){c.update(),l.resizeCanvasToDisplaySize(d)&&u.viewport(0,0,u.drawingBufferWidth,u.drawingBufferHeight),u.clear(u.COLOR_BUFFER_BIT);let o=e(a)({h:.1*t%360,s:100,v:100});u.useProgram(s.program),l.setBuffersAndAttributes(u,s,m),l.setUniformsAndBindTextures(s,{u_tint:o.unitArray()}),l.drawBufferInfo(u,p),requestAnimationFrame(n)})}();
//# sourceMappingURL=index.4a86c10a.js.map
