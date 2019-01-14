import ShaderHeader from "../shader-header/shader-header";
import GetPosition from "../get-position/get-position";
import ShaderBody from "../shader-body/shader-body";


const VertexCode = (programParams, gridParams, core) =>
`
${ShaderHeader(programParams)}

${GetPosition(gridParams)}

${ShaderBody(core)}
`;

export default VertexCode;