import * as twgl from "twgl.js"

import Stats from "stats.js"
// stats();
var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const updatePositionVS = `#version 300 es
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
`;

const updatePositionFS = `#version 300 es
precision highp float;
void main() {
}
`;

const drawParticlesVS = `#version 300 es
in vec4 position;
uniform mat4 matrix;

void main() {
  // do the common matrix math
  gl_Position = matrix * position;
  gl_PointSize = 10.0;
}
`;

const drawParticlesFS = `#version 300 es
precision highp float;
out vec4 outColor;
void main() {
  outColor = vec4(1, 0, 0, 1);
}
`;

// Get A WebGL context
/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("#c")! as HTMLCanvasElement;
const gl = canvas.getContext("webgl2")!;
if (!gl) {
    throw new Error("no webgl2");
}

const updatePositionProgInfo = twgl.createProgramInfo(gl, [updatePositionVS, updatePositionFS], {
    transformFeedbackVaryings: ["newPosition"],
    transformFeedbackMode: gl.SEPARATE_ATTRIBS,
});
const drawParticlesProgInfo = twgl.createProgramInfo(gl, [drawParticlesVS, drawParticlesFS]);

// we're going to base the initial positions on the size
// of the canvas so lets update the size of the canvas
// to the initial size we want
twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// create random positions and velocities.
const rand = (min, max) => {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.random() * (max - min) + min;
};
const numParticles = 200;
const createPoints = (num, ranges) =>
    new Array(num).fill(0).map(_ => ranges.map(range => rand(...range))).flat();
const positions = new Float32Array(createPoints(numParticles, [[canvas.width], [canvas.height]]));
const velocities = new Float32Array(createPoints(numParticles, [[-300, 300], [-300, 300]]));

const position1Buffer = twgl.createBufferFromTypedArray(gl, positions, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
const position2Buffer = twgl.createBufferFromTypedArray(gl, positions, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
const velocityBuffer = twgl.createBufferFromTypedArray(gl, velocities, gl.ARRAY_BUFFER, gl.STATIC_DRAW);

const updatePositionBI1to2 = twgl.createBufferInfoFromArrays(gl, {
    oldPosition: {
        buffer: position1Buffer,
        numComponents: 2,
        type: Float32Array,
    },
    velocity: {
        buffer: velocityBuffer,
        numComponents: 2,
        type: Float32Array,
    },
    newPosition: {
        buffer: position2Buffer,
        numComponents: 2,
        type: Float32Array,
    },
})
const updatePositionVAI1to2 = twgl.createVertexArrayInfo(gl, updatePositionProgInfo, updatePositionBI1to2);

const updatePositionBI2to1 = twgl.createBufferInfoFromArrays(gl, {
    oldPosition: {
        buffer: position2Buffer,
        numComponents: 2,
        type: Float32Array,
    },
    velocity: {
        buffer: velocityBuffer,
        numComponents: 2,
        type: Float32Array,
    },
    newPosition: {
        buffer: position1Buffer,
        numComponents: 2,
        type: Float32Array,
    },
})
const updatePositionVAI2to1 = twgl.createVertexArrayInfo(gl, updatePositionProgInfo, updatePositionBI2to1);


const drawVAI1 = twgl.createVertexArrayInfo(gl, drawParticlesProgInfo, twgl.createBufferInfoFromArrays(gl, {
    position: {
        buffer: position1Buffer,
        numComponents: 2,
        type: Float32Array,
    }
}));

const drawVAI2 = twgl.createVertexArrayInfo(gl, drawParticlesProgInfo, twgl.createBufferInfoFromArrays(gl, {
    position: {
        buffer: position2Buffer,
        numComponents: 2,
        type: Float32Array,
    }
}));

// const tf1 = gl.createTransformFeedback();
// gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf1);
// gl.useProgram(updatePositionProgInfo.program);
// gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 
//     updatePositionProgInfo.transformFeedbackInfo!.newPosition.index,
//     updatePositionBI2.attribs!.newPosition.buffer
// );
const tf2to1 = twgl.createTransformFeedback(gl, updatePositionProgInfo, updatePositionBI2to1);
const tf1to2 = twgl.createTransformFeedback(gl, updatePositionProgInfo, updatePositionBI1to2);

// unbind left over stuff
gl.bindBuffer(gl.ARRAY_BUFFER, null);

let current = {
    // updateBI: updatePositionBI1to2,
    updateVAI: updatePositionVAI1to2,  // read from position1
    tf: tf1to2,                        // write to position2
    drawVAI: drawVAI2,              // draw with position2
};
let next = {
    // updateBI: updatePositionBI2to1,
    updateVAI: updatePositionVAI2to1,  // read from position2
    tf: tf2to1,                        // write to position1
    drawVAI: drawVAI1,              // draw with position1
};

let then = 0;
function render(time) {
    stats.update();
    // convert to seconds
    time *= 0.001;
    // Subtract the previous time from the current time
    const deltaTime = time - then;
    // Remember the current time for the next frame.
    then = time;

    if (twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement)) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    gl.clear(gl.COLOR_BUFFER_BIT);

    // compute the new positions
    gl.useProgram(updatePositionProgInfo.program);
    gl.bindVertexArray(current.updateVAI.vertexArrayObject!);
    /*
    Same as bindVertexArray, if we had no vertex array:
    twgl.setBuffersAndAttributes(gl, updatePositionProgInfo, current.updateBI);
    */
    twgl.setUniformsAndBindTextures(updatePositionProgInfo, {
        canvasDimensions: [gl.canvas.width, gl.canvas.height],
        deltaTime: deltaTime,
    })


    gl.enable(gl.RASTERIZER_DISCARD);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, current.tf);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, numParticles);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    // turn on using fragment shaders again
    gl.disable(gl.RASTERIZER_DISCARD);

    // now draw the particles.
    gl.useProgram(drawParticlesProgInfo.program);
    gl.bindVertexArray(current.drawVAI.vertexArrayObject!);
    twgl.setUniformsAndBindTextures(drawParticlesProgInfo, {
        matrix: twgl.m4.ortho(0, gl.canvas.width, 0, gl.canvas.height, -1, 1)
    })
    gl.drawArrays(gl.POINTS, 0, numParticles);

    // swap which buffer we will read from
    // and which one we will write to
    {
        const temp = current;
        current = next;
        next = temp;
    }

    requestAnimationFrame(render);
}
requestAnimationFrame(render);
