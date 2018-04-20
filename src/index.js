/**
 * Created by anokhin on 20.04.2018.
 */


const ATTRIBUTE_PARAMETER = 'ATTRIBUTE_PARAMETER';
const ATTRIBUTE_ARGUMENT = 'ATTRIBUTE_ARGUMENT';
const UNIFORM_PARAMETER = 'UNIFORM_PARAMETER';
const UNIFORM_ARRAY_PARAMETER = 'UNIFORM_ARGUMENT_PARAMETER';
const UNIFORM_ARGUMENT = 'UNIFORM_ARGUMENT';
const UNIFORM_ARRAY_ARGUMENT = 'UNIFORM_ARGUMENT_ARRAY';
const CORE_SOURCE = 'CORE_SOURCE';

const argMarks = new Set([
    ATTRIBUTE_ARGUMENT,
    UNIFORM_ARGUMENT,
    UNIFORM_ARRAY_ARGUMENT
]);


const shadowCanvas  = document.createElement('canvas');
const gl = shadowCanvas.getContext('2d');

const shaderCompiler = new ShaderCompiler(gl);
const shaderRunner = new ShaderRunner(gl);

export const glsl = {
    INT: gl.INT,
    FLOAT: gl.FLOAT
};

export function attribute(name, type, value){
    return {
        _mark: ATTRIBUTE_PARAMETER,
        argument: false,
        type,
        name,
        value
    }
}

export function attributeArgument(name, type){
    return {
        _mark: ATTRIBUTE_ARGUMENT,
        type
    }
}

export function uniform(name, type, value){
    return {
        _mark: UNIFORM_PARAMETER,
        type,
        name,
        value
    }
}

export function uniformArray(name, type, size, value){
    return {
        _mark: UNIFORM_ARRAY_PARAMETER,
        type,
        name,
        size,
        value
    }
}

export function uniformParameter(name, type){
    return {
        _mark: UNIFORM_ARGUMENT,
        type,
        name
    }
}

export function uniformArrayParameter(name, type){
    return {
        _mark: UNIFORM_ARRAY_ARGUMENT,
        type,
        name
    }
}

export function core(type, source){
    return {
        type,
        source,
        _mark:  CORE_SOURCE
    }
}

function computeParam(parameter, args){
    return {
        ...parameter,
        value: typeof parameter.value === 'function' ?  parameter.value(...args) : typeof parameter.value,
        size: typeof parameter.size === 'function' ?  parameter.size(...args) : typeof parameter.size
    }
}

function computeArg(argument, args, index){
    return {
        ...argument,
        size: typeof argument.size === 'function' ?  argument.size(...args) : typeof argument.size,
        value: args[index]
    }
}


function generateType(type){
    return type === glsl.INT ? "int" : "float";
}

function generateDeclaration(variable){
    return `${generateType(variable.type)} ${variable.name}${variable.size ? "[${variable.size}]" : ""};`;
}

function generateShaderHeader(variables){
    return `varying v_color;\n${variables.map(v=>generateDeclaration(v)).join('\n')}`;
}
//think about float encoding
const floatColorMap = `
vec4 __color_map__(float z){
   if(z == 0.0){
       return vec4(0.0,0.0,0.0,1.0);
   }
   float sign = 1.0;
   if(z > 0.0){
       sign = -1.0;
   }
   if(sign == -1.0){
       z = -z;
   }
   float exponent = ceil(log2(z));
   float k = sign*z/exponent;
   return vec4(r/255.0,g/255.0,b/255.0,1.0);
}
`;
//think about int encoding
const intColorMap = `
vec4 __color_map__(int n){
   float b = float(mod(n,256));
   float g = float(mod(n/256,256));
   float r = float(mod(n/256/256,256));
   return vec4(r/255.0,g/255.0,b/255.0,1.0);
}
`;

function generateShaderBody(core){
    return `${core.source}
     
           ${core.type === glsl.FLOAT ? floatColorMap : intColorMap}
     
           void main(){
               v_color = __color_map__(core());
               gl_Position = _position_;
               gl_PointSize = 1.0;
           }`
}



export function createShader(...rest){
    const args = rest.filter(a=>argMarks.has(a._mark));
    const params = rest.filter(a=>!argMarks.has(a._mark) && a._mark !== CORE_SOURCE);
    const core = rest.find(a=>a._mark === CORE_SOURCE);
    return function(...rest){
        const programParams = [...params.map(p=> computeParam(p,rest)),...args.map((a,i)=>computeArg(a,rest,i))];
        const shaderCode = `${generateShaderHeader(programParams)}\n ${generateShaderBody(core)}`;
        shaderCompiler.compile(shaderCode);
        shaderRunner.run(shaderCompiler.getProgram(), programParams, core);
        return shaderRunner.getResult();
    }
}