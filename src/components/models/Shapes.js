import DrawTypes from "../enums/DrawTypes";
import {DrawArrow} from "../helpers/Graphics";

export const Shape = function (colorId, fillColor, strokeColor, pixels,data,strokeWidth,type,lineCap){
    const ColorId = colorId;
    const FillColor = fillColor;
    const StrokeColor = strokeColor;
    const Pixels = pixels;
    const Name = ""
    const Data = data
    const Type = type
    const StrokeWidth = strokeWidth
    const LineCap = lineCap

    return {ColorId,FillColor,StrokeColor,Pixels,Data,Type,StrokeWidth}
}

export const Rectangle = function (sX,sY,eX,eY){
    const StartX = sX
    const StartY = sY
    const EndX = eX
    const EndY = eY

    return {StartX,StartY,EndX,EndY}
}

export const Circle = function (sX,sY,eX,eY) {
    const StartX = sX
    const StartY = sY
    const EndX = eX
    const EndY = eY

    return {StartX,StartY,EndX,EndY}
}

export const Triangle = function (sX,sY,eX,eY) {
    const StartX = sX
    const StartY = sY
    const EndX = eX
    const EndY = eY

    return {StartX,StartY,EndX,EndY}
}

export const Arrow = function (sX,sY,eX,eY,angle) {
    const Angle = angle
    const StartX = sX
    const StartY = sY
    const EndX = eX
    const EndY = eY

    return {StartX,StartY,EndX,EndY, Angle}
}

export const Path = function (endpoints){
    const Endpoints = endpoints

    return {Endpoints}
}

export const Line = function (sX,sY,eX,eY) {
    const StartX = sX
    const StartY = sY
    const EndX = eX
    const EndY = eY

    return {StartX,StartY,EndX,EndY}
}

