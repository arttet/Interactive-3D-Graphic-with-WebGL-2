import { mat4 } from "gl-matrix";

import { createProgram } from '../utils/utils'

import vertexShaderString from '../shaders/nissan-gtr/nissan-gtr.vert'
import fragmentShaderString from '../shaders/nissan-gtr/nissan-gtr.frag'


let projectionMatrix = mat4.create();
let modelViewMatrix = mat4.create();

let parts = new Array<any>();

let aVertexPosition: number;
let uProjectionMatrix: WebGLUniformLocation | null;
let uModelViewMatrix: WebGLUniformLocation | null;

let finished: boolean;

export function init(gl: WebGL2RenderingContext) {
    const program = createProgram(gl, vertexShaderString, fragmentShaderString)
    if (program == null) {
        return;
    }

    aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
    uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');

    loadModel(gl);

    const render = () => {
        let requestAnimationFrameId = requestAnimationFrame(render);
        draw(gl, program);
        if (finished) {
            cancelAnimationFrame(requestAnimationFrameId);
        }
    };
    render();
}

function clear(gl: WebGL2RenderingContext) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

function draw(gl: WebGL2RenderingContext, program: WebGLProgram) {
    clear(gl);

    mat4.perspective(projectionMatrix, 45, gl.canvas.width / gl.canvas.height, 10, 10000);
    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, modelViewMatrix, [-10, 0, -100]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, 30 * Math.PI / 180, [1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, 30 * Math.PI / 180, [0, 1, 0]);

    gl.useProgram(program);

    gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);

    // Iterate over every part inside of the `parts` array
    parts.forEach(part => {
        // Bind
        gl.bindVertexArray(part.vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, part.ibo);

        // Draw
        gl.drawElements(gl.LINES, part.indices.length, gl.UNSIGNED_SHORT, 0);

        // Clean
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    });

    // Clean
    gl.useProgram(null);
}

function loadModel(gl: WebGL2RenderingContext) {
    let loadedModel: number = 1;
    for (let i = 1; i < 179; i++) {
        fetch(`models/nissan-gtr/part${i}.json`)
            .then(result => result.json())
            .then(data => {
                // VAO
                const vao = gl.createVertexArray();
                gl.bindVertexArray(vao);

                // VBO
                const vertexBufferObject = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertices), gl.STATIC_DRAW);

                // Configure instructions
                gl.enableVertexAttribArray(aVertexPosition);
                gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);

                // IBO
                const indexBufferObject = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);

                // Attach them for later access
                data.vao = vao;
                data.ibo = indexBufferObject;

                // Push data onto parts array
                parts.push(data);

                // Clean
                gl.bindVertexArray(null);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            })
            .catch(console.error).finally(function () {
                ++loadedModel;
                if (loadedModel === 179) {
                    finished = true;
                }
            });
    }
}
