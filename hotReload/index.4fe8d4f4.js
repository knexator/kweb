function e(e,n,o,r){Object.defineProperty(e,n,{get:o,set:r,enumerable:!0,configurable:!0})}function n(e){return e&&e.__esModule?e.default:e}var o="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},r={},t={},i=o.parcelRequire94c2;null==i&&((i=function(e){if(e in r)return r[e].exports;if(e in t){var n=t[e];delete t[e];var o={id:e,exports:{}};return r[e]=o,n.call(o.exports,o,o.exports),o.exports}var i=Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,n){t[e]=n},o.parcelRequire94c2=i),i.register("kyEFX",function(n,o){"use strict";e(n.exports,"register",function(){return r},function(e){return r=e}),e(n.exports,"resolve",function(){return t},function(e){return t=e});var r,t,i={};r=function(e){for(var n=Object.keys(e),o=0;o<n.length;o++)i[n[o]]=e[n[o]]},t=function(e){var n=i[e];if(null==n)throw Error("Could not resolve bundle with id "+e);return n}}),i("kyEFX").register(JSON.parse('{"bTBLj":"index.4fe8d4f4.js","lYk9n":"sprite.22ec2077.png","2yR5D":"index.9ef1ce9c.js"}'));var s=i("amYBK"),a={};a="#version 300 es\n#define GLSLIFY 1\n\n// [0, 1]^2\nin vec2 a_vertex;\n\n// pixels for everything\nuniform vec2 u_resolution;\nuniform vec2 u_position;\nuniform vec2 u_size;\n\nout vec2 v_texcoord;\n\nvoid main() {\n    // if size is 100 & screen is 400, then\n    // clip space result width will be .5\n    vec2 pos = 2.0 * a_vertex * u_size / u_resolution;\n\n    // if position is 200 & screen is 400, then\n    // clip space result offset will be .5\n    pos += 2.0 * u_position / u_resolution;\n\n    // pos of 0 should go to the top left\n    pos -= vec2(1, 1);\n\n    // ypos = down\n    pos.y = -pos.y;\n\n    gl_Position = vec4(pos, 0, 1);\n\n    v_texcoord = a_vertex;\n}\n\n// todo: investigate glslify";var u={};u="#version 300 es\nprecision highp float;\n#define GLSLIFY 1\n\nin vec2 v_texcoord;\n\nuniform sampler2D u_texture;\n\nout vec4 out_color;\n\nvoid main() {\n    out_color = texture(u_texture, v_texcoord);\n}";const c=document.querySelector("#c").getContext("webgl2",{alpha:!1});c.clearColor(.5,.5,.75,1),c.enable(c.BLEND),c.blendFunc(c.SRC_ALPHA,c.ONE_MINUS_SRC_ALPHA),s.resizeCanvasToDisplaySize(c.canvas),c.viewport(0,0,c.drawingBufferWidth,c.drawingBufferHeight);var d={};d=new URL("../"+i("kyEFX").resolve("lYk9n"),import.meta.url).toString();const l=s.createTexture(c,{src:new URL(d).toString()}),f=s.createProgramInfo(c,[n(a),n(u)]),_=s.createBufferInfoFromArrays(c,{a_vertex:{data:[1,1,0,1,1,0,0,0,1,0,0,1],numComponents:2}}),p=s.createVertexArrayInfo(c,f,_);console.log("a"),console.log("c");let v={x:0,y:0},w={w_down:!1,a_down:!1,s_down:!1,d_down:!1};requestAnimationFrame(function e(){s.resizeCanvasToDisplaySize(c.canvas)&&c.viewport(0,0,c.drawingBufferWidth,c.drawingBufferHeight),w.a_down&&(v.x-=1),w.d_down&&(v.x+=1),w.w_down&&(v.y-=1),w.s_down&&(v.y+=1),console.log(v.x,v.y),c.clear(c.COLOR_BUFFER_BIT),c.useProgram(f.program),s.setBuffersAndAttributes(c,f,p),s.setUniforms(f,{u_texture:l,u_resolution:[c.canvas.width,c.canvas.height],u_size:[50,50],u_position:[v.x,v.y]}),s.drawBufferInfo(c,_),requestAnimationFrame(e)}),document.addEventListener("keydown",function(e){switch(console.log("keydown"),e.key.toUpperCase()){case"D":w.d_down=!0;break;case"A":w.a_down=!0;break;case"W":w.w_down=!0;break;case"S":w.s_down=!0}}),document.addEventListener("keyup",function(e){switch(console.log("keyup"),e.key.toUpperCase()){case"D":w.d_down=!1;break;case"A":w.a_down=!1;break;case"W":w.w_down=!1;break;case"S":w.s_down=!1}});
//# sourceMappingURL=index.4fe8d4f4.js.map
