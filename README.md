# Shader.js

Light-weight library for parallel computations on GPU in browser. Based on WebGl 1.0.
Current version - 0.0.1. NOT READY FOR ANY USE YET.



# API


## Methods

- createShader(...params) - creates a *shader-function* (which counts on GPU), from parameters. Each of
 parameters should be created by specific *parameter creator*. Note: order of *argument-parameters* sets the
 order of *shader-function* arguments. The order of the other arguments is not important.
 
 - core(type, glslCode) - creates a *parameter* for *shader-function* with code of main *kernel-function* (which
 counts on separate GPU kernel). type - is glsl return type. It is REQUIRED UNIQUE *parameter*.
 
 - grid2DInt(nameX, nameY, maxX, maxY) - creates a *parameter* for *shader-function* with 2-dimentional
  grid for kernels identification. nameX, nameY - identifiers of variables available in glslCode. Underhood
  each identifiers pair assigns to pixel of hidden canvas with corresponding coordinates (in Standart Web Axises).
  Canvas width and height are setted by maxX, maxY. maxX, maxY should be integers or *getters*.
   It is REQUIRED UNIQUE *parameter*.
  
 - attribute(type, name, value) - creates a *parameter* for *shader-function* with *attribute* glsl modifier(local for each
 kernel), type - glsl type, name - identifier of variable available in glslCode, value - list of variableValues (for
 2DGrid corresponding value for (i,j) kernel is values[j*maxX+i]). Value might be a *setter*.
 
 - uniform(type, name, value) - creates a *parameter* for *shader-function* with *uniform* glsl modifier(global, same for
 each kernels), type - glsl type, name - identifier of variable available in glslCode, value - value  of variable. Might be
 a *setter*.
 
 - uniformArray(type, name, size, value) - creates a  *parameter* for *shader-function* with *uniform* glsl modifier(global, same for
  each kernels), type - glsl type, name - identifier of variable available in glslCode, size - array length,
  value - value  of variable. value, size might be *setters*.
 
  - attributeArgument(type, name) - creates a *argument-parameter* for *shader-function* with *attribute*
  glsl modifier. Value of corresponding glsl variable will be read from *shader-function* arguments, value should be
  list of  of variableValues (for 2DGrid corresponding value for (i,j) kernel is values[j*maxX+i]).
  
  - uniformArgument(type, name) - creates a *argument-parameter* for *shader-function* with *uniform*
   glsl modifier. Value of corresponding glsl variable will be read from *shader-function* arguments, value should be
   a primitive glsl value.
   
 - uniformArrayArgument(type, name, size) - creates a  *parameter* for *shader-function* with *uniform* glsl modifier(global, same for
    each kernels), type - glsl type, name - identifier of variable available in glslCode, size - array length. size might be *setter*.
    Value of corresponding glsl variable will be read from *shader-function* arguments.
    
## Types

 Library support setting of *float* and *int* parameters and return types.
 
 IMPORTANT: in 0.0.1 version
 underhood float conversion has standard 8-bit exponent and non-standard 13-bit mantissa. So In decimal
 points accuracy is 4 decimal digits. int converision use non-standard 3-byte representation with value
 range (-8388608, 8388608). 4-th byte is not used because of setting non-one ALPHA value to canvas
 mutates r,g,b values, so for pixel encoding only r,g,b values is used. Will be fix in next versions
  by using Textures. 
  
  IMPORTANT: in 0.0.1 version
  max count of all uniform variables should be less than 4000. For massive computations data should be
  separated to different *shader-functions* and than aggregated in another *shader-funciton*. (Impossible
  to fix at all because of WebGL 1.0 constraints).
 
 # TODO
 
 rewrite compiler to make source code generation on each execution
 
## Examples

10x10 matrix multiplication:

```
const matrixMul10x10 = createShader(
    grid("i","j",100,100),
    uniformArrayArgument("A", glsl.FLOAT, 100),
    uniformArrayArgument("B", glsl.FLOAT, 100),
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
```

general square matrix multiplication:

```
const matrixSquareMul = createShader(
    grid("i", "j",A=>A.length, A=>A.length),
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

matrixSquareMul(A, B);
```

general matrix multiplication:

```
const matrixMul = createShader(
    grid("i", "j", (A, B, n) => n, (A, B, n, l, m)=>m),
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

matrixMul(A, B, n, k, m);
```
 
 
 
