/**
 * Created by anokhin on 23.04.2018.
 */


function exp2(value) {
    return Math.pow(2, value);
}

/**********************3-byte float to float**************************************************************************/

export function decodeReducedFloat(bytes) {
    let fb = bytes[0];
    let negative = false;
    if (fb >= 128) {
        fb -= 128;
        negative = true;
    }
    let expNegative = true;
    if (fb >= 64) {
        fb -= 64;
        expNegative = false;
    }
    const exp = 2 * fb + (bytes[1] >= 128 ? 1 : 0);
    const mantissa = (bytes[1] % 128) * 256 + bytes[2];
    return {negative, exp, mantissa, expNegative};
}

export function getFloat({mantissa, exp, negative, expNegative}) {
    let denormalized = exp === 0;
    let exponent = expNegative ? exp - 127 : exp;
    let expMultiplier = mantissa / exp2(13) + (denormalized ? 0 : 1);
    return (negative ? -1 : 1) * expMultiplier * Math.pow(2, exponent);
}

/********************************3-byte to int*************************************************************************/

export function decodeInt(bytes) {
    let fb = bytes[0];
    let sign = false;
    if (fb >= 128) {
        fb -= 128;
        sign = true;
    }
    return fb * 2 ** 16 + bytes[1] * 2 ** 8 + bytes[2] - (sign ? 2 ** 23 : 0);
}
