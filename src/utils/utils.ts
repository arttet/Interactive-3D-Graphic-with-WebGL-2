export function getCanvas(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    if (canvas == null) {
        console.error(`There is no HTML5 Canvas with id ${id} on this page.`);
        return null;
    }
    return canvas;
}

export function getGLContext(canvas: HTMLCanvasElement) {
    const webgl = canvas?.getContext('webgl2')
    if (webgl == null) {
        console.error('WebGL2 is not available in the browser.');
        return null;
    }
    return webgl
}

export function getGLError(gl: WebGL2RenderingContext) {
    console.error(gl.getError());
    return null;
}

export function createShader(gl: WebGL2RenderingContext, type: number, script: string) {
    const shader = gl.createShader(type);
    if (shader == null) {
        return getGLError(gl);
    }

    gl.shaderSource(shader, script);
    gl.compileShader(shader);

    var message = gl.getShaderInfoLog(shader);
    if (message == null || message.length > 0) {
        console.error(message);
        return null;
    }

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
}

export function createProgram(gl: WebGL2RenderingContext, vertexShaderString: string, fragmentShaderString: string) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderString);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderString);
    if (vertexShader == null || fragmentShader == null) {
        return null;
    }

    const program = gl.createProgram();
    if (program == null) {
        return getGLError(gl);
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.validateProgram(program);

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
}
