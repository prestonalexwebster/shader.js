import ShaderHeader from "../shader-header/shader-header";
import GetPosition from "../get-position/get-position";
import ShaderBody from "../shader-body/shader-body";


const Vertex = (programParams, gridParams, core) =>
    `
${ShaderHeader(programParams)}

${GetPosition(gridParams)}

${ShaderBody(core)}
`;

export default Vertex;