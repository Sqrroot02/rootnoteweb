const Shape = function (colorId,fillColor, strokeColor, pixels){
    const ColorId = colorId;
    const FillColor = fillColor;
    const StrokeColor = strokeColor;
    const Pixels = pixels;

    return {ColorId,FillColor,StrokeColor,Pixels}
}

export default Shape