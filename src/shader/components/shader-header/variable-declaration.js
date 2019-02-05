import {glsl} from "../../core-transpiler/constants";


const Type = variableType => variableType === glsl.INT ? "int" : "float";

const VariableDeclaration = variable =>
    `
${Type(variable.type)} ${variable.name}${variable.size ? `[${variable.size}]` : ""};
`;

export default VariableDeclaration;