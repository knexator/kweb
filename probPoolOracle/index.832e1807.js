!function(){var e,t,r="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},l={},n={},a=r.parcelRequire94c2;null==a&&((a=function(e){if(e in l)return l[e].exports;if(e in n){var t=n[e];delete n[e];var r={id:e,exports:{}};return l[e]=r,t.call(r.exports,r,r.exports),r.exports}var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,t){n[e]=t},r.parcelRequire94c2=a);var o=a("6MzNI"),i={};function d(e,t){let r=Array(e);for(let l=0;l<e;l++)r[l]=t(l);return r}function f(e,t,r){let l=t-e,n=Array(l);for(let t=0;t<l;t++)n[t]=r(t+e);return n}var s=new(((e=function(){function t(e){return n.appendChild(e.dom),e}function r(e){for(var t=0;t<n.children.length;t++)n.children[t].style.display=t===e?"block":"none";l=e}var l=0,n=document.createElement("div");n.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",n.addEventListener("click",function(e){e.preventDefault(),r(++l%n.children.length)},!1);var a=(performance||Date).now(),o=a,i=0,d=t(new e.Panel("FPS","#0ff","#002")),f=t(new e.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var s=t(new e.Panel("MB","#f08","#201"));return r(0),{REVISION:16,dom:n,addPanel:t,showPanel:r,begin:function(){a=(performance||Date).now()},end:function(){i++;var e=(performance||Date).now();if(f.update(e-a,200),e>o+1e3&&(d.update(1e3*i/(e-o),100),o=e,i=0,s)){var t=performance.memory;s.update(t.usedJSHeapSize/1048576,t.jsHeapSizeLimit/1048576)}return e},update:function(){a=this.end()},domElement:n,setMode:r}}).Panel=function(e,t,r){var l=1/0,n=0,a=Math.round,o=a(window.devicePixelRatio||1),i=80*o,d=48*o,f=3*o,s=2*o,c=3*o,u=15*o,b=74*o,m=30*o,_=document.createElement("canvas");_.width=i,_.height=d,_.style.cssText="width:80px;height:48px";var v=_.getContext("2d");return v.font="bold "+9*o+"px Helvetica,Arial,sans-serif",v.textBaseline="top",v.fillStyle=r,v.fillRect(0,0,i,d),v.fillStyle=t,v.fillText(e,f,s),v.fillRect(c,u,b,m),v.fillStyle=r,v.globalAlpha=.9,v.fillRect(c,u,b,m),{dom:_,update:function(d,A){l=Math.min(l,d),n=Math.max(n,d),v.fillStyle=r,v.globalAlpha=1,v.fillRect(0,0,i,u),v.fillStyle=t,v.fillText(a(d)+" "+e+" ("+a(l)+"-"+a(n)+")",f,s),v.drawImage(_,c+o,u,b-o,m,c,u,b-o,m),v.fillRect(c+b-o,u,o,m),v.fillStyle=r,v.globalAlpha=.9,v.fillRect(c+b-o,u,o,a((1-d/A)*m))}}},(t=e)&&t.__esModule)?t.default:t);s.showPanel(0),document.body.appendChild(s.dom);let c=document.querySelector("#c"),u=c.getContext("webgl2",{alpha:!1});u.clearColor(.5,.5,.75,1),u.enable(u.BLEND),u.blendFunc(u.SRC_ALPHA,u.ONE_MINUS_SRC_ALPHA);let b=o.createProgramFromSources(u,[`#version 300 es

    precision highp float;

    #define ball_r ${.05.toFixed(10)}
    #define bounce .9
    #define drag .99
    #define dt 0.01

    ${d(4,e=>`in vec4 old_b${e}; out vec4 new_b${e};`).join("\n")}

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
    ${f(1,4,e=>`new_b${e} = individualUpdate(old_b${e});`).join("\n")}
        // collision
        // generate this code:
        // collide(new_b0, new_b1, new_b0, new_b1);
        // collide(0, 2) ...
        // collide(0, n_balls-1)
        // collide(1, 2) ...
        // collide(1, n_balls-1)
        // ...
        // collide(n_balls - 2, n_balls-1)
    ${f(0,4,e=>f(e+1,4,t=>`collide(new_b${e}, new_b${t}, new_b${e}, new_b${t});`).join("\n")).join("\n")}
    }
    `,`#version 300 es
    precision highp float;

    void main() {}
    `],{transformFeedbackVaryings:f(0,4,e=>`new_b${e}`),transformFeedbackMode:u.INTERLEAVED_ATTRIBS}),m=d(4,e=>[(Math.random()-.5)*1.95,(Math.random()-.5)*1.95]),_=new Float32Array(8e3);for(let e=0;e<4;e++)for(let t=0;t<500;t++){let r=(4*t+e)*4;_[r+0]=m[e][0],_[r+1]=m[e][1]}for(let e=0;e<500;e++){let t=2*Math.PI*e/500;_[16*e+0]+=.01*Math.cos(t),_[16*e+1]+=.01*Math.sin(t)}let v=o.createBufferFromTypedArray(u,_,u.ARRAY_BUFFER,u.DYNAMIC_DRAW),A=o.createBufferFromTypedArray(u,_,u.ARRAY_BUFFER,u.DYNAMIC_DRAW),p=o.createProgramInfo(u,[`#version 300 es

    #define n_balls ${4..toFixed(10)}

    in vec2 pos;

    out vec3 v_ball_color;

    vec3 hsl2rgb(in vec3 c) {
        vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
    }


    void main() {
        gl_Position = vec4(pos, 0.0, 1.0);
        gl_PointSize = ${(2*u.canvas.width*.05).toFixed(10)};
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
    `]),h=o.createVertexArrayInfo(u,p,o.createBufferInfoFromArrays(u,{pos:{buffer:v,numComponents:2,stride:16,type:Float32Array}})),y=o.createVertexArrayInfo(u,p,o.createBufferInfoFromArrays(u,{pos:{buffer:A,numComponents:2,stride:16,type:Float32Array}})),F=(u.getUniformLocation(b,"u_impulse"),d(4,e=>u.getAttribLocation(b,`old_b${e}`))),R=u.createVertexArray();u.bindVertexArray(R),u.bindBuffer(u.ARRAY_BUFFER,v);for(let e=0;e<4;e++)u.enableVertexAttribArray(F[e]),u.vertexAttribPointer(F[e],4,u.FLOAT,!1,64,16*e);let x=u.createVertexArray();u.bindVertexArray(x),u.bindBuffer(u.ARRAY_BUFFER,A);for(let e=0;e<4;e++)u.enableVertexAttribArray(F[e]),u.vertexAttribPointer(F[e],4,u.FLOAT,!1,64,16*e);u.bindVertexArray(null);let g=u.createTransformFeedback();u.bindTransformFeedback(u.TRANSFORM_FEEDBACK,g),u.bindBufferBase(u.TRANSFORM_FEEDBACK_BUFFER,0,v);let w=u.createTransformFeedback();u.bindTransformFeedback(u.TRANSFORM_FEEDBACK,w),u.bindBufferBase(u.TRANSFORM_FEEDBACK_BUFFER,0,A),u.bindTransformFeedback(u.TRANSFORM_FEEDBACK,null),u.bindBuffer(u.ARRAY_BUFFER,null),y.vertexArrayObject,h.vertexArrayObject;let B=null,E=[0,0],S=!1;document.addEventListener("mousedown",e=>{B=[e.offsetX,e.offsetY]}),document.addEventListener("mouseup",e=>{S=!0,B=null}),document.addEventListener("mousemove",e=>{if(null!==B){let t=[e.offsetX,e.offsetY];E=[-(.01*(t[0]-B[0])),(t[1]-B[1])*.01]}});let M=new Float32Array(_.length);function T(e,t,r,l){let n=0;for(let a=0;a<500;a++)for(let a=0;a<4;a++){let o=.99*e[n+2],i=.99*e[n+3],d=e[n+0]+.01*e[n+2],f=e[n+1]+.01*e[n+3];0===a&&(d+=.01*r,f+=.01*l,o+=r,i+=l),Math.abs(d)>.95&&(d=1.9*Math.sign(d)-e[n+0],o=-o),Math.abs(f)>.95&&(f=1.9*Math.sign(f)-e[n+1],i=-i),t[n+0]=d,t[n+1]=f,t[n+2]=o,t[n+3]=i,n+=4}for(let e=0;e<500;e++)for(let r=0;r<4;r++){let l=(4*e+r)*4;for(let n=r+1;n<4;n++){let r=(4*e+n)*4,a=t[l+0]-t[r+0],o=t[l+1]-t[r+1],i=a*a+o*o;if(i>0&&i<.010000000000000002){let e=Math.sqrt(i),n=(.1-e)*.45/e;t[l+0]+=a*n,t[l+1]+=o*n,t[r+0]-=a*n,t[r+1]-=o*n;let d=(a*t[l+2]+o*t[l+3]-(a*t[r+2]+o*t[r+3]))/i;t[l+2]-=d*a,t[l+3]-=d*o,t[r+2]+=d*a,t[r+3]+=d*o}}}}requestAnimationFrame(function e(t){s.update(),o.resizeCanvasToDisplaySize(c)&&u.viewport(0,0,u.drawingBufferWidth,u.drawingBufferHeight),u.clear(u.COLOR_BUFFER_BIT),S?(T(_,_,E[0],E[1]),S=!1,E=[0,0]):T(_,_,0,0),u.bindBuffer(u.ARRAY_BUFFER,v),u.bufferSubData(u.ARRAY_BUFFER,0,_),u.bindBuffer(u.ARRAY_BUFFER,null),u.useProgram(p.program),u.bindVertexArray(h.vertexArrayObject),u.drawArrays(u.POINTS,0,2e3),T(_,M,E[0],E[1]);for(let e=1;e<100;e++)T(M,M,0,0);u.bindBuffer(u.ARRAY_BUFFER,A),u.bufferSubData(u.ARRAY_BUFFER,0,M),u.bindBuffer(u.ARRAY_BUFFER,null),u.useProgram(p.program),u.bindVertexArray(y.vertexArrayObject),u.drawArrays(u.POINTS,0,2e3),requestAnimationFrame(e)})}();
//# sourceMappingURL=index.832e1807.js.map
