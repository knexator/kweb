var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},r={},t={},n=e.parcelRequire94c2;null==n&&((n=function(e){if(e in r)return r[e].exports;if(e in t){var n=t[e];delete t[e];var a={id:e,exports:{}};return r[e]=a,n.call(a.exports,a,a.exports),a.exports}var l=Error("Cannot find module '"+e+"'");throw l.code="MODULE_NOT_FOUND",l}).register=function(e,r){t[e]=r},e.parcelRequire94c2=n);var a=n("amYBK");function l(e,r){let t=Array(e);for(let n=0;n<e;n++)t[n]=r(n);return t}function o(e,r,t){let n=r-e,a=Array(n);for(let r=0;r<n;r++)a[r]=t(r+e);return a}var i=new(function(e){return e&&e.__esModule?e.default:e}(function(){var e=function(){function r(e){return a.appendChild(e.dom),e}function t(e){for(var r=0;r<a.children.length;r++)a.children[r].style.display=r===e?"block":"none";n=e}var n=0,a=document.createElement("div");a.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",a.addEventListener("click",function(e){e.preventDefault(),t(++n%a.children.length)},!1);var l=(performance||Date).now(),o=l,i=0,d=r(new e.Panel("FPS","#0ff","#002")),s=r(new e.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var c=r(new e.Panel("MB","#f08","#201"));return t(0),{REVISION:16,dom:a,addPanel:r,showPanel:t,begin:function(){l=(performance||Date).now()},end:function(){i++;var e=(performance||Date).now();if(s.update(e-l,200),e>o+1e3&&(d.update(1e3*i/(e-o),100),o=e,i=0,c)){var r=performance.memory;c.update(r.usedJSHeapSize/1048576,r.jsHeapSizeLimit/1048576)}return e},update:function(){l=this.end()},domElement:a,setMode:t}};return e.Panel=function(e,r,t){var n=1/0,a=0,l=Math.round,o=l(window.devicePixelRatio||1),i=80*o,d=48*o,s=3*o,c=2*o,f=3*o,b=15*o,u=74*o,m=30*o,_=document.createElement("canvas");_.width=i,_.height=d,_.style.cssText="width:80px;height:48px";var v=_.getContext("2d");return v.font="bold "+9*o+"px Helvetica,Arial,sans-serif",v.textBaseline="top",v.fillStyle=t,v.fillRect(0,0,i,d),v.fillStyle=r,v.fillText(e,s,c),v.fillRect(f,b,u,m),v.fillStyle=t,v.globalAlpha=.9,v.fillRect(f,b,u,m),{dom:_,update:function(d,p){n=Math.min(n,d),a=Math.max(a,d),v.fillStyle=t,v.globalAlpha=1,v.fillRect(0,0,i,b),v.fillStyle=r,v.fillText(l(d)+" "+e+" ("+l(n)+"-"+l(a)+")",s,c),v.drawImage(_,f+o,b,u-o,m,f,b,u-o,m),v.fillRect(f+u-o,b,o,m),v.fillStyle=t,v.globalAlpha=.9,v.fillRect(f+u-o,b,o,l((1-d/p)*m))}}},e}()));i.showPanel(0),document.body.appendChild(i.dom);const d=document.querySelector("#c"),s=d.getContext("webgl2",{alpha:!1});s.clearColor(.5,.5,.75,1),s.enable(s.BLEND),s.blendFunc(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA);const c=a.createProgramFromSources(s,[`#version 300 es

    precision highp float;

    #define ball_r ${.05.toFixed(10)}
    #define bounce .9
    #define drag .99
    #define dt 0.01

    ${l(8,e=>`in vec4 old_b${e}; out vec4 new_b${e};`).join("\n")}

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
    ${o(1,8,e=>`new_b${e} = individualUpdate(old_b${e});`).join("\n")}
        // collision
        // generate this code:
        // collide(new_b0, new_b1, new_b0, new_b1);
        // collide(0, 2) ...
        // collide(0, n_balls-1)
        // collide(1, 2) ...
        // collide(1, n_balls-1)
        // ...
        // collide(n_balls - 2, n_balls-1)
    ${o(0,8,e=>o(e+1,8,r=>`collide(new_b${e}, new_b${r}, new_b${e}, new_b${r});`).join("\n")).join("\n")}
    }
    `,`#version 300 es
    precision highp float;

    void main() {}
    `],{transformFeedbackVaryings:o(0,8,e=>`new_b${e}`),transformFeedbackMode:s.INTERLEAVED_ATTRIBS}),f=new Float32Array(96e4);for(let e=0;e<8;e++){let r=(Math.random()-.5)*1.95,t=(Math.random()-.5)*1.95;for(let n=0;n<3e4;n++){let a=(8*n+e)*4;f[a+0]=r,f[a+1]=t}}for(let e=0;e<3e4;e++){let r=2*Math.PI*e/3e4;f[32*e+0]+=.01*Math.cos(r),f[32*e+1]+=.01*Math.sin(r)}const b=a.createBufferFromTypedArray(s,f,s.ARRAY_BUFFER,s.DYNAMIC_DRAW),u=a.createBufferFromTypedArray(s,f,s.ARRAY_BUFFER,s.DYNAMIC_DRAW),m=a.createProgramInfo(s,[`#version 300 es

    #define n_balls ${8..toFixed(10)}

    in vec2 pos;

    out vec3 v_ball_color;

    vec3 hsl2rgb(in vec3 c) {
        vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
    }


    void main() {
        gl_Position = vec4(pos, 0.0, 1.0);
        gl_PointSize = ${(2*s.canvas.width*.05).toFixed(10)};
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
    `]),_=a.createVertexArrayInfo(s,m,a.createBufferInfoFromArrays(s,{pos:{buffer:b,numComponents:2,stride:16,type:Float32Array}})),v=a.createVertexArrayInfo(s,m,a.createBufferInfoFromArrays(s,{pos:{buffer:u,numComponents:2,stride:16,type:Float32Array}})),p=s.getUniformLocation(c,"u_impulse"),A=l(8,e=>s.getAttribLocation(c,`old_b${e}`)),y=s.createVertexArray();s.bindVertexArray(y),s.bindBuffer(s.ARRAY_BUFFER,b);for(let e=0;e<8;e++)s.enableVertexAttribArray(A[e]),s.vertexAttribPointer(A[e],4,s.FLOAT,!1,128,16*e);const h=s.createVertexArray();s.bindVertexArray(h),s.bindBuffer(s.ARRAY_BUFFER,u);for(let e=0;e<8;e++)s.enableVertexAttribArray(A[e]),s.vertexAttribPointer(A[e],4,s.FLOAT,!1,128,16*e);s.bindVertexArray(null);const F=s.createTransformFeedback();s.bindTransformFeedback(s.TRANSFORM_FEEDBACK,F),s.bindBufferBase(s.TRANSFORM_FEEDBACK_BUFFER,0,b);const R=s.createTransformFeedback();s.bindTransformFeedback(s.TRANSFORM_FEEDBACK,R),s.bindBufferBase(s.TRANSFORM_FEEDBACK_BUFFER,0,u),s.bindTransformFeedback(s.TRANSFORM_FEEDBACK,null),s.bindBuffer(s.ARRAY_BUFFER,null);let w={update_vao:y,tf:R,draw_vao:v.vertexArrayObject},x={update_vao:h,tf:F,draw_vao:_.vertexArrayObject},g=null,S=[0,0];document.addEventListener("mousedown",e=>{g=[e.offsetX,e.offsetY]}),document.addEventListener("mouseup",e=>{let r=[e.offsetX,e.offsetY];S=[-(.01*(r[0]-g[0])),(r[1]-g[1])*.01],g=null}),requestAnimationFrame(function e(r){i.update(),a.resizeCanvasToDisplaySize(d)&&s.viewport(0,0,s.drawingBufferWidth,s.drawingBufferHeight),s.useProgram(c),s.bindVertexArray(w.update_vao),s.uniform2f(p,S[0],S[1]),s.enable(s.RASTERIZER_DISCARD),s.bindTransformFeedback(s.TRANSFORM_FEEDBACK,w.tf),s.beginTransformFeedback(s.POINTS),s.drawArrays(s.POINTS,0,3e4),s.endTransformFeedback(),s.disable(s.RASTERIZER_DISCARD),s.bindTransformFeedback(s.TRANSFORM_FEEDBACK,null),S=[0,0],s.clear(s.COLOR_BUFFER_BIT),s.useProgram(m.program),s.bindVertexArray(w.draw_vao),s.drawArrays(s.POINTS,0,24e4);{let e=w;w=x,x=e}requestAnimationFrame(e)});
//# sourceMappingURL=index.c87eedae.js.map
