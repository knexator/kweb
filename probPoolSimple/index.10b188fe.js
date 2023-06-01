!function(){var e,o,t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},r={},a=t.parcelRequire94c2;null==a&&((a=function(e){if(e in n)return n[e].exports;if(e in r){var o=r[e];delete r[e];var t={id:e,exports:{}};return n[e]=t,o.call(t.exports,t,t.exports),t.exports}var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,o){r[e]=o},t.parcelRequire94c2=a);var l=a("6MzNI"),i={},s=new(((e=function(){function o(e){return r.appendChild(e.dom),e}function t(e){for(var o=0;o<r.children.length;o++)r.children[o].style.display=o===e?"block":"none";n=e}var n=0,r=document.createElement("div");r.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",r.addEventListener("click",function(e){e.preventDefault(),t(++n%r.children.length)},!1);var a=(performance||Date).now(),l=a,i=0,s=o(new e.Panel("FPS","#0ff","#002")),f=o(new e.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var d=o(new e.Panel("MB","#f08","#201"));return t(0),{REVISION:16,dom:r,addPanel:o,showPanel:t,begin:function(){a=(performance||Date).now()},end:function(){i++;var e=(performance||Date).now();if(f.update(e-a,200),e>l+1e3&&(s.update(1e3*i/(e-l),100),l=e,i=0,d)){var o=performance.memory;d.update(o.usedJSHeapSize/1048576,o.jsHeapSizeLimit/1048576)}return e},update:function(){a=this.end()},domElement:r,setMode:t}}).Panel=function(e,o,t){var n=1/0,r=0,a=Math.round,l=a(window.devicePixelRatio||1),i=80*l,s=48*l,f=3*l,d=2*l,c=3*l,u=15*l,m=74*l,p=30*l,_=document.createElement("canvas");_.width=i,_.height=s,_.style.cssText="width:80px;height:48px";var v=_.getContext("2d");return v.font="bold "+9*l+"px Helvetica,Arial,sans-serif",v.textBaseline="top",v.fillStyle=t,v.fillRect(0,0,i,s),v.fillStyle=o,v.fillText(e,f,d),v.fillRect(c,u,m,p),v.fillStyle=t,v.globalAlpha=.9,v.fillRect(c,u,m,p),{dom:_,update:function(s,b){n=Math.min(n,s),r=Math.max(r,s),v.fillStyle=t,v.globalAlpha=1,v.fillRect(0,0,i,u),v.fillStyle=o,v.fillText(a(s)+" "+e+" ("+a(n)+"-"+a(r)+")",f,d),v.drawImage(_,c+l,u,m-l,p,c,u,m-l,p),v.fillRect(c+m-l,u,l,p),v.fillStyle=t,v.globalAlpha=.9,v.fillRect(c+m-l,u,l,a((1-s/b)*p))}}},(o=e)&&o.__esModule)?o.default:o);s.showPanel(0),document.body.appendChild(s.dom);let f=document.querySelector("#c"),d=f.getContext("webgl2",{alpha:!1});d.clearColor(.5,.5,.75,1),d.enable(d.BLEND),d.blendFunc(d.SRC_ALPHA,d.ONE_MINUS_SRC_ALPHA);let c=new Float32Array(4e5);for(let e=0;e<2;e++){let o=Math.random()-.5,t=Math.random()-.5;for(let n=0;n<1e5;n++){let r=(2*n+e)*2;c[r+0]=o,c[r+1]=t}}for(let e=0;e<1e5;e++){let o=2*Math.PI*e/1e5;c[4*e+0]+=.05*Math.cos(o),c[4*e+1]+=.05*Math.sin(o)}let u=new Float32Array(4e5),m=l.createBufferFromTypedArray(d,c,d.ARRAY_BUFFER,d.DYNAMIC_DRAW),p=l.createBufferFromTypedArray(d,c,d.ARRAY_BUFFER,d.DYNAMIC_DRAW),_=l.createBufferFromTypedArray(d,u,d.ARRAY_BUFFER,d.DYNAMIC_DRAW),v=l.createBufferFromTypedArray(d,u,d.ARRAY_BUFFER,d.DYNAMIC_DRAW),b=l.createBufferInfoFromArrays(d,{old_pos:{buffer:m,numComponents:4,type:Float32Array},new_pos:{buffer:p,numComponents:4,type:Float32Array},old_vel:{buffer:_,numComponents:4,type:Float32Array},new_vel:{buffer:v,numComponents:4,type:Float32Array}}),w=l.createBufferInfoFromArrays(d,{old_pos:{buffer:p,numComponents:4,type:Float32Array},new_pos:{buffer:m,numComponents:4,type:Float32Array},old_vel:{buffer:v,numComponents:4,type:Float32Array},new_vel:{buffer:_,numComponents:4,type:Float32Array}}),A=l.createBufferInfoFromArrays(d,{pos:{buffer:m,numComponents:2,type:Float32Array}}),y=l.createBufferInfoFromArrays(d,{pos:{buffer:p,numComponents:2,type:Float32Array}}),h=l.createProgramInfo(d,[`#version 300 es

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
        bvec4 mask_negative = lessThan(new_pos, vec4(-1.0 + ball_r));
        bvec4 mask_positive = greaterThan(new_pos, vec4(1.0 - ball_r));
        new_pos = mix(new_pos, -(2.0 - 2.0 * ball_r) - new_pos, mask_negative);
        new_pos = mix(new_pos, (2.0 - 2.0 * ball_r) - new_pos, mask_positive);
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
    `],{transformFeedbackVaryings:["new_pos","new_vel"],transformFeedbackMode:d.SEPARATE_ATTRIBS}),F=l.createProgramInfo(d,[`#version 300 es

    in vec2 pos;

    out vec3 v_ball_color;

    void main() {
        gl_Position = vec4(pos, 0.0, 1.0);
        gl_PointSize = ${(2*d.canvas.width*.05).toFixed(10)};
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
    `]),R=l.createTransformFeedback(d,h,w),g=l.createTransformFeedback(d,h,b);d.bindBuffer(d.ARRAY_BUFFER,null),console.log("calc: ",2e5),console.log("real: ",A.numElements);let S={update_bi:b,tf:g,draw_bi:y},x={update_bi:w,tf:R,draw_bi:A},E=null,T=[0,0];document.addEventListener("mousedown",e=>{E=[e.offsetX,e.offsetY]}),document.addEventListener("mouseup",e=>{let o=[e.offsetX,e.offsetY];T=[-(.01*(o[0]-E[0])),(o[1]-E[1])*.01],E=null}),requestAnimationFrame(function e(o){s.update(),l.resizeCanvasToDisplaySize(f)&&d.viewport(0,0,d.drawingBufferWidth,d.drawingBufferHeight),d.useProgram(h.program),l.setBuffersAndAttributes(d,h,S.update_bi),d.enable(d.RASTERIZER_DISCARD),d.bindTransformFeedback(d.TRANSFORM_FEEDBACK,S.tf),l.setUniforms(h,{u_impulse:T}),d.beginTransformFeedback(d.POINTS),d.drawArrays(d.POINTS,0,1e5),d.endTransformFeedback(),d.disable(d.RASTERIZER_DISCARD),d.bindTransformFeedback(d.TRANSFORM_FEEDBACK,null),d.bindBuffer(d.ARRAY_BUFFER,null),d.bindBuffer(d.TRANSFORM_FEEDBACK_BUFFER,null),T=[0,0],d.clear(d.COLOR_BUFFER_BIT),d.useProgram(F.program),l.setBuffersAndAttributes(d,F,S.draw_bi),d.drawArrays(d.POINTS,0,2e5);{let e=S;S=x,x=e}requestAnimationFrame(e)})}();
//# sourceMappingURL=index.10b188fe.js.map
