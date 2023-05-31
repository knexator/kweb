var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},r={},n={},t=e.parcelRequire94c2;null==t&&((t=function(e){if(e in r)return r[e].exports;if(e in n){var t=n[e];delete n[e];var o={id:e,exports:{}};return r[e]=o,t.call(o.exports,o,o.exports),o.exports}var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,r){n[e]=r},e.parcelRequire94c2=t);var o=t("amYBK"),a=new(function(e){return e&&e.__esModule?e.default:e}(function(){var e=function(){function r(e){return o.appendChild(e.dom),e}function n(e){for(var r=0;r<o.children.length;r++)o.children[r].style.display=r===e?"block":"none";t=e}var t=0,o=document.createElement("div");o.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",o.addEventListener("click",function(e){e.preventDefault(),n(++t%o.children.length)},!1);var a=(performance||Date).now(),i=a,l=0,f=r(new e.Panel("FPS","#0ff","#002")),s=r(new e.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var d=r(new e.Panel("MB","#f08","#201"));return n(0),{REVISION:16,dom:o,addPanel:r,showPanel:n,begin:function(){a=(performance||Date).now()},end:function(){l++;var e=(performance||Date).now();if(s.update(e-a,200),e>i+1e3&&(f.update(1e3*l/(e-i),100),i=e,l=0,d)){var r=performance.memory;d.update(r.usedJSHeapSize/1048576,r.jsHeapSizeLimit/1048576)}return e},update:function(){a=this.end()},domElement:o,setMode:n}};return e.Panel=function(e,r,n){var t=1/0,o=0,a=Math.round,i=a(window.devicePixelRatio||1),l=80*i,f=48*i,s=3*i,d=2*i,c=3*i,m=15*i,u=74*i,p=30*i,A=document.createElement("canvas");A.width=l,A.height=f,A.style.cssText="width:80px;height:48px";var y=A.getContext("2d");return y.font="bold "+9*i+"px Helvetica,Arial,sans-serif",y.textBaseline="top",y.fillStyle=n,y.fillRect(0,0,l,f),y.fillStyle=r,y.fillText(e,s,d),y.fillRect(c,m,u,p),y.fillStyle=n,y.globalAlpha=.9,y.fillRect(c,m,u,p),{dom:A,update:function(f,v){t=Math.min(t,f),o=Math.max(o,f),y.fillStyle=n,y.globalAlpha=1,y.fillRect(0,0,l,m),y.fillStyle=r,y.fillText(a(f)+" "+e+" ("+a(t)+"-"+a(o)+")",s,d),y.drawImage(A,c+i,m,u-i,p,c,m,u-i,p),y.fillRect(c+u-i,m,i,p),y.fillStyle=n,y.globalAlpha=.9,y.fillRect(c+u-i,m,i,a((1-f/v)*p))}}},e}()));a.showPanel(0),document.body.appendChild(a.dom);const i=`#version 300 es
in vec2 oldPosition;
in vec2 velocity;

uniform float deltaTime;
uniform vec2 canvasDimensions;

out vec2 newPosition;

vec2 euclideanModulo(vec2 n, vec2 m) {
    return mod(mod(n, m) + m, m);
}

void main() {
  newPosition = euclideanModulo(
      oldPosition + velocity * deltaTime,
      canvasDimensions);
}
`,l=`#version 300 es
precision highp float;
void main() {
}
`,f=`#version 300 es
in vec4 position;
uniform mat4 matrix;

void main() {
  // do the common matrix math
  gl_Position = matrix * position;
  gl_PointSize = 10.0;
}
`,s=`#version 300 es
precision highp float;
out vec4 outColor;
void main() {
  outColor = vec4(1, 0, 0, 1);
}
`,d=document.querySelector("#c"),c=d.getContext("webgl2");if(!c)throw Error("no webgl2");const m=o.createProgramInfo(c,[i,l],{transformFeedbackVaryings:["newPosition"],transformFeedbackMode:c.SEPARATE_ATTRIBS}),u=o.createProgramInfo(c,[f,s]);o.resizeCanvasToDisplaySize(c.canvas),c.viewport(0,0,c.canvas.width,c.canvas.height);const p=(e,r)=>(void 0===r&&(r=e,e=0),Math.random()*(r-e)+e),A=(e,r)=>Array(e).fill(0).map(e=>r.map(e=>p(...e))).flat(),y=new Float32Array(A(200,[[d.width],[d.height]])),v=new Float32Array(A(200,[[-300,300],[-300,300]])),h=o.createBufferFromTypedArray(c,y,c.ARRAY_BUFFER,c.DYNAMIC_DRAW),F=o.createBufferFromTypedArray(c,y,c.ARRAY_BUFFER,c.DYNAMIC_DRAW),w=o.createBufferFromTypedArray(c,v,c.ARRAY_BUFFER,c.STATIC_DRAW),R=o.createBufferInfoFromArrays(c,{oldPosition:{buffer:h,numComponents:2,type:Float32Array},velocity:{buffer:w,numComponents:2,type:Float32Array},newPosition:{buffer:F,numComponents:2,type:Float32Array}}),b=o.createVertexArrayInfo(c,m,R),T=o.createBufferInfoFromArrays(c,{oldPosition:{buffer:F,numComponents:2,type:Float32Array},velocity:{buffer:w,numComponents:2,type:Float32Array},newPosition:{buffer:h,numComponents:2,type:Float32Array}}),g=o.createVertexArrayInfo(c,m,T),x=o.createVertexArrayInfo(c,u,o.createBufferInfoFromArrays(c,{position:{buffer:h,numComponents:2,type:Float32Array}})),I=o.createVertexArrayInfo(c,u,o.createBufferInfoFromArrays(c,{position:{buffer:F,numComponents:2,type:Float32Array}})),P=o.createTransformFeedback(c,m,T),S=o.createTransformFeedback(c,m,R);c.bindBuffer(c.ARRAY_BUFFER,null);let C={updateVAI:b,tf:S,drawVAI:I},E={updateVAI:g,tf:P,drawVAI:x},B=0;requestAnimationFrame(function e(r){a.update(),r*=.001;let n=r-B;B=r,o.resizeCanvasToDisplaySize(c.canvas)&&c.viewport(0,0,c.canvas.width,c.canvas.height),c.clear(c.COLOR_BUFFER_BIT),c.useProgram(m.program),c.bindVertexArray(C.updateVAI.vertexArrayObject),o.setUniformsAndBindTextures(m,{canvasDimensions:[c.canvas.width,c.canvas.height],deltaTime:n}),c.enable(c.RASTERIZER_DISCARD),c.bindTransformFeedback(c.TRANSFORM_FEEDBACK,C.tf),c.beginTransformFeedback(c.POINTS),c.drawArrays(c.POINTS,0,200),c.endTransformFeedback(),c.bindTransformFeedback(c.TRANSFORM_FEEDBACK,null),c.disable(c.RASTERIZER_DISCARD),c.useProgram(u.program),c.bindVertexArray(C.drawVAI.vertexArrayObject),o.setUniformsAndBindTextures(u,{matrix:o.m4.ortho(0,c.canvas.width,0,c.canvas.height,-1,1)}),c.drawArrays(c.POINTS,0,200);{let e=C;C=E,E=e}requestAnimationFrame(e)});
//# sourceMappingURL=index.66b2bde2.js.map
