const EncodeFloat =
    `
vec4 _color_map_(float f){
    float exp_bits = 7.0;
    float mantissa_bits = 13.0;
    float min_norm_exp = -pow(2.0, exp_bits);
    float mantissa_module = pow(2.0, mantissa_bits);
    bool negative = f < 0.0;
    int exp = int( floor(log2(f))  );
    int mantissa = 0;
    if(exp < -126){
        exp = -126;
        mantissa = int( floor( abs(f) / pow(2.0, float(exp)) * mantissa_module)  );
    }else{
        mantissa = int( floor( (abs(f) / pow(2.0, float(exp)) - 1.0) * mantissa_module)  );
    }
    bool expNegative = false;
    if(exp < 0){
        expNegative = true;
        exp = 127 + exp;
    }
    
    int r, g, b;
    int r1, r2;
    
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
    
    r = r1 + r2 + exp / 2;
    g = mod(exp,2) * 128 + mantissa / 256;
    b = mod(mantissa, 256);
    return vec4(float(r) / 255.0, float(g) / 255.0, float(b) / 255.0, 1.0);
}
`;

export default EncodeFloat;