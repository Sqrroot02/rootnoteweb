import Vector from "./Vector";
import vector from "./Vector";

export function rotateVector(vector, angle) {
    return Vector(Math.cos(angle)*vector.x - Math.sin(angle)*vector.y, Math.sin(angle)*vector.x + Math.cos(angle) * vector.y);
}

export function connectVectors(vector1, vector2){
    return Vector(vector2.x - vector1.x,vector2.y-vector1.y)
}

export function addVector(vecOne,vecTwo){
    return Vector(vecOne.x + vecTwo.x, vecOne.y +vecTwo.y)
}

export function unify(vector) {
    let lenghtV = getLenght(vector);
    return Vector(vector.x / lenghtV, vector.y/lenghtV)
}

export function changeVectorLenght(vectorContext, lenght){
    let uni = unify(vectorContext);
    return Vector(uni.x * lenght, uni.y * lenght)
}

export function getLenght(vector) {
    return Math.sqrt(vector.x*vector.x+vector.y*vector.y);
}
export function degToRad(angle){
    return angle * (Math.PI/180);
}

export function getVectorAngle(vec1, vec2){
    return Math.cos(dotProduct(vec1,vec2)/(getLenght(vec1) * getLenght(vec2)));
}

export function dotProduct(vec1, vec2){
    return vec1.x * vec2.x + vec1.y * vec2.y;
}