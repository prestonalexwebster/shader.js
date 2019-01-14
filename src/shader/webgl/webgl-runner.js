export class WebGlRunner {

    constructor(gl, program) {
        this.gl = gl;
        this.program = program;
    }

    setUniform1fv(name, value) {
        const uniform = this.gl.getUniformLocation(this.program, name);
        this.gl.uniform1fv(uniform, new Float32Array(value));
    }


    setUniform1iv(name, value) {
        const uniform = this.gl.getUniformLocation(this.program, name);
        this.gl.uniform1iv(uniform, new Int32Array(value));
    }


    setUniform1f(name, value) {
        const uniform = this.gl.getUniformLocation(this.program, name);
        this.gl.uniform1f(uniform, value);
    }

    setUniform1i(name, value) {
        const uniform = this.gl.getUniformLocation(this.program, name);
        this.gl.uniform1i(uniform, value);
    }


    setAttribFloat(name, vertices, step) {
        const vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        const v_data = this.gl.getAttribLocation(this.program, name);
        this.gl.vertexAttribPointer(v_data, step, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(v_data);
        return vertices.length / step;
    }

    setAttribInt(name, vertices, step) {
        const vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        const v_data = this.gl.getAttribLocation(this.program, name);
        this.gl.vertexAttribPointer(v_data, step, this.gl.INT, false, 0, 0);
        this.gl.enableVertexAttribArray(v_data);
        return vertices.length / step;
    }

    setAttributes() {
        return 0;
    }

    run() {
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.program);

        const n = this.setAttributes();
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.BLEND);

        this.gl.drawArrays(this.gl.Points, 0, n);
    }
}