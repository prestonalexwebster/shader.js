const EncodeInt =
    `
vec4 _color_map_(int n){
    bool sign = n < 0;
    int value = n;
    if(sign){
        value = int( pow(2.0, 23.0)) + n;
    }
    
    int r, g, b;
    int r1 = 0;
    if(sign){
        r1 = 128;
    }
    
    int high_value = value / 65536;
    value = mod(value, 65536);
    r = r1 + highValue;
    
    int middle_value = value / 256;
    value = mod(value, 256);
    g = middle_value;
    
    b = value;
    return vec4( float(r) / 255.0, float(g) / 255.0, float(b) / 255.0, 1.0);
}
`;

export default EncodeInt;