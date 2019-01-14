/**
 * Created by anokhin on 20.04.2018.
 */
import {core, createShader, glsl, grid2DInt, uniformArgument, uniformArrayArgument} from "../shader/api";

const MatrixMul =
`
int indexA(int i, int j){
    return i * k + j;
}
       
int indexB(int i, int j){
    return i * m + j;
}
   
float core(){
    float c = 0.0;
    for(int q = 0; q < k; ++q){
        c = c + A[index(i, q)]*B[index(q, j)];
    }
    return c;
}
`;

export const matrixMul = createShader(
    grid2DInt("i", "j", (A, B, n) => n, (A, B, n, l, m)=>m),
    uniformArrayArgument("A", glsl.FLOAT, (A, B, n, k) => n * k),
    uniformArrayArgument("B", glsl.FLOAT, (A, B, n, k, m) => k * m),
    uniformArgument("n", glsl.INT),
    uniformArgument("k", glsl.INT),
    uniformArgument("m", glsl.INT),
    core(glsl.FLOAT, MatrixMul)
);