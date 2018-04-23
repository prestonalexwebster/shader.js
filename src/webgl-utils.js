/**
 * Created by anokhin on 20.04.2018.
 */
export class WebGlCompiler {


    static printLog(logMap){
        Object.entries(logMap).forEach(log=>{
            if(log[1].length){
                console.error(log[0]);
                console.error(log[1]);
            }
        });
    }

    constructor(gl,vertexShaderSource, fragmentShaderSource){
        this.gl = gl;
        this.program = this.gl.createProgram();
        const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.sources = {
            VERTEX: vertexShaderSource,
            FRAGMENT: fragmentShaderSource
        };
        this.gl.shaderSource(vertexShader,vertexShaderSource);
        this.gl.shaderSource(fragmentShader,fragmentShaderSource);
        this.gl.compileShader(vertexShader);
        this.gl.compileShader(fragmentShader);
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);
        this.compilationLog(vertexShader,fragmentShader);
    }


    compilationLog(vertexShader,fragmentShader){
        const vertexLog = this.gl.getShaderInfoLog(vertexShader);
        const fragmentLog = this.gl.getShaderInfoLog(fragmentShader);
        const programLog = this.gl.getProgramInfoLog(this.program);
        WebGlCompiler.printLog({vertexLog,fragmentLog,programLog});
    }


    getProgram(){
        return this.program;
    }

    getContext(){
        return this.gl;
    }
}



export class WebGlRunner {

    constructor(gl,program){
        this.gl = gl;
        this.program = program;
    }

    setUniform1fv(name,value){
        const uniform = this.gl.getUniformLocation(this.program, name);
        this.gl.uniform1fv(uniform, new Float32Array(value));
    }


    setUniform1iv(name, value){
        const uniform = this.gl.getUniformLocation(this.program, name);
        this.gl.uniform1iv(uniform, new Int32Array(value));
    }



    setUniform1f(name,value){
        const uniform = this.gl.getUniformLocation(this.program, name);
        this.gl.uniform1f(uniform, value);
    }

    setUniform1i(name,value){
        const uniform = this.gl.getUniformLocation(this.program, name);
        this.gl.uniform1i(uniform, value);
    }


    setAttribFloat(name, vertices, step){
        const vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        const v_data = this.gl.getAttribLocation(this.program, name);
        this.gl.vertexAttribPointer(v_data, step, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(v_data);
        return vertices.length/step;
    }

    setAttribInt(name, vertices, step){
        const vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        const v_data = this.gl.getAttribLocation(this.program, name);
        this.gl.vertexAttribPointer(v_data, step, this.gl.INT, false, 0, 0);
        this.gl.enableVertexAttribArray(v_data);
        return vertices.length/step;
    }

    setAttributes(){
        return 0;
    }

    run(){
        this.gl.clearColor(0,0,0,0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.program);

        const n = this.setAttributes();
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.BLEND) ;

        this.gl.drawArrays(this.gl.Points, 0, n);
    }
}
