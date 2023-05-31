!function(){var e,r,n="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},o={},a=n.parcelRequire94c2;null==a&&((a=function(e){if(e in t)return t[e].exports;if(e in o){var r=o[e];delete o[e];var n={id:e,exports:{}};return t[e]=n,r.call(n.exports,n,n.exports),n.exports}var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,r){o[e]=r},n.parcelRequire94c2=a);var i=a("6MzNI"),l={},f=new(((e=function(){function r(e){return o.appendChild(e.dom),e}function n(e){for(var r=0;r<o.children.length;r++)o.children[r].style.display=r===e?"block":"none";t=e}var t=0,o=document.createElement("div");o.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",o.addEventListener("click",function(e){e.preventDefault(),n(++t%o.children.length)},!1);var a=(performance||Date).now(),i=a,l=0,f=r(new e.Panel("FPS","#0ff","#002")),s=r(new e.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var d=r(new e.Panel("MB","#f08","#201"));return n(0),{REVISION:16,dom:o,addPanel:r,showPanel:n,begin:function(){a=(performance||Date).now()},end:function(){l++;var e=(performance||Date).now();if(s.update(e-a,200),e>i+1e3&&(f.update(1e3*l/(e-i),100),i=e,l=0,d)){var r=performance.memory;d.update(r.usedJSHeapSize/1048576,r.jsHeapSizeLimit/1048576)}return e},update:function(){a=this.end()},domElement:o,setMode:n}}).Panel=function(e,r,n){var t=1/0,o=0,a=Math.round,i=a(window.devicePixelRatio||1),l=80*i,f=48*i,s=3*i,d=2*i,c=3*i,m=15*i,u=74*i,p=30*i,A=document.createElement("canvas");A.width=l,A.height=f,A.style.cssText="width:80px;height:48px";var y=A.getContext("2d");return y.font="bold "+9*i+"px Helvetica,Arial,sans-serif",y.textBaseline="top",y.fillStyle=n,y.fillRect(0,0,l,f),y.fillStyle=r,y.fillText(e,s,d),y.fillRect(c,m,u,p),y.fillStyle=n,y.globalAlpha=.9,y.fillRect(c,m,u,p),{dom:A,update:function(f,v){t=Math.min(t,f),o=Math.max(o,f),y.fillStyle=n,y.globalAlpha=1,y.fillRect(0,0,l,m),y.fillStyle=r,y.fillText(a(f)+" "+e+" ("+a(t)+"-"+a(o)+")",s,d),y.drawImage(A,c+i,m,u-i,p,c,m,u-i,p),y.fillRect(c+u-i,m,i,p),y.fillStyle=n,y.globalAlpha=.9,y.fillRect(c+u-i,m,i,a((1-f/v)*p))}}},(r=e)&&r.__esModule)?r.default:r);f.showPanel(0),document.body.appendChild(f.dom);let s=`#version 300 es
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
`,d=`#version 300 es
precision highp float;
void main() {
}
`,c=`#version 300 es
in vec4 position;
uniform mat4 matrix;

void main() {
  // do the common matrix math
  gl_Position = matrix * position;
  gl_PointSize = 10.0;
}
`,m=`#version 300 es
precision highp float;
out vec4 outColor;
void main() {
  outColor = vec4(1, 0, 0, 1);
}
`,u=document.querySelector("#c"),p=u.getContext("webgl2");if(!p)throw Error("no webgl2");let A=i.createProgramInfo(p,[s,d],{transformFeedbackVaryings:["newPosition"],transformFeedbackMode:p.SEPARATE_ATTRIBS}),y=i.createProgramInfo(p,[c,m]);i.resizeCanvasToDisplaySize(p.canvas),p.viewport(0,0,p.canvas.width,p.canvas.height);let v=(e,r)=>(void 0===r&&(r=e,e=0),Math.random()*(r-e)+e),h=(e,r)=>Array(e).fill(0).map(e=>r.map(e=>v(...e))).flat(),F=new Float32Array(h(200,[[u.width],[u.height]])),w=new Float32Array(h(200,[[-300,300],[-300,300]])),R=i.createBufferFromTypedArray(p,F,p.ARRAY_BUFFER,p.DYNAMIC_DRAW),b=i.createBufferFromTypedArray(p,F,p.ARRAY_BUFFER,p.DYNAMIC_DRAW),T=i.createBufferFromTypedArray(p,w,p.ARRAY_BUFFER,p.STATIC_DRAW),g=i.createBufferInfoFromArrays(p,{oldPosition:{buffer:R,numComponents:2,type:Float32Array},velocity:{buffer:T,numComponents:2,type:Float32Array},newPosition:{buffer:b,numComponents:2,type:Float32Array}}),x=i.createVertexArrayInfo(p,A,g),I=i.createBufferInfoFromArrays(p,{oldPosition:{buffer:b,numComponents:2,type:Float32Array},velocity:{buffer:T,numComponents:2,type:Float32Array},newPosition:{buffer:R,numComponents:2,type:Float32Array}}),P=i.createVertexArrayInfo(p,A,I),S=i.createVertexArrayInfo(p,y,i.createBufferInfoFromArrays(p,{position:{buffer:R,numComponents:2,type:Float32Array}})),C=i.createVertexArrayInfo(p,y,i.createBufferInfoFromArrays(p,{position:{buffer:b,numComponents:2,type:Float32Array}})),E=i.createTransformFeedback(p,A,I),D=i.createTransformFeedback(p,A,g);p.bindBuffer(p.ARRAY_BUFFER,null);let B={updateVAI:x,tf:D,drawVAI:C},_={updateVAI:P,tf:E,drawVAI:S},M=0;requestAnimationFrame(function e(r){f.update(),r*=.001;let n=r-M;M=r,i.resizeCanvasToDisplaySize(p.canvas)&&p.viewport(0,0,p.canvas.width,p.canvas.height),p.clear(p.COLOR_BUFFER_BIT),p.useProgram(A.program),p.bindVertexArray(B.updateVAI.vertexArrayObject),i.setUniformsAndBindTextures(A,{canvasDimensions:[p.canvas.width,p.canvas.height],deltaTime:n}),p.enable(p.RASTERIZER_DISCARD),p.bindTransformFeedback(p.TRANSFORM_FEEDBACK,B.tf),p.beginTransformFeedback(p.POINTS),p.drawArrays(p.POINTS,0,200),p.endTransformFeedback(),p.bindTransformFeedback(p.TRANSFORM_FEEDBACK,null),p.disable(p.RASTERIZER_DISCARD),p.useProgram(y.program),p.bindVertexArray(B.drawVAI.vertexArrayObject),i.setUniformsAndBindTextures(y,{matrix:i.m4.ortho(0,p.canvas.width,0,p.canvas.height,-1,1)}),p.drawArrays(p.POINTS,0,200);{let e=B;B=_,_=e}requestAnimationFrame(e)})}();
//# sourceMappingURL=index.aa7d888e.js.map
