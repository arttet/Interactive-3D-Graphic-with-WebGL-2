import { createProgram } from '../utils/utils'

import vertexShaderString from '../shaders/square/square.vert'
import fragmentShaderString from '../shaders/square/square.frag'

const model = {
    vertices: [
        -0.5, 0.5, 0,  //
        -0.5, -0.5, 0, //
        0.5, -0.5, 0,  //
        0.5, 0.5, 0,   //
    ],

    colors: [
        0.00, 0.50, 1.00, 1.0, // Azure (color)
        0.0, 0.0, 0.0, 1.0, // Black (color)
        0.00, 0.50, 1.00, 1.0, // Azure (color)
        0.0, 0.0, 0.0, 1.0, // Black (color)
    ],

    indices: [
        0, 1, 2,
        0, 2, 3,
    ]
};

let vao: WebGLVertexArrayObject | null;

let vertexBuffer: WebGLBuffer | null;
let colorBuffer: WebGLBuffer | null;
let indexBuffer: WebGLBuffer | null;

let aVertexPosition: number;
let aVertexColor: number;

export function init(gl: WebGL2RenderingContext) {
    const program = createProgram(gl, vertexShaderString, fragmentShaderString)
    if (program == null) {
        return;
    }

    aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
    aVertexColor = gl.getAttribLocation(program, "aVertexColor");

    initBuffers(gl);

    draw(gl, program);
}

function initBuffers(gl: WebGL2RenderingContext) {
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.colors), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexColor);

    gl.bindVertexArray(null);
}

function clear(gl: WebGL2RenderingContext) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

function draw(gl: WebGL2RenderingContext, program: WebGLProgram) {
    clear(gl);

    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // Draw to the scene using triangle primitives
    gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);

    // Clean
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
    gl.useProgram(null);
}
