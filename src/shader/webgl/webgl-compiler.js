/**
 * Created by anokhin on 20.04.2018.
 */
export class WebGlCompiler {


    static printLog(logMap) {
        Object.entries(logMap).forEach(log => {
            if (log[1].length) {
                console.error(log[0]);
                console.error(log[1]);
            }
        });
    }

    constructor(gl, vertexShaderSource, fragmentShaderSource) {
        this.gl = gl;
        this.program = this.gl.createProgram();
        const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.sources = {
            VERTEX: vertexShaderSource,
            FRAGMENT: fragmentShaderSource
        };
        console.log(vertexShaderSource);
        this.gl.shaderSource(vertexShader, vertexShaderSource);
        this.gl.shaderSource(fragmentShader, fragmentShaderSource);
        this.gl.compileShader(vertexShader);
        this.gl.compileShader(fragmentShader);
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);
        this.compilationLog(vertexShader, fragmentShader);
    }


    compilationLog(vertexShader, fragmentShader) {
        const vertexLog = this.gl.getShaderInfoLog(vertexShader);
        const fragmentLog = this.gl.getShaderInfoLog(fragmentShader);
        const programLog = this.gl.getProgramInfoLog(this.program);
        WebGlCompiler.printLog({vertexLog, fragmentLog, programLog});
    }


    getProgram() {
        return this.program;
    }

    getContext() {
        return this.gl;
    }
}