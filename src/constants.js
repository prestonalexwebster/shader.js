/**
 * Created by anokhin on 23.04.2018.
 */


export const shadowCanvas  = document.createElement('canvas');
export const gl = shadowCanvas.getContext('2d');

export const ATTRIBUTE_PARAMETER = 'ATTRIBUTE_PARAMETER';
export const ATTRIBUTE_ARGUMENT = 'ATTRIBUTE_ARGUMENT';
export const UNIFORM_PARAMETER = 'UNIFORM_PARAMETER';
export const UNIFORM_ARRAY_PARAMETER = 'UNIFORM_ARGUMENT_PARAMETER';
export const UNIFORM_ARGUMENT = 'UNIFORM_ARGUMENT';
export const UNIFORM_ARRAY_ARGUMENT = 'UNIFORM_ARGUMENT_ARRAY';
export const CORE_SOURCE = 'CORE_SOURCE';
export const GRID_2D_INT = 'GRID_2D_INT';

export const glsl = {
    INT: gl.INT,
    FLOAT: gl.FLOAT
};
