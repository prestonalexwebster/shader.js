/**
 * Created by anokhin on 20.04.2018.
 */

const ATTRIBUTE_PARAMETER = 'ATTRIBUTE_PARAMETER';
const ATTRIBUTE_ARGUMENT = 'ATTRIBUTE_ARGUMENT';
const UNIFORM_PARAMETER = 'UNIFORM_PARAMETER';
const UNIFORM_ARRAY_PARAMETER = 'UNIFORM_ARGUMENT_PARAMETER';
const UNIFORM_ARGUMENT = 'UNIFORM_ARGUMENT';
const UNIFORM_ARRAY_ARGUMENT = 'UNIFORM_ARGUMENT_ARRAY';

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

function getFloat(r,g,b){
    return r*256*256+g*256+b;
}

function getInt(r,g,b){
    return parseInt(r*255)*256*256+parseInt(g*255)*256*256+parseInt(b*255);
}

function extractValues(gl, type){
    const w = gl.drawingBufferWidth;
    const h = gl.drawingBufferHeight;
    const pix = new Uint8Array(w*h*4);
    gl.readPixels(0,0,w, h,gl.RGBA,gl.UNSIGNED_BYTE,pix);
    const values = (type === glsl.FLOAT ? new Float32Array(w*h) : new Int32Array(w*h));
    for(let i = 0; i*4 < pix.length; ++i){
        values[i] = (type === glsl.FLOAT ? getFloat(pix[i*4],pix[i*4+1],pix[i*4+2]) : getInt(pix[i*4],pix[i*4+1],pix[i*4+2]));
    }
    return values;
}

export class ShaderCompiler{

    constructor(gl){
        this.gl = gl;
    }

    compile(code){
        this.webglCompiler = new WebGlCompiler(this.gl,code,`
            precision mediump float;
            varying vec4 v_color;

            void main(){
              gl_FragColor = v_color;
            }
        `);
    }

    getProgram(){
        this.webglCompiler.getProgram();
    }
}

export class ShaderRunner {

    constructor(gl){
        this.gl = gl;
    }

    setAttributes(params){
        let vertices = 0;
        for(let param of params){
            switch(param._mark){
                case  ATTRIBUTE_PARAMETER:
                case ATTRIBUTE_ARGUMENT:{
                    let step = param.size || 1;
                    if(param.type === glsl.FLOAT){
                        this.webglRunner.setAttribFloat(param.name,param.value,step);
                    }else{
                        this.webglRunner.setAttribInt(param.name,param.value,step);
                    }
                    vertices = param.value.length/step;
                    break;
                }
                case UNIFORM_PARAMETER:
                case  UNIFORM_ARGUMENT:{
                    if(param.type === glsl.FLOAT){
                        this.webglRunner.setUniform1f(param.name,param.value);
                    }else{
                        this.webglRunner.setUniform1i(param.name,param.value);
                    }
                    break;
                }
                case  UNIFORM_ARRAY_PARAMETER:
                case UNIFORM_ARRAY_ARGUMENT:{
                    if(param.type === glsl.FLOAT){
                        this.webglRunner.setUniform1fv(param.name,param.value);
                    }else{
                        this.webglRunner.setUniform1iv(param.name,param.value);
                    }
                    break;
                }
            }
        }
        return vertices;
    }

    run(program, params, entry){
        this.returnType = entry.type;
        this.webglRunner = new WebGlRunner(this.gl,program);
        this.webglRunner.setAttributes = () => this.setAttributes(params);
        this.webglRunner.run();
    }

    getResult(){
        return extractValues(this.gl, this.returnType);
    }
}