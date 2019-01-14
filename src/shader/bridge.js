import {glsl} from "./core-transpiler/constants";

function generateIndexes(name, axis, maxX, maxY) {
    const indexes = new Int32Array(maxX * maxY);
    for (let y = 0; y < maxY; ++y) {
        for (let x = 0; x < maxX; ++x) {
            indexes[y * maxX + x] = axis === 'x' ? x : y;
        }
    }
    return {
        name,
        scale: axis === 'x' ? maxX : maxY,
        value: indexes,
        type: glsl.INT
    };
}

export function generateGrid(grid, rest) {
    if (!grid) return [];
    const X = typeof grid.maxX === 'function' ? grid.maxX(rest) : grid.maxX;
    const Y = typeof grid.maxY === 'function' ? grid.maxY(rest) : grid.maxY;
    return [
        generateIndexes(grid.nameX, 'x', X, Y),
        generateIndexes(grid.nameY, 'y', X, Y)
    ]
}

export function computeParam(parameter, args) {
    return {
        ...parameter,
        value: typeof parameter.value === 'function' ? parameter.value(...args) : parameter.value,
        size: typeof parameter.size === 'function' ? parameter.size(...args) : parameter.size
    }
}

export function computeArg(argument, args, index) {
    return {
        ...argument,
        size: typeof argument.size === 'function' ? argument.size(...args) : argument.size,
        value: args[index]
    }
}