/**
 * Created by anokhin on 20.04.2018.
 */



const matrixMul10x10 = createShader(
    attribute("i", glsl.INT, new Int32Array(100)),
    attribute("j", glsl.INT, new Int32Array(100)),
    attribute("A", glsl.FLOAT, 100),
    uniform("B", glsl.FLOAT, 100),
    core(glsl.FLOAT, `
   
       int index(int i, int j){
          return i*100+j;
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

matrixMul10x10(A, B);

const matrixSquareMul = createShader(
    attribute("i", glsl.INT, A => createFirstSquareIndexes(A.length)),
    attribute("j", glsl.INT, A => createSecondSquaredIndexes(A.length)),
    uniform("size", glsl.INT, A => Math.sqrt(A.length)),
    uniformArgument("A", glsl.FLOAT, A => A.length),
    uniformArgument("B", glsl.FLOAT, A => A.length),
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

matrixSquareMul(A, B);

const matrixMul = createShader(
    attribute("i", glsl.INT, (A, B, n, k) => createFirstIndexes(n, k)),
    attribute("j", glsl.INT, (A, B, n, k, m) => createSecondIndexes(k, m)),
    uniformArgument("A", glsl.FLOAT, (A, B, n, k) => n * k),
    uniformArgument("B", glsl.FLOAT, (A, B, n, k, m) => k * m),
    uniformArgument("n", glsl.INT),
    uniformArgument("k", glsl.INT),
    uniformArgument("m", glsl.INT),
    core(glsl.FLOAT, `
       int indexA(int i, int j){
          return i*k+j;
       }
       
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

matrixMul(A, B, n, k, m);
