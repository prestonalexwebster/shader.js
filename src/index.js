/**
 * Created by anokhin on 20.04.2018.
 */
import {glslMod, encodeFloat, encodeInt} from './encoders';
import {
    glsl,
    ATTRIBUTE_PARAMETER,
    ATTRIBUTE_ARGUMENT,
    UNIFORM_PARAMETER,
    UNIFORM_ARRAY_PARAMETER,
    UNIFORM_ARGUMENT,
    UNIFORM_ARRAY_ARGUMENT,
    CORE_SOURCE,
    GRID_2D_INT,
    gl,
    shadowCanvas
}
    from './constants.js';


const argMarks = new Set([
    ATTRIBUTE_ARGUMENT,
    UNIFORM_ARGUMENT,
    UNIFORM_ARRAY_ARGUMENT
]);

const uniformMarks = new Set([    UNIFORM_PARAMETER,
    UNIFORM_ARRAY_PARAMETER,
    UNIFORM_ARGUMENT,
    UNIFORM_ARRAY_ARGUMENT]);

const attributeMarks = new Set([
    ATTRIBUTE_PARAMETER,
    ATTRIBUTE_ARGUMENT
]);


export
glsl;

const shaderCompiler = new ShaderCompiler(gl);
const shaderRunner = new ShaderRunner(gl);


export function attribute(name, type, value) {
    return {
        _mark: ATTRIBUTE_PARAMETER,
        argument: false,
        type,
        name,
        value
    }
}

export function attributeArgument(name, type) {
    return {
        _mark: ATTRIBUTE_ARGUMENT,
        type
    }
}

export function uniform(name, type, value) {
    return {
        _mark: UNIFORM_PARAMETER,
        type,
        name,
        value
    }
}

export function uniformArray(name, type, size, value) {
    return {
        _mark: UNIFORM_ARRAY_PARAMETER,
        type,
        name,
        size,
        value
    }
}

export function uniformArgument(name, type) {
    return {
        _mark: UNIFORM_ARGUMENT,
        type,
        name
    }
}

export function uniformArrayArgument(name, type,size) {
    return {
        _mark: UNIFORM_ARRAY_ARGUMENT,
        type,
        size,
        name
    }
}

export function grid2DInt(nameX, nameY, maxX, maxY) {
    return {
        _mark: GRID_2D_INT,
        nameX,
        nameY,
        maxX,
        maxY
    }
}

export function core(type, source) {
    return {
        type,
        source,
        _mark: CORE_SOURCE
    }
}

function computeParam(parameter, args) {
    return {
        ...parameter,
        value: typeof parameter.value === 'function' ? parameter.value(...args) : typeof parameter.value,
        size: typeof parameter.size === 'function' ? parameter.size(...args) : typeof parameter.size
    }
}

function computeArg(argument, args, index) {
    return {
        ...argument,
        size: typeof argument.size === 'function' ? argument.size(...args) : typeof argument.size,
        value: args[index]
    }
}


function generateType(type) {
    return type === glsl.INT ? "int" : "float";
}

function generateDeclaration(variable) {
    return `${generateType(variable.type)} ${variable.name}${variable.size ? "[${variable.size}]" : ""};`;
}

function generateShaderHeader(variables) {
    return `varying v_color;\n${variables.map(v => generateDeclaration(v)).join('\n')}`;
}


const floatColorMap = `${glslMod}\n${encodeFloat}\n`;
const intColorMap = `${glslMod}\n${encodeInt}\n`;

function generateShaderBody(core) {
    return `${core.source}
     
           ${core.type === glsl.FLOAT ? floatColorMap : intColorMap}
     
   
           void main(){
               v_color = __color_map__(core());
               gl_Position = __get_position__();
               gl_PointSize = 1.0;
           }`
}

function generateIndexes(name, axis, maxX, maxY) {
    const indexes = new Int32Array(maxX * maxY);
    for (let y = 0; y < maxY; ++y) {
        for (let x = 0; x < maxX; ++x) {
            indexes[y * maxX + x] = axis == 'x' ? x : y;
        }
    }
    return {
        name,
        scale: axis == 'x' ? maxX : maxY,
        value: indexes,
        type: glsl.INT
    };
}

function extractGridParams(grid, rest) {
    if (!grid) return [];
    const X = typeof grid.maxX === 'function' ? grid.maxX(rest) : grid.maxX;
    const Y = typeof grid.maxY === 'function' ? grid.maxY(rest) : grid.maxY;
    return [
        generateIndexes(grid.nameX, 'x', X, Y),
        generateIndexes(grid.nameX, 'y', X, Y)
    ]
}


function generatePositionGetter(grid){
    if(!grid) throw "Grid is required";
    return `
    vec2 __get_position__(){
        float x = float(${grid[0].name})/${grid[0].scale/2}-1.0;
        float y = 1.0-float(${grid[1].name})/${grid[1].scale/2};
        return vec2(x,y);
    }
    `;
}

function configureShadowCanvas(grid){
    if(!grid) return;
    shadowCanvas.width = grid[0].scale;
    shadowCanvas.height = grid[1].scale;
}

export function createShader(...rest) {
    const args = rest.filter(a => argMarks.has(a._mark));
    const params = rest.filter(a => !argMarks.has(a._mark) && a._mark !== CORE_SOURCE && a._mark != GRID_2D_INT);
    const grid = rest.find(a => a._mark === GRID_2D_INT);
    const core = rest.find(a => a._mark === CORE_SOURCE);
    return function (...rest) {
        const gridParams = extractGridParams(grid, rest);
        const programParams = [...gridParams, ...params.map(p => computeParam(p, rest)), ...args.map((a, i) => computeArg(a, rest, i))];
        const shaderCode = `${generateShaderHeader(programParams)}\n ${generatePositionGetter(gridParams)}\n ${generateShaderBody(core)}`;
        configureShadowCanvas(gridParams);
        shaderCompiler.compile(shaderCode);
        shaderRunner.run(shaderCompiler.getProgram(), programParams, core);
        return shaderRunner.getResult();
    }
}