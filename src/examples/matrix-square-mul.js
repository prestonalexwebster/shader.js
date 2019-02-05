import {core, glsl, grid2DInt, uniform, uniformArrayArgument, createShader} from "../shader/api";

const MatrixSquareMul =
    `
int index(int i, int j){
    return i * size + j;
}
   
float core(){
    float c = 0.0;
    for(int k = 0; k < size; ++k){
        const int id1  = index(i, k);
        const int id2 = index(k, j);
        c = c + A[id1]*B[id2];
    }
    return c;
}
`;

export const matrixSquareMul = createShader(
    grid2DInt("i", "j", A => A.length, A => A.length),
    uniform("size", glsl.INT, A => Math.sqrt(A.length)),
    uniformArrayArgument("A", glsl.FLOAT, A => A.length),
    uniformArrayArgument("B", glsl.FLOAT, A => A.length),
    core(glsl.FLOAT, MatrixSquareMul)
);