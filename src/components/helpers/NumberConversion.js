export function rgbToHex(r,g,b){
    return "#" + convDecimalToHex(r) + convDecimalToHex(g) + convDecimalToHex(b);
}


export function convDecimalToHex(value){
    let first = parseInt(value/16);
    let secound = value % 16;
    return first.toString(16) + "" + secound.toString(16)
}