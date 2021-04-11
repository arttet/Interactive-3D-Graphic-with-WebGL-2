import { getCanvas, getGLContext } from './utils/utils'

import run from './template/run.html'

import { init as initSquare } from './demo/001-square';
import { init as initNissanGTR } from './demo/002-nissan-gtr';

function main() {
    let canvas = getCanvas('canvas');
    const gl = getGLContext(canvas!);
    if (canvas == null || gl == null) {
        window.location = <any>"https://get.webgl.org/";
    } else {
        document.getElementById('main')!.innerHTML = run;
        const resize = () => {
            canvas!.width = window.innerWidth;
            canvas!.height = window.innerHeight;
        };
        resize();

        var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        var vendor = gl.getParameter(debugInfo!.UNMASKED_VENDOR_WEBGL);
        var renderer = gl.getParameter(debugInfo!.UNMASKED_RENDERER_WEBGL);

        console.info(vendor);
        console.info(renderer);

        const checkbox = <HTMLSelectElement>document.getElementById("demo");
        checkbox!.onchange = () => {
            resize();
            demoInit(gl, Number(checkbox.value));
        };

        window.addEventListener('resize', resize);
    }
}

function demoInit(gl: WebGL2RenderingContext, demoNumber: number) {
    switch (demoNumber) {
        case 1:
            initSquare(gl);
            break;
        case 2:
            initNissanGTR(gl);
            break;
        default:
            gl.clearColor(0.96078431372, 0.96078431372, 0.96078431372, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            break;
    }
}

window.onload = main;
