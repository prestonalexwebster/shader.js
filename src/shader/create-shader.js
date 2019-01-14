/**
 * Created by anokhin on 20.04.2018.
 */
import VertexCode from './components/vertex-code/vertex-code';
import {
    ATTRIBUTE_ARGUMENT,
    CORE_SOURCE,
    gl,
    GRID_2D_INT,
    shadowCanvas,
    UNIFORM_ARGUMENT,
    UNIFORM_ARRAY_ARGUMENT,
} from './core-transpiler/constants.js';
import {ShaderRunner} from "./core-transpiler/shader-runner";
import {ShaderCompiler} from "./core-transpiler/shader-compiler";
import {bridge, computeArg, computeParam} from "./bridge";



const argMarks = new Set([
    ATTRIBUTE_ARGUMENT,
    UNIFORM_ARGUMENT,
    UNIFORM_ARRAY_ARGUMENT
]);


const shaderCompiler = new ShaderCompiler(gl);
const shaderRunner = new ShaderRunner(gl);


function configureShadowCanvas(grid){
    if(!grid) return;
    shadowCanvas.width = grid[0].scale;
    shadowCanvas.height = grid[1].scale;
}


export function createShader(...rest) {
    const args = rest.filter(a => argMarks.has(a._mark));
    const params = rest.filter(a => !argMarks.has(a._mark) && a._mark !== CORE_SOURCE && a._mark !== GRID_2D_INT);
    const grid = rest.find(a => a._mark === GRID_2D_INT);
    const core = rest.find(a => a._mark === CORE_SOURCE);
    return function (...rest) {
        const gridParams = bridge(grid, rest);
        const programParams = [...gridParams, ...params.map(p => computeParam(p, rest)), ...args.map((a, i) => computeArg(a, rest, i))];
        const shaderCode = VertexCode(programParams, gridParams, core);
        configureShadowCanvas(gridParams);
        shaderCompiler.compile(shaderCode);
        shaderRunner.run(shaderCompiler.getProgram(), programParams, core);
        return shaderRunner.getResult();
    }
}