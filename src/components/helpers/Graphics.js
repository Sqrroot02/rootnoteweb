import Vector from "./Vector";
import {addVector, changeVectorLenght, degToRad, rotateVector} from "./VectorHelper";

export function DrawLine(context,startX,startY,endX,endY){
    context.current.beginPath();
    context.current.moveTo(startX , startY);
    context.current.lineTo(endX,endY);
    context.current.stroke();
}

export function DrawCircle(context,startX,startY,radiant){
    context.current.beginPath();
    context.current.arc(startX, startY, radiant, 0, 2 * Math.PI);
    context.current.closePath();
    context.current.fill();
}

export function DrawTriangle(context,startX,startY,endX,endY) {
    context.current.beginPath()
    context.current.moveTo(startX,startY);

    context.current.lineTo(endX,endY);
    context.current.moveTo(endX,endY);

    context.current.lineTo(startX-(endX - startX),endY);
    context.current.moveTo(startX-(endX - startX),endY)

    context.current.lineTo(startX,startY)
    context.current.stroke();
}

export function DrawArrow(context,startX,startY,endX,endY,angle,lenght){
    context.current.beginPath();
    context.current.moveTo(startX, startY);
    context.current.lineTo(endX,endY);

    let vec = Vector(startX-endX, startY - endY);
    let vecLeft = rotateVector(vec,degToRad(angle));
    let vecRight = rotateVector(vec,-degToRad(angle));

    let vecEndLeft = addVector(Vector(endX,endY),changeVectorLenght(vecLeft, lenght))
    let vecEndRight = addVector(Vector(endX,endY),changeVectorLenght(vecRight,lenght))

    context.current.moveTo(endX, endY);
    context.current.lineTo(vecEndLeft.x,vecEndLeft.y);
    context.current.moveTo(endX , endY);
    context.current.lineTo(vecEndRight.x, vecEndRight.y);
    context.current.stroke();
}

export function DrawRectangle(context,startX,startY,endX,endY){
    context.current.fillRect(startX,startY,endX - startX, endY - startY);
    context.current.closePath();
}

export function getBorderPixels(dataSelected,data,width,CanvasWidth) {
    let borderPixels = [];
    for (let i = 0; i < dataSelected.length; i++) {
        let r = getRowIndex(dataSelected[i],CanvasWidth)
        let c = getColIndex(dataSelected[i],CanvasWidth)
        if (data[getDestinationArrayIndex(r+width,c,CanvasWidth)+3] === 0 || data[getDestinationArrayIndex(r-width,c,CanvasWidth)+3] === 0
            || data[getDestinationArrayIndex(r,c+width,CanvasWidth)+3] === 0 || data[getDestinationArrayIndex(r,c-width,CanvasWidth)+3] === 0
            || data[getDestinationArrayIndex(r-width,c-width,CanvasWidth)+3] === 0 || data[getDestinationArrayIndex(r+width,c+width,CanvasWidth)+3] === 0
            || data[getDestinationArrayIndex(r+width,c-width,CanvasWidth)+3] === 0 || data[getDestinationArrayIndex(r-width,c+width,CanvasWidth)+3] === 0){
            borderPixels.push(dataSelected[i])
        }
    }
    return borderPixels;
}

// Returns the Pixel index from an Array index
export const getPixelIndex = (arrayIndex) =>{
    return arrayIndex / 4;
}

// Returns the row Number of a pixel in an Array
export const getRowIndex = (arrayIndex,CanvasWidth) =>{
    return parseInt(getPixelIndex(arrayIndex)/CanvasWidth)
}

// Returns the column Number of a pixel in an Array
export const getColIndex = (arrayIndex,CanvasWidth) => {
    return getPixelIndex(arrayIndex) % CanvasWidth;
}

// Returns the pixel index by row and column
export const getDestinationIndex = (row,col,CanvasWidth) =>{
    return row * CanvasWidth + col;
}

// Returns the array index by row and column
export const getDestinationArrayIndex = (row, col,CanvasWidth) =>{
    return getDestinationIndex(row,col,CanvasWidth) * 4
}

export function FillPixels (color,selected,context){
    let imageData = context.current.getImageData(0,0,context.current.canvas.height,context.current.canvas.width);
    const data = imageData.data;

    for (let i = 0; i < selected.length; i++) {
        data[selected[i]] = color.r
        data[selected[i]+1] = color.g
        data[selected[i]+2] = color.b
        data[selected[i]+3] = 255
    }
    context.current.putImageData(imageData,0,0)
}