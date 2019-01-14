import {WebGlCompiler} from "../webgl/webgl-compiler";

const fragmentGlsl =
`
precision mediump float;
varying vec4 v_color;

void main(){
    gl_FragColor = v_color;
}
`;

export class ShaderCompiler {

    constructor(gl) {
        this.gl = gl;
    }

    compile(code) {
        this.webglCompiler = new WebGlCompiler(this.gl, code, fragmentGlsl);
    }

    getProgram() {
        this.webglCompiler.getProgram();
    }
}