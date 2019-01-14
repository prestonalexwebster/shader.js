import VariableDeclaration from './variable-declaration';


const ShaderHeader = variables =>
`
varying vec4 v_color;

${variables.map(v => VariableDeclaration(v)).join('\n')}
`;

export default ShaderHeader;