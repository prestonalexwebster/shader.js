import VariableDeclaration from './variable-declaration';


const ShaderHeader = variables =>
`
varying v_color;

${variables.map(v => VariableDeclaration(v)).join('\n')}
`;

export default ShaderHeader;