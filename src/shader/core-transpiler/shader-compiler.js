import {WebGlCompiler} from "../webgl/webgl-compiler";
import Fragment from "../components/fragment/fragment";

export class ShaderCompiler {

    constructor(gl) {
        this.gl = gl;
    }

    compile(Vertex) {
        this.webglCompiler = new WebGlCompiler(this.gl, Vertex, Fragment);
    }

    getProgram() {
        this.webglCompiler.getProgram();
    }
}