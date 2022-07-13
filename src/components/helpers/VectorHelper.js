import Vector from "./Vector";

export function rotateVector(vector, angle) {
    return Vector(Math.cos(angle)*vector.x - Math.sin(angle)*vector.y, Math.sin(angle)*vector.x + Math.cos(angle) * vector.y);
}

export function connectVectors(vector1, vector2){
    return Vector(vector2.x - vector1.x,vector2.y-vector1.y)
}

