var o="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},e={},r={},i=o.parcelRequire94c2;null==i&&((i=function(o){if(o in e)return e[o].exports;if(o in r){var i=r[o];delete r[o];var n={id:o,exports:{}};return e[o]=n,i.call(n.exports,n,n.exports),n.exports}var t=Error("Cannot find module '"+o+"'");throw t.code="MODULE_NOT_FOUND",t}).register=function(o,e){r[o]=e},o.parcelRequire94c2=i);var n=i("amYBK");const t=document.querySelector("#c"),a=t.getContext("webgl2");n.resizeCanvasToDisplaySize(t),a.viewport(0,0,a.drawingBufferWidth,a.drawingBufferHeight),a.clearColor(.5,.5,.75,1);const l=n.createProgramInfo(a,[`#version 300 es

    in vec2 a_position;

    out vec3 v_col;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_col = a_position.x * vec3(1.5, 0.5, 0.2) 
              + a_position.y * vec3(0.2, 1.5, 0.0) 
              + (2.0 - a_position.x - a_position.y) * vec3(0.0, 0.2, 1.5);
    }
    `,`#version 300 es
    precision highp float;

    in vec3 v_col;
    
    out vec4 out_color;
    void main() {
        out_color = vec4(v_col, 1);
    }
    `]),s=n.createBufferInfoFromArrays(a,{a_position:{data:[0,0,0,.8,.5,0],numComponents:2}});console.log(l),console.log(s),a.clear(a.COLOR_BUFFER_BIT),a.useProgram(l.program),n.setBuffersAndAttributes(a,l,s),n.drawBufferInfo(a,s);
//# sourceMappingURL=index.dd904b50.js.map
