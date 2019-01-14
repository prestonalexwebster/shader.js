
const Float = value =>  {
    if(value === parseInt(value)){
        return value.toFixed(1);
    }else{
        return value;
    }
};

export default Float;