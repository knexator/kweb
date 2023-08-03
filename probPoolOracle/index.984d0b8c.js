var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},r={},l=e.parcelRequire94c2;null==l&&((l=function(e){if(e in t)return t[e].exports;if(e in r){var l=r[e];delete r[e];var n={id:e,exports:{}};return t[e]=n,l.call(n.exports,n,n.exports),n.exports}var o=Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}).register=function(e,t){r[e]=t},e.parcelRequire94c2=l);var n=l("amYBK");function o(e,t){let r=Array(e);for(let l=0;l<e;l++)r[l]=t(l);return r}function a(e,t,r){let l=t-e,n=Array(l);for(let t=0;t<l;t++)n[t]=r(t+e);return n}var i=new(function(e){return e&&e.__esModule?e.default:e}(function(){var e=function(){function t(e){return n.appendChild(e.dom),e}function r(e){for(var t=0;t<n.children.length;t++)n.children[t].style.display=t===e?"block":"none";l=e}var l=0,n=document.createElement("div");n.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",n.addEventListener("click",function(e){e.preventDefault(),r(++l%n.children.length)},!1);var o=(performance||Date).now(),a=o,i=0,d=t(new e.Panel("FPS","#0ff","#002")),s=t(new e.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var f=t(new e.Panel("MB","#f08","#201"));return r(0),{REVISION:16,dom:n,addPanel:t,showPanel:r,begin:function(){o=(performance||Date).now()},end:function(){i++;var e=(performance||Date).now();if(s.update(e-o,200),e>a+1e3&&(d.update(1e3*i/(e-a),100),a=e,i=0,f)){var t=performance.memory;f.update(t.usedJSHeapSize/1048576,t.jsHeapSizeLimit/1048576)}return e},update:function(){o=this.end()},domElement:n,setMode:r}};return e.Panel=function(e,t,r){var l=1/0,n=0,o=Math.round,a=o(window.devicePixelRatio||1),i=80*a,d=48*a,s=3*a,f=2*a,c=3*a,u=15*a,b=74*a,m=30*a,_=document.createElement("canvas");_.width=i,_.height=d,_.style.cssText="width:80px;height:48px";var v=_.getContext("2d");return v.font="bold "+9*a+"px Helvetica,Arial,sans-serif",v.textBaseline="top",v.fillStyle=r,v.fillRect(0,0,i,d),v.fillStyle=t,v.fillText(e,s,f),v.fillRect(c,u,b,m),v.fillStyle=r,v.globalAlpha=.9,v.fillRect(c,u,b,m),{dom:_,update:function(d,A){l=Math.min(l,d),n=Math.max(n,d),v.fillStyle=r,v.globalAlpha=1,v.fillRect(0,0,i,u),v.fillStyle=t,v.fillText(o(d)+" "+e+" ("+o(l)+"-"+o(n)+")",s,f),v.drawImage(_,c+a,u,b-a,m,c,u,b-a,m),v.fillRect(c+b-a,u,a,m),v.fillStyle=r,v.globalAlpha=.9,v.fillRect(c+b-a,u,a,o((1-d/A)*m))}}},e}()));i.showPanel(0),document.body.appendChild(i.dom);const d=document.querySelector("#c"),s=d.getContext("webgl2",{alpha:!1});s.clearColor(.5,.5,.75,1),s.enable(s.BLEND),s.blendFunc(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA);const f=n.createProgramFromSources(s,[`#version 300 es

    precision highp float;

    #define ball_r ${.05.toFixed(10)}
    #define bounce .9
    #define drag .99
    #define dt 0.01

    ${o(4,e=>`in vec4 old_b${e}; out vec4 new_b${e};`).join("\n")}

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
    ${a(1,4,e=>`new_b${e} = individualUpdate(old_b${e});`).join("\n")}
        // collision
        // generate this code:
        // collide(new_b0, new_b1, new_b0, new_b1);
        // collide(0, 2) ...
        // collide(0, n_balls-1)
        // collide(1, 2) ...
        // collide(1, n_balls-1)
        // ...
        // collide(n_balls - 2, n_balls-1)
    ${a(0,4,e=>a(e+1,4,t=>`collide(new_b${e}, new_b${t}, new_b${e}, new_b${t});`).join("\n")).join("\n")}
    }
    `,`#version 300 es
    precision highp float;

    void main() {}
    `],{transformFeedbackVaryings:a(0,4,e=>`new_b${e}`),transformFeedbackMode:s.INTERLEAVED_ATTRIBS}),c=o(4,e=>[(Math.random()-.5)*1.95,(Math.random()-.5)*1.95]),u=new Float32Array(8e3);for(let e=0;e<4;e++)for(let t=0;t<500;t++){let r=(4*t+e)*4;u[r+0]=c[e][0],u[r+1]=c[e][1]}for(let e=0;e<500;e++){let t=2*Math.PI*e/500;u[16*e+0]+=.01*Math.cos(t),u[16*e+1]+=.01*Math.sin(t)}const b=n.createBufferFromTypedArray(s,u,s.ARRAY_BUFFER,s.DYNAMIC_DRAW),m=n.createBufferFromTypedArray(s,u,s.ARRAY_BUFFER,s.DYNAMIC_DRAW),_=n.createProgramInfo(s,[`#version 300 es

    #define n_balls ${4..toFixed(10)}

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
    `]),v=n.createVertexArrayInfo(s,_,n.createBufferInfoFromArrays(s,{pos:{buffer:b,numComponents:2,stride:16,type:Float32Array}})),A=n.createVertexArrayInfo(s,_,n.createBufferInfoFromArrays(s,{pos:{buffer:m,numComponents:2,stride:16,type:Float32Array}})),p=(s.getUniformLocation(f,"u_impulse"),o(4,e=>s.getAttribLocation(f,`old_b${e}`))),h=s.createVertexArray();s.bindVertexArray(h),s.bindBuffer(s.ARRAY_BUFFER,b);for(let e=0;e<4;e++)s.enableVertexAttribArray(p[e]),s.vertexAttribPointer(p[e],4,s.FLOAT,!1,64,16*e);const y=s.createVertexArray();s.bindVertexArray(y),s.bindBuffer(s.ARRAY_BUFFER,m);for(let e=0;e<4;e++)s.enableVertexAttribArray(p[e]),s.vertexAttribPointer(p[e],4,s.FLOAT,!1,64,16*e);s.bindVertexArray(null);const F=s.createTransformFeedback();s.bindTransformFeedback(s.TRANSFORM_FEEDBACK,F),s.bindBufferBase(s.TRANSFORM_FEEDBACK_BUFFER,0,b);const R=s.createTransformFeedback();s.bindTransformFeedback(s.TRANSFORM_FEEDBACK,R),s.bindBufferBase(s.TRANSFORM_FEEDBACK_BUFFER,0,m),s.bindTransformFeedback(s.TRANSFORM_FEEDBACK,null),s.bindBuffer(s.ARRAY_BUFFER,null),A.vertexArrayObject,v.vertexArrayObject;let x=null,g=[0,0],w=!1;document.addEventListener("mousedown",e=>{x=[e.offsetX,e.offsetY]}),document.addEventListener("mouseup",e=>{w=!0,x=null}),document.addEventListener("mousemove",e=>{if(null!==x){let t=[e.offsetX,e.offsetY];g=[-(.01*(t[0]-x[0])),(t[1]-x[1])*.01]}});let B=new Float32Array(u.length);function E(e,t,r,l){let n=0;for(let o=0;o<500;o++)for(let o=0;o<4;o++){let a=.99*e[n+2],i=.99*e[n+3],d=e[n+0]+.01*e[n+2],s=e[n+1]+.01*e[n+3];0===o&&(d+=.01*r,s+=.01*l,a+=r,i+=l),Math.abs(d)>.95&&(d=1.9*Math.sign(d)-e[n+0],a=-a),Math.abs(s)>.95&&(s=1.9*Math.sign(s)-e[n+1],i=-i),t[n+0]=d,t[n+1]=s,t[n+2]=a,t[n+3]=i,n+=4}for(let e=0;e<500;e++)for(let r=0;r<4;r++){let l=(4*e+r)*4;for(let n=r+1;n<4;n++){let r=(4*e+n)*4,o=t[l+0]-t[r+0],a=t[l+1]-t[r+1],i=o*o+a*a;if(i>0&&i<.010000000000000002){let e=Math.sqrt(i),n=(.1-e)*.45/e;t[l+0]+=o*n,t[l+1]+=a*n,t[r+0]-=o*n,t[r+1]-=a*n;let d=(o*t[l+2]+a*t[l+3]-(o*t[r+2]+a*t[r+3]))/i;t[l+2]-=d*o,t[l+3]-=d*a,t[r+2]+=d*o,t[r+3]+=d*a}}}}requestAnimationFrame(function e(t){i.update(),n.resizeCanvasToDisplaySize(d)&&s.viewport(0,0,s.drawingBufferWidth,s.drawingBufferHeight),s.clear(s.COLOR_BUFFER_BIT),w?(E(u,u,g[0],g[1]),w=!1,g=[0,0]):E(u,u,0,0),s.bindBuffer(s.ARRAY_BUFFER,b),s.bufferSubData(s.ARRAY_BUFFER,0,u),s.bindBuffer(s.ARRAY_BUFFER,null),s.useProgram(_.program),s.bindVertexArray(v.vertexArrayObject),s.drawArrays(s.POINTS,0,2e3),E(u,B,g[0],g[1]);for(let e=1;e<100;e++)E(B,B,0,0);s.bindBuffer(s.ARRAY_BUFFER,m),s.bufferSubData(s.ARRAY_BUFFER,0,B),s.bindBuffer(s.ARRAY_BUFFER,null),s.useProgram(_.program),s.bindVertexArray(A.vertexArrayObject),s.drawArrays(s.POINTS,0,2e3),requestAnimationFrame(e)});
//# sourceMappingURL=index.984d0b8c.js.map
