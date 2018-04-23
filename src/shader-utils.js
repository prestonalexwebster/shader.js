/**
 * Created by anokhin on 23.04.2018.
 */
import {decodeReducedFloat, getFloat, decodeInt} from './encoders.js';
import {glsl, ATTRIBUTE_PARAMETER, ATTRIBUTE_ARGUMENT, UNIFORM_PARAMETER, UNIFORM_ARRAY_PARAMETER, UNIFORM_ARGUMENT,UNIFORM_ARRAY_ARGUMENT}
from './constants.js';




function extractFloat(bytes){
    return getFloat(decodeReducedFloat(bytes));
}

function extractInt(bytes){
    return decodeInt(bytes);
}

function extractValues(gl, type){
    const w = gl.drawingBufferWidth;
    const h = gl.drawingBufferHeight;
    const pix = new Uint8Array(w*h*4);
    gl.readPixels(0,0,w, h,gl.RGBA,gl.UNSIGNED_BYTE,pix);
    const values = (type === glsl.FLOAT ? new Float32Array(w*h) : new Int32Array(w*h));
    for(let i = 0; i*4 < pix.length; ++i){
        values[i] = (type === glsl.FLOAT ? extractFloat([pix[i*4],pix[i*4+1],pix[i*4+2]]) : extractInt([pix[i*4],pix[i*4+1],pix[i*4+2]]));
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