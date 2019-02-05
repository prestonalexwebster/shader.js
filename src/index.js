import {matrixMul} from "./examples/matrix-mul";
import {matrixMul10x10} from "./examples/matrix-mul-10x10";
import {matrixSquareMul} from "./examples/matrix-square-mul";

const createEyeMatrix = n => {
    const matrix = new Float32Array(n * n);
    for (let i = 0; i < n; ++i) {
        const index = i * n + i;
        matrix[index] = 1;
    }
    return matrix;
};

const A = createEyeMatrix(10);
const B = createEyeMatrix(10);

console.log(matrixMul10x10(A, B));

console.log(matrixSquareMul(A, B));

console.log(matrixMul(A, B, 10, 10, 10));