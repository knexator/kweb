var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o={},t={},n=e.parcelRequire94c2;null==n&&((n=function(e){if(e in o)return o[e].exports;if(e in t){var n=t[e];delete t[e];var r={id:e,exports:{}};return o[e]=r,n.call(r.exports,r,r.exports),r.exports}var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,o){t[e]=o},e.parcelRequire94c2=n);var r=n("amYBK"),a=new(function(e){return e&&e.__esModule?e.default:e}(function(){var e=function(){function o(e){return r.appendChild(e.dom),e}function t(e){for(var o=0;o<r.children.length;o++)r.children[o].style.display=o===e?"block":"none";n=e}var n=0,r=document.createElement("div");r.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",r.addEventListener("click",function(e){e.preventDefault(),t(++n%r.children.length)},!1);var a=(performance||Date).now(),l=a,i=0,s=o(new e.Panel("FPS","#0ff","#002")),d=o(new e.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var f=o(new e.Panel("MB","#f08","#201"));return t(0),{REVISION:16,dom:r,addPanel:o,showPanel:t,begin:function(){a=(performance||Date).now()},end:function(){i++;var e=(performance||Date).now();if(d.update(e-a,200),e>l+1e3&&(s.update(1e3*i/(e-l),100),l=e,i=0,f)){var o=performance.memory;f.update(o.usedJSHeapSize/1048576,o.jsHeapSizeLimit/1048576)}return e},update:function(){a=this.end()},domElement:r,setMode:t}};return e.Panel=function(e,o,t){var n=1/0,r=0,a=Math.round,l=a(window.devicePixelRatio||1),i=80*l,s=48*l,d=3*l,f=2*l,c=3*l,u=15*l,m=74*l,p=30*l,_=document.createElement("canvas");_.width=i,_.height=s,_.style.cssText="width:80px;height:48px";var v=_.getContext("2d");return v.font="bold "+9*l+"px Helvetica,Arial,sans-serif",v.textBaseline="top",v.fillStyle=t,v.fillRect(0,0,i,s),v.fillStyle=o,v.fillText(e,d,f),v.fillRect(c,u,m,p),v.fillStyle=t,v.globalAlpha=.9,v.fillRect(c,u,m,p),{dom:_,update:function(s,b){n=Math.min(n,s),r=Math.max(r,s),v.fillStyle=t,v.globalAlpha=1,v.fillRect(0,0,i,u),v.fillStyle=o,v.fillText(a(s)+" "+e+" ("+a(n)+"-"+a(r)+")",d,f),v.drawImage(_,c+l,u,m-l,p,c,u,m-l,p),v.fillRect(c+m-l,u,l,p),v.fillStyle=t,v.globalAlpha=.9,v.fillRect(c+m-l,u,l,a((1-s/b)*p))}}},e}()));a.showPanel(0),document.body.appendChild(a.dom);const l=document.querySelector("#c"),i=l.getContext("webgl2",{alpha:!1});i.clearColor(.5,.5,.75,1),i.enable(i.BLEND),i.blendFunc(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA);const s=new Float32Array(4e5);for(let e=0;e<2;e++){let o=Math.random()-.5,t=Math.random()-.5;for(let n=0;n<1e5;n++){let r=(2*n+e)*2;s[r+0]=o,s[r+1]=t}}for(let e=0;e<1e5;e++){let o=2*Math.PI*e/1e5;s[4*e+0]+=.05*Math.cos(o),s[4*e+1]+=.05*Math.sin(o)}const d=new Float32Array(4e5),f=r.createBufferFromTypedArray(i,s,i.ARRAY_BUFFER,i.DYNAMIC_DRAW),c=r.createBufferFromTypedArray(i,s,i.ARRAY_BUFFER,i.DYNAMIC_DRAW),u=r.createBufferFromTypedArray(i,d,i.ARRAY_BUFFER,i.DYNAMIC_DRAW),m=r.createBufferFromTypedArray(i,d,i.ARRAY_BUFFER,i.DYNAMIC_DRAW),p=r.createBufferInfoFromArrays(i,{old_pos:{buffer:f,numComponents:4,type:Float32Array},new_pos:{buffer:c,numComponents:4,type:Float32Array},old_vel:{buffer:u,numComponents:4,type:Float32Array},new_vel:{buffer:m,numComponents:4,type:Float32Array}}),_=r.createBufferInfoFromArrays(i,{old_pos:{buffer:c,numComponents:4,type:Float32Array},new_pos:{buffer:f,numComponents:4,type:Float32Array},old_vel:{buffer:m,numComponents:4,type:Float32Array},new_vel:{buffer:u,numComponents:4,type:Float32Array}}),v=r.createBufferInfoFromArrays(i,{pos:{buffer:f,numComponents:2,type:Float32Array}}),b=r.createBufferInfoFromArrays(i,{pos:{buffer:c,numComponents:2,type:Float32Array}}),w=r.createProgramInfo(i,[`#version 300 es

    precision highp float;

    #define ball_r ${.05.toFixed(10)}
    #define bounce .9
    #define drag .99

    // positions of 2 balls
    in vec4 old_pos;
    out vec4 new_pos;
    // velocities of 2 balls
    in vec4 old_vel;
    out vec4 new_vel;

    uniform vec2 u_impulse;

    // pos, vel for each ball
    void collide(in vec4 b1, in vec4 b2, out vec4 r1, out vec4 r2) {
        r1 = b1;
        r2 = b2;

        vec2 delta = b1.xy - b2.xy;
        float distSq = dot(delta, delta);
        if (distSq > 0.0 && distSq < 4.0 * ball_r * ball_r) {
            float dist = sqrt(distSq);
            // assumption: all balls have the same mass
            // intuition: the balls exchange their momentum
            // but only on the direction joining them

            // 1. avoid overlap
            float push = (2.0 * ball_r - dist) * .5 * bounce / dist;
            r1.xy += delta * push;
            r2.xy -= delta * push;

            // 2. exchange momentums
            vec2 momentum = delta * (dot(delta, b1.zw) - dot(delta, b2.zw)) / distSq;
            r1.zw -= momentum;
            r2.zw += momentum;
        }        
    }

    void main() {
        float dt = 0.01;
        new_vel = old_vel + vec4(u_impulse, 0.0, 0.0);
        new_pos = old_pos + new_vel * dt;
        // bounce on borders
        bvec4 mask_negative = lessThan(new_pos, vec4(${(-.95).toFixed(10)}));
        bvec4 mask_positive = greaterThan(new_pos, vec4(${.95.toFixed(10)}));
        new_pos = mix(new_pos, -${1.9.toFixed(10)} - new_pos, mask_negative);
        new_pos = mix(new_pos, ${1.9.toFixed(10)} - new_pos, mask_positive);
        bvec4 mask_both = bvec4(
            mask_positive[0] || mask_negative[0],
            mask_positive[1] || mask_negative[1],
            mask_positive[2] || mask_negative[2],
            mask_positive[3] || mask_negative[3]
        );
        new_vel = mix(new_vel, -new_vel, mask_both);
        new_vel *= drag;

        // collision
        vec4 r1;
        vec4 r2;
        collide(
            vec4(new_pos.xy, new_vel.xy), 
            vec4(new_pos.zw, new_vel.zw), r1, r2);
        new_pos = vec4(r1.xy, r2.xy);
        new_vel = vec4(r1.zw, r2.zw);
    }
    `,`#version 300 es
    precision highp float;

    void main() {}
    `],{transformFeedbackVaryings:["new_pos","new_vel"],transformFeedbackMode:i.SEPARATE_ATTRIBS}),A=r.createProgramInfo(i,[`#version 300 es

    in vec2 pos;

    out vec3 v_ball_color;

    void main() {
        gl_Position = vec4(pos, 0.0, 1.0);
        gl_PointSize = ${(2*i.canvas.width*.05).toFixed(10)};
        v_ball_color = mix(vec3(1.0, 0, 0), vec3(0.0, 1, 0), mod(float(gl_VertexID), 2.0));
    }
    `,`#version 300 es
    precision highp float;

    in vec3 v_ball_color;

    out vec4 out_color;
    
    void main() {
        float distSq = dot(gl_PointCoord - .5, gl_PointCoord - .5);
        float alpha = smoothstep(.25, .20, distSq);
        float outline = smoothstep(.27, .20, distSq);
        out_color = vec4(v_ball_color * outline, alpha * .1);
    }
    `]),y=r.createTransformFeedback(i,w,_),F=r.createTransformFeedback(i,w,p);i.bindBuffer(i.ARRAY_BUFFER,null),console.log("calc: ",2e5),console.log("real: ",v.numElements);let h={update_bi:p,tf:F,draw_bi:b},R={update_bi:_,tf:y,draw_bi:v},g=null,x=[0,0];document.addEventListener("mousedown",e=>{g=[e.offsetX,e.offsetY]}),document.addEventListener("mouseup",e=>{let o=[e.offsetX,e.offsetY];x=[-(.01*(o[0]-g[0])),(o[1]-g[1])*.01],g=null}),requestAnimationFrame(function e(o){a.update(),r.resizeCanvasToDisplaySize(l)&&i.viewport(0,0,i.drawingBufferWidth,i.drawingBufferHeight),i.useProgram(w.program),r.setBuffersAndAttributes(i,w,h.update_bi),i.enable(i.RASTERIZER_DISCARD),i.bindTransformFeedback(i.TRANSFORM_FEEDBACK,h.tf),r.setUniforms(w,{u_impulse:x}),i.beginTransformFeedback(i.POINTS),i.drawArrays(i.POINTS,0,1e5),i.endTransformFeedback(),i.disable(i.RASTERIZER_DISCARD),i.bindTransformFeedback(i.TRANSFORM_FEEDBACK,null),i.bindBuffer(i.ARRAY_BUFFER,null),i.bindBuffer(i.TRANSFORM_FEEDBACK_BUFFER,null),x=[0,0],i.clear(i.COLOR_BUFFER_BIT),i.useProgram(A.program),r.setBuffersAndAttributes(i,A,h.draw_bi),i.drawArrays(i.POINTS,0,2e5);{let e=h;h=R,R=e}requestAnimationFrame(e)});
//# sourceMappingURL=index.640369d4.js.map
