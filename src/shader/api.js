import {
    ATTRIBUTE_ARGUMENT,
    ATTRIBUTE_PARAMETER,
    CORE_SOURCE,
    GRID_2D_INT,
    UNIFORM_ARGUMENT,
    UNIFORM_ARRAY_ARGUMENT,
    UNIFORM_ARRAY_PARAMETER,
    UNIFORM_PARAMETER
} from "./core-transpiler/constants";


export function attributeArgument(name, type) {
    return {
        _mark: ATTRIBUTE_ARGUMENT,
        type
    }
}

export function uniform(name, type, value) {
    return {
        _mark: UNIFORM_PARAMETER,
        type,
        name,
        value
    }
}

export function uniformArray(name, type, size, value) {
    return {
        _mark: UNIFORM_ARRAY_PARAMETER,
        type,
        name,
        size,
        value
    }
}

export function uniformArgument(name, type) {
    return {
        _mark: UNIFORM_ARGUMENT,
        type,
        name
    }
}

export function uniformArrayArgument(name, type, size) {
    return {
        _mark: UNIFORM_ARRAY_ARGUMENT,
        type,
        size,
        name
    }
}

export function grid2DInt(nameX, nameY, maxX, maxY) {
    return {
        _mark: GRID_2D_INT,
        nameX,
        nameY,
        maxX,
        maxY
    }
}

export function core(type, source) {
    return {
        type,
        source,
        _mark: CORE_SOURCE
    }
}

export function attribute(name, type, value) {
    return {
        _mark: ATTRIBUTE_PARAMETER,
        argument: false,
        type,
        name,
        value
    }
}

export {glsl} from './core-transpiler/constants.js';
export {createShader} from './create-shader';