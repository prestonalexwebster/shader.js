import {core, glsl, grid2DInt, uniformArrayArgument, createShader} from "../shader/api";

const MatrixMul10x10 =
`
int index(int i, int j){
    return i * 10 + j;
}
   
float core(){
    float c = 0.0;
    for(int k = 0; k < 100; ++k){
        c = c + A[index(i, k)]*B[index(k, j)];
    }
    return c;
}
`;

export const matrixMul10x10 = createShader(
    grid2DInt("i", "j", 100, 100),
    uniformArrayArgument("A", glsl.FLOAT, 100),
    uniformArrayArgument("B", glsl.FLOAT, 100),
    core(glsl.FLOAT, MatrixMul10x10)
);