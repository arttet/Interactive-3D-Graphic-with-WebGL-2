#version 300 es
precision mediump float;

in vec3 aVertexPosition;
in vec4 aVertexColor;

out vec4 color;

void main(void) {
    gl_Position = vec4(aVertexPosition, 1.);
    color = aVertexColor;
}
