import {glsl} from "../../core-transpiler/constants";
import FloatColorMap from "./float-color-map";
import IntColorMap from "./int-color-map";


const ShaderBody = (core) =>
`
${core.source}
     
${core.type === glsl.FLOAT ? FloatColorMap : IntColorMap}
     
void main(){
    v_color = __color_map__(core());
    gl_Position = __get_position__();
    gl_PointSize = 1.0;
}
`;

export default ShaderBody;