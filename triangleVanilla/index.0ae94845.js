!function(){function e(e){return e&&e.__esModule?e.default:e}var t,r="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},i={},a=r.parcelRequire94c2;null==a&&((a=function(e){if(e in n)return n[e].exports;if(e in i){var t=i[e];delete i[e];var r={id:e,exports:{}};return n[e]=r,t.call(r.exports,r,r.exports),r.exports}var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,t){i[e]=t},r.parcelRequire94c2=a);var o=a("6MzNI"),l=a("9AT65"),c={},d=new(e(((t=function(){function e(e){return i.appendChild(e.dom),e}function r(e){for(var t=0;t<i.children.length;t++)i.children[t].style.display=t===e?"block":"none";n=e}var n=0,i=document.createElement("div");i.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",i.addEventListener("click",function(e){e.preventDefault(),r(++n%i.children.length)},!1);var a=(performance||Date).now(),o=a,l=0,c=e(new t.Panel("FPS","#0ff","#002")),d=e(new t.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var f=e(new t.Panel("MB","#f08","#201"));return r(0),{REVISION:16,dom:i,addPanel:e,showPanel:r,begin:function(){a=(performance||Date).now()},end:function(){l++;var e=(performance||Date).now();if(d.update(e-a,200),e>o+1e3&&(c.update(1e3*l/(e-o),100),o=e,l=0,f)){var t=performance.memory;f.update(t.usedJSHeapSize/1048576,t.jsHeapSizeLimit/1048576)}return e},update:function(){a=this.end()},domElement:i,setMode:r}}).Panel=function(e,t,r){var n=1/0,i=0,a=Math.round,o=a(window.devicePixelRatio||1),l=80*o,c=48*o,d=3*o,f=2*o,u=3*o,s=15*o,p=74*o,h=30*o,v=document.createElement("canvas");v.width=l,v.height=c,v.style.cssText="width:80px;height:48px";var m=v.getContext("2d");return m.font="bold "+9*o+"px Helvetica,Arial,sans-serif",m.textBaseline="top",m.fillStyle=r,m.fillRect(0,0,l,c),m.fillStyle=t,m.fillText(e,d,f),m.fillRect(u,s,p,h),m.fillStyle=r,m.globalAlpha=.9,m.fillRect(u,s,p,h),{dom:v,update:function(c,A){n=Math.min(n,c),i=Math.max(i,c),m.fillStyle=r,m.globalAlpha=1,m.fillRect(0,0,l,s),m.fillStyle=t,m.fillText(a(c)+" "+e+" ("+a(n)+"-"+a(i)+")",d,f),m.drawImage(v,u+o,s,p-o,h,u,s,p-o,h),m.fillRect(u+p-o,s,o,h),m.fillStyle=r,m.globalAlpha=.9,m.fillRect(u+p-o,s,o,a((1-c/A)*h))}}},t)));d.showPanel(0),document.body.appendChild(d.dom);let f=document.querySelector("#c"),u=f.getContext("webgl2",{alpha:!1});u.clearColor(.5,.5,.75,1),u.enable(u.BLEND),u.blendFunc(u.SRC_ALPHA,u.ONE_MINUS_SRC_ALPHA),o.resizeCanvasToDisplaySize(f),u.viewport(0,0,u.drawingBufferWidth,u.drawingBufferHeight);let s=`#version 300 es

    in vec2 a_position;

    out vec3 v_col;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_col = vec3(a_position, 1.0);
    }
`,p=`#version 300 es
    precision highp float;

    in vec3 v_col;

    uniform vec3 u_tint;
    
    out vec4 out_color;
    void main() {
        out_color = vec4(v_col * u_tint, 1);
    }
`,h=u.createShader(u.VERTEX_SHADER),v=u.createShader(u.FRAGMENT_SHADER);u.shaderSource(h,s),u.compileShader(h),u.shaderSource(v,p),u.compileShader(v);let m=u.createProgram();u.attachShader(m,h),u.attachShader(m,v),u.linkProgram(m);let A=u.getAttribLocation(m,"a_position"),g=u.getUniformLocation(m,"u_tint"),S=u.createBuffer();u.bindBuffer(u.ARRAY_BUFFER,S),u.bufferData(u.ARRAY_BUFFER,new Float32Array([0,0,0,.8,.5,0]),u.STATIC_DRAW);var _=u.createVertexArray();u.bindVertexArray(_),u.enableVertexAttribArray(A);var w=u.FLOAT;u.vertexAttribPointer(A,2,w,!1,0,0),requestAnimationFrame(function t(r){d.update(),o.resizeCanvasToDisplaySize(f)&&u.viewport(0,0,u.drawingBufferWidth,u.drawingBufferHeight),u.clear(u.COLOR_BUFFER_BIT);let n=e(l)({h:.1*r%360,s:100,v:100}).unitArray();u.useProgram(m),u.bindVertexArray(_),u.uniform3f(g,n[0],n[1],n[2]),u.drawArrays(u.TRIANGLES,0,3),requestAnimationFrame(t)})}();
//# sourceMappingURL=index.0ae94845.js.map
