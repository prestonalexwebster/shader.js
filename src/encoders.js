/**
 * Created by anokhin on 23.04.2018.
 */
function exp2(value){
    return Math.pow(2,value);
}

const glslMod = `

int mod(int a, int b){
    return a - (a/b)*b;
}

`;


/**********************decode float to 3-bytes JS*************************************************************************/

function decomposeFloat(value, mantissaBits=13, expBits=7){
    const minNormalizedExp = -exp2(expBits);
    const mantissaModule = exp2(mantissaBits);
    const negative = value < 0;
    let exp = Math.floor(Math.log2(value));
    let mantissa = 0;
    if(exp < -126){
        exp = -126;
        const expMultiplier = Math.abs(value)/exp2(exp);
        mantissa = Math.round(expMultiplier*mantissaModule);
    }else{
        const expMultiplier = Math.abs(value)/exp2(exp);
        mantissa =  Math.round((expMultiplier - 1)*mantissaModule);
    }
    let expNegative = false;
    if(exp < 0){
        expNegative = true;
        exp = 127+exp;
    }
    return {mantissa,exp,negative, expNegative};
}





function encodeReducedFloat({mantissa, exp, negative, expNegative}){
    const bytes = new Uint8Array(3);
    bytes[0] = (negative ? 128 : 0) + (expNegative ? 0 :64)+ Math.floor(exp/2);
    bytes[1] = (exp%2)*128 + Math.floor(mantissa/256);
    bytes[2] = mantissa%256;
    return bytes;
}

/**********************decode float to 3-bytes GLSL*************************************************************************/
const encodeFloat = `
vec4 __encode_float__(float f){
    float exp_bits = 7.0;
    float mantissa_bits = 13.0;
    float min_norm_exp = -pow(2.0,exp_bits);
    float mantissa_module = pow(2.0, mantissa_bits);
    bool negative = f < 0.0;
    int exp = int( floor(log2(f))  );
    int mantissa = 0;
    if(exp < -126){
        exp = -126;
        mantissa = int( round( abs(f)/pow(2.0,float(exp))*mantissa_module)  );
    }else{
        mantissa = int( round( (abs(f)/pow(2.0,float(exp))-1)*mantissa_module)  );
    }
    bool expNegative = false;
    if(exp < 0){
        expNegative = true;
        exp = 127+exp;
    }
    
    int r,g,b;
    int r1,r2;
    
    if(negative){
        r1 = 128;
    }else{
        r1 = 0;
    }
    
    if(expNegative){
        r2 = 64;
    }else{
        r2 = 0;
    }
    
    r = r1+r2+exp/2;
    g = mod(exp,2)*128 + mantissa/256;
    b = mod(mantissa, 256);
    return vec4(float(r/255.0),float(g/255.0),float(b/255.0), 1.0);
}
`;

/**********************3-byte float to float**************************************************************************/

function decodeReducedFloat(bytes){
    let fb = bytes[0];
    let negative = false;
    if(fb >= 128){
        fb -= 128;
        negative = true;
    }
    let expNegative = true;
    if(fb >= 64){
        fb -= 64;
        expNegative = false;
    }
    const exp = 2*fb+(bytes[1] >= 128 ? 1: 0);
    const mantissa = (bytes[1]%128)*256 + bytes[2];
    return {negative, exp, mantissa,expNegative};
}

function getFloat({mantissa, exp, negative, expNegative}){
    let denormalized = exp == 0;
    let exponent = expNegative ? exp - 127 : exp;
    let expMultiplier = mantissa/exp2(13) + (denormalized ? 0 : 1);
    return (negative ? -1 : 1)*expMultiplier*Math.pow(2,exponent);
}

/********************************int to 3-byte JS*************************************************************************/

function encodeInt(n){
    let sign = n < 0;
    let value = sign ? 2**23+n : n;
    const  bytes = new Uint8Array(3);
    let highValue = Math.floor(value/2**16);
    value = value%(2**16);
    bytes[0] = (sign ? 128 : 0) + highValue;
    let middleValue = Math.floor(value/2**8);
    value = value%(2**8);
    bytes[1] = middleValue;
    bytes[2] = value;
    return bytes;
}

const encodeInt = `
vec4 __encode_int__(int n){
    bool sign = n < 0;
    int value = n;
    if(sign){
        value = int( pow(2.0,23.0))+n;
    }
    
    int r,g,b;
    int r1 = 0;
    if(sign){
        r1 = 128;
    }
    
    int high_value = value/65536;
    value = mod(value,65536);
    r = r1+highValue;
    
    int middle_value = value/256;
    value = mod(value,256);
    g = middle_value;
    
    b = value;
    return vec4( float(r/255.0), float(g/255.0), float(b/255.0), 1.0);
}
`;



/********************************3-byte to int*************************************************************************/

function decodeInt(bytes){
    let fb = bytes[0];
    let sign = false;
    if(fb >= 128){
        fb -= 128;
        sign = true;
    }
    return fb*2**16+bytes[1]*2**8+bytes[2] - (sign ? 2**23 : 0);
}
