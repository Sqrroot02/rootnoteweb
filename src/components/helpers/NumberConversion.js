export function rgbToHex(r,g,b){
    return "#" + convDecimalToHex(r) + convDecimalToHex(g) + convDecimalToHex(b);
}

export function hexToRgb(hex) {
    let r = convHexToDecimal(hex.substring(1,3))
    let g = convHexToDecimal(hex.substring(3,5))
    let b = convHexToDecimal(hex.substring(5,7))

    return({r,g,b})
}

export function convDecimalToHex(value){
    let first = parseInt(value/16);
    let secound = value % 16;
    return first.toString(16) + "" + secound.toString(16)
}

export function convHexToDecimal(value){
    let first = Number("0x" + value[0])
    let secound = Number("0x" + value[1])
    return (first * 16 + secound);
}