import {createEyeMatrix, matrixMul, matrixMul10x10, matrixSquareMul} from "./examples/example";


const A = createEyeMatrix(10);
const B = createEyeMatrix(10);

console.log(matrixMul10x10(A, B));

console.log(matrixSquareMul(A, B));

console.log(matrixMul(A, B, 10, 10, 10));