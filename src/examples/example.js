/**
 * Created by anokhin on 20.04.2018.
 */
import {core, grid2DInt, uniform, uniformArgument, uniformArrayArgument, glsl, createShader} from "../shader/api";

export const createEyeMatrix = n => {
    const matrix = new Float32Array(n*n);
    for(let i = 0; i < n; ++i){
        const index = i*n + i;
        matrix[index] = 1;
    }
};



export const matrixMul10x10 = createShader(
    grid2DInt("i","j",100,100),
    uniformArrayArgument("A", glsl.FLOAT, 100),
    uniformArrayArgument("B", glsl.FLOAT, 100),
    core(glsl.FLOAT, `
   
       int index(int i, int j){
          return i*10+j;
       }
   
       float core(){
           float c = 0;
           for(int k = 0; k < 100; ++k){
               c = c + A[index(i,k)]*B[index(k,j)];
           }
           return c;
       }
   `)
);



export const matrixSquareMul = createShader(
    grid2DInt("i", "j",A=>A.length, A=>A.length),
    uniform("size", glsl.INT, A => Math.sqrt(A.length)),
    uniformArrayArgument("A", glsl.FLOAT, A => A.length),
    uniformArrayArgument("B", glsl.FLOAT, A => A.length),
    core(glsl.FLOAT, `
       int index(int i, int j){
          return i*size+j;
       }
   
       float core(){
           float c = 0;
           for(int k = 0; k < size; ++k){
               c = c + A[index(i,k)]*B[index(k,j)];
           }
           return c;
       }
   `)
);



export const matrixMul = createShader(
    grid2DInt("i", "j", (A, B, n) => n, (A, B, n, l, m)=>m),
    uniformArrayArgument("A", glsl.FLOAT, (A, B, n, k) => n * k),
    uniformArrayArgument("B", glsl.FLOAT, (A, B, n, k, m) => k * m),
    uniformArgument("n", glsl.INT),
    uniformArgument("k", glsl.INT),
    uniformArgument("m", glsl.INT),
    core(glsl.FLOAT, `
       int indexA(int i, int j){
          return i*k+j;
       }Array
       
       int indexB(int i, int j){
         return i*m+j;
       }
   
       float core(){
           float c = 0;
           for(int q = 0; q < k; ++q){
               c = c + A[index(i,q)]*B[index(q,j)];
           }
           return c;
       }
   `)
);


