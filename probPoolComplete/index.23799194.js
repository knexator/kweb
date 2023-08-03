!function(){var e,r,t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},l={},a={},n=t.parcelRequire94c2;null==n&&((n=function(e){if(e in l)return l[e].exports;if(e in a){var r=a[e];delete a[e];var t={id:e,exports:{}};return l[e]=t,r.call(t.exports,t,t.exports),t.exports}var n=Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}).register=function(e,r){a[e]=r},t.parcelRequire94c2=n);var o=n("6MzNI"),i={};function d(e,r){let t=Array(e);for(let l=0;l<e;l++)t[l]=r(l);return t}function s(e,r,t){let l=r-e,a=Array(l);for(let r=0;r<l;r++)a[r]=t(r+e);return a}var c=new(((e=function(){function r(e){return a.appendChild(e.dom),e}function t(e){for(var r=0;r<a.children.length;r++)a.children[r].style.display=r===e?"block":"none";l=e}var l=0,a=document.createElement("div");a.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",a.addEventListener("click",function(e){e.preventDefault(),t(++l%a.children.length)},!1);var n=(performance||Date).now(),o=n,i=0,d=r(new e.Panel("FPS","#0ff","#002")),s=r(new e.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var c=r(new e.Panel("MB","#f08","#201"));return t(0),{REVISION:16,dom:a,addPanel:r,showPanel:t,begin:function(){n=(performance||Date).now()},end:function(){i++;var e=(performance||Date).now();if(s.update(e-n,200),e>o+1e3&&(d.update(1e3*i/(e-o),100),o=e,i=0,c)){var r=performance.memory;c.update(r.usedJSHeapSize/1048576,r.jsHeapSizeLimit/1048576)}return e},update:function(){n=this.end()},domElement:a,setMode:t}}).Panel=function(e,r,t){var l=1/0,a=0,n=Math.round,o=n(window.devicePixelRatio||1),i=80*o,d=48*o,s=3*o,c=2*o,f=3*o,b=15*o,u=74*o,m=30*o,_=document.createElement("canvas");_.width=i,_.height=d,_.style.cssText="width:80px;height:48px";var v=_.getContext("2d");return v.font="bold "+9*o+"px Helvetica,Arial,sans-serif",v.textBaseline="top",v.fillStyle=t,v.fillRect(0,0,i,d),v.fillStyle=r,v.fillText(e,s,c),v.fillRect(f,b,u,m),v.fillStyle=t,v.globalAlpha=.9,v.fillRect(f,b,u,m),{dom:_,update:function(d,p){l=Math.min(l,d),a=Math.max(a,d),v.fillStyle=t,v.globalAlpha=1,v.fillRect(0,0,i,b),v.fillStyle=r,v.fillText(n(d)+" "+e+" ("+n(l)+"-"+n(a)+")",s,c),v.drawImage(_,f+o,b,u-o,m,f,b,u-o,m),v.fillRect(f+u-o,b,o,m),v.fillStyle=t,v.globalAlpha=.9,v.fillRect(f+u-o,b,o,n((1-d/p)*m))}}},(r=e)&&r.__esModule)?r.default:r);c.showPanel(0),document.body.appendChild(c.dom);let f=document.querySelector("#c"),b=f.getContext("webgl2",{alpha:!1});b.clearColor(.5,.5,.75,1),b.enable(b.BLEND),b.blendFunc(b.SRC_ALPHA,b.ONE_MINUS_SRC_ALPHA);let u=o.createProgramFromSources(b,[`#version 300 es

    precision highp float;

    #define ball_r ${.05.toFixed(10)}
    #define bounce .9
    #define drag .99
    #define dt 0.01

    ${d(8,e=>`in vec4 old_b${e}; out vec4 new_b${e};`).join("\n")}

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

    vec4 individualUpdate(vec4 ball) {
        // movement
        vec4 res = vec4(ball.xy + dt * ball.zw, ball.zw);
        // bounce
        if (abs(res.x) > 1.0 - ball_r) {
            res.x = sign(res.x) * (2.0 - 2.0 * ball_r) - ball.x;
            res.z = -ball.z;
        }
        if (abs(res.y) > 1.0 - ball_r) {
            res.y = sign(res.y) * (2.0 - 2.0 * ball_r) - ball.y;
            res.w = -ball.w;
        }
        // drag
        res.zw *= drag;
        return res;
    }

    void main() {
        new_b0 = individualUpdate(vec4(old_b0.xy, old_b0.zw + u_impulse));
    ${s(1,8,e=>`new_b${e} = individualUpdate(old_b${e});`).join("\n")}
        // collision
        // generate this code:
        // collide(new_b0, new_b1, new_b0, new_b1);
        // collide(0, 2) ...
        // collide(0, n_balls-1)
        // collide(1, 2) ...
        // collide(1, n_balls-1)
        // ...
        // collide(n_balls - 2, n_balls-1)
    ${s(0,8,e=>s(e+1,8,r=>`collide(new_b${e}, new_b${r}, new_b${e}, new_b${r});`).join("\n")).join("\n")}
    }
    `,`#version 300 es
    precision highp float;

    void main() {}
    `],{transformFeedbackVaryings:s(0,8,e=>`new_b${e}`),transformFeedbackMode:b.INTERLEAVED_ATTRIBS}),m=new Float32Array(96e4);for(let e=0;e<8;e++){let r=(Math.random()-.5)*1.95,t=(Math.random()-.5)*1.95;for(let l=0;l<3e4;l++){let a=(8*l+e)*4;m[a+0]=r,m[a+1]=t}}for(let e=0;e<3e4;e++){let r=2*Math.PI*e/3e4;m[32*e+0]+=.01*Math.cos(r),m[32*e+1]+=.01*Math.sin(r)}let _=o.createBufferFromTypedArray(b,m,b.ARRAY_BUFFER,b.DYNAMIC_DRAW),v=o.createBufferFromTypedArray(b,m,b.ARRAY_BUFFER,b.DYNAMIC_DRAW),p=o.createProgramInfo(b,[`#version 300 es

    #define n_balls ${8..toFixed(10)}

    in vec2 pos;

    out vec3 v_ball_color;

    vec3 hsl2rgb(in vec3 c) {
        vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
    }


    void main() {
        gl_Position = vec4(pos, 0.0, 1.0);
        gl_PointSize = ${(2*b.canvas.width*.05).toFixed(10)};
        v_ball_color = hsl2rgb(vec3(float(gl_VertexID) / n_balls, 0.85, 0.5));
        // v_ball_color = mix(vec3(1.0, 0, 0), vec3(0.0, 1, 0), mod(float(gl_VertexID), n_balls) / n_balls);
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
    `]),A=o.createVertexArrayInfo(b,p,o.createBufferInfoFromArrays(b,{pos:{buffer:_,numComponents:2,stride:16,type:Float32Array}})),y=o.createVertexArrayInfo(b,p,o.createBufferInfoFromArrays(b,{pos:{buffer:v,numComponents:2,stride:16,type:Float32Array}})),h=b.getUniformLocation(u,"u_impulse"),F=d(8,e=>b.getAttribLocation(u,`old_b${e}`)),R=b.createVertexArray();b.bindVertexArray(R),b.bindBuffer(b.ARRAY_BUFFER,_);for(let e=0;e<8;e++)b.enableVertexAttribArray(F[e]),b.vertexAttribPointer(F[e],4,b.FLOAT,!1,128,16*e);let w=b.createVertexArray();b.bindVertexArray(w),b.bindBuffer(b.ARRAY_BUFFER,v);for(let e=0;e<8;e++)b.enableVertexAttribArray(F[e]),b.vertexAttribPointer(F[e],4,b.FLOAT,!1,128,16*e);b.bindVertexArray(null);let x=b.createTransformFeedback();b.bindTransformFeedback(b.TRANSFORM_FEEDBACK,x),b.bindBufferBase(b.TRANSFORM_FEEDBACK_BUFFER,0,_);let g=b.createTransformFeedback();b.bindTransformFeedback(b.TRANSFORM_FEEDBACK,g),b.bindBufferBase(b.TRANSFORM_FEEDBACK_BUFFER,0,v),b.bindTransformFeedback(b.TRANSFORM_FEEDBACK,null),b.bindBuffer(b.ARRAY_BUFFER,null);let S={update_vao:R,tf:g,draw_vao:y.vertexArrayObject},E={update_vao:w,tf:x,draw_vao:A.vertexArrayObject},T=null,B=[0,0];document.addEventListener("mousedown",e=>{T=[e.offsetX,e.offsetY]}),document.addEventListener("mouseup",e=>{let r=[e.offsetX,e.offsetY];B=[-(.01*(r[0]-T[0])),(r[1]-T[1])*.01],T=null}),requestAnimationFrame(function e(r){c.update(),o.resizeCanvasToDisplaySize(f)&&b.viewport(0,0,b.drawingBufferWidth,b.drawingBufferHeight),b.useProgram(u),b.bindVertexArray(S.update_vao),b.uniform2f(h,B[0],B[1]),b.enable(b.RASTERIZER_DISCARD),b.bindTransformFeedback(b.TRANSFORM_FEEDBACK,S.tf),b.beginTransformFeedback(b.POINTS),b.drawArrays(b.POINTS,0,3e4),b.endTransformFeedback(),b.disable(b.RASTERIZER_DISCARD),b.bindTransformFeedback(b.TRANSFORM_FEEDBACK,null),B=[0,0],b.clear(b.COLOR_BUFFER_BIT),b.useProgram(p.program),b.bindVertexArray(S.draw_vao),b.drawArrays(b.POINTS,0,24e4);{let e=S;S=E,E=e}requestAnimationFrame(e)})}();
//# sourceMappingURL=index.23799194.js.map
