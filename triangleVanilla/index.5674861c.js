function e(e){return e&&e.__esModule?e.default:e}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},r={},n={},i=t.parcelRequire94c2;null==i&&((i=function(e){if(e in r)return r[e].exports;if(e in n){var t=n[e];delete n[e];var i={id:e,exports:{}};return r[e]=i,t.call(i.exports,i,i.exports),i.exports}var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,t){n[e]=t},t.parcelRequire94c2=i);var a=i("amYBK"),o=i("0FWmF"),l=new(e(function(){var e=function(){function t(e){return i.appendChild(e.dom),e}function r(e){for(var t=0;t<i.children.length;t++)i.children[t].style.display=t===e?"block":"none";n=e}var n=0,i=document.createElement("div");i.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",i.addEventListener("click",function(e){e.preventDefault(),r(++n%i.children.length)},!1);var a=(performance||Date).now(),o=a,l=0,c=t(new e.Panel("FPS","#0ff","#002")),d=t(new e.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var f=t(new e.Panel("MB","#f08","#201"));return r(0),{REVISION:16,dom:i,addPanel:t,showPanel:r,begin:function(){a=(performance||Date).now()},end:function(){l++;var e=(performance||Date).now();if(d.update(e-a,200),e>o+1e3&&(c.update(1e3*l/(e-o),100),o=e,l=0,f)){var t=performance.memory;f.update(t.usedJSHeapSize/1048576,t.jsHeapSizeLimit/1048576)}return e},update:function(){a=this.end()},domElement:i,setMode:r}};return e.Panel=function(e,t,r){var n=1/0,i=0,a=Math.round,o=a(window.devicePixelRatio||1),l=80*o,c=48*o,d=3*o,f=2*o,u=3*o,s=15*o,p=74*o,v=30*o,h=document.createElement("canvas");h.width=l,h.height=c,h.style.cssText="width:80px;height:48px";var m=h.getContext("2d");return m.font="bold "+9*o+"px Helvetica,Arial,sans-serif",m.textBaseline="top",m.fillStyle=r,m.fillRect(0,0,l,c),m.fillStyle=t,m.fillText(e,d,f),m.fillRect(u,s,p,v),m.fillStyle=r,m.globalAlpha=.9,m.fillRect(u,s,p,v),{dom:h,update:function(c,A){n=Math.min(n,c),i=Math.max(i,c),m.fillStyle=r,m.globalAlpha=1,m.fillRect(0,0,l,s),m.fillStyle=t,m.fillText(a(c)+" "+e+" ("+a(n)+"-"+a(i)+")",d,f),m.drawImage(h,u+o,s,p-o,v,u,s,p-o,v),m.fillRect(u+p-o,s,o,v),m.fillStyle=r,m.globalAlpha=.9,m.fillRect(u+p-o,s,o,a((1-c/A)*v))}}},e}()));l.showPanel(0),document.body.appendChild(l.dom);const c=document.querySelector("#c"),d=c.getContext("webgl2",{alpha:!1});d.clearColor(.5,.5,.75,1),d.enable(d.BLEND),d.blendFunc(d.SRC_ALPHA,d.ONE_MINUS_SRC_ALPHA),a.resizeCanvasToDisplaySize(c),d.viewport(0,0,d.drawingBufferWidth,d.drawingBufferHeight);const f=`#version 300 es

    in vec2 a_position;

    out vec3 v_col;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_col = vec3(a_position, 1.0);
    }
`,u=`#version 300 es
    precision highp float;

    in vec3 v_col;

    uniform vec3 u_tint;
    
    out vec4 out_color;
    void main() {
        out_color = vec4(v_col * u_tint, 1);
    }
`;let s=d.createShader(d.VERTEX_SHADER),p=d.createShader(d.FRAGMENT_SHADER);d.shaderSource(s,f),d.compileShader(s),d.shaderSource(p,u),d.compileShader(p);let v=d.createProgram();d.attachShader(v,s),d.attachShader(v,p),d.linkProgram(v);let h=d.getAttribLocation(v,"a_position"),m=d.getUniformLocation(v,"u_tint"),A=d.createBuffer();d.bindBuffer(d.ARRAY_BUFFER,A),d.bufferData(d.ARRAY_BUFFER,new Float32Array([0,0,0,.8,.5,0]),d.STATIC_DRAW);var g=d.createVertexArray();d.bindVertexArray(g),d.enableVertexAttribArray(h);var S=d.FLOAT;d.vertexAttribPointer(h,2,S,!1,0,0),requestAnimationFrame(function t(r){l.update(),a.resizeCanvasToDisplaySize(c)&&d.viewport(0,0,d.drawingBufferWidth,d.drawingBufferHeight),d.clear(d.COLOR_BUFFER_BIT);let n=e(o)({h:.1*r%360,s:100,v:100}).unitArray();d.useProgram(v),d.bindVertexArray(g),d.uniform3f(m,n[0],n[1],n[2]),d.drawArrays(d.TRIANGLES,0,3),requestAnimationFrame(t)});
//# sourceMappingURL=index.5674861c.js.map
