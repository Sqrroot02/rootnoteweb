const Vector = (xValue,yValue) => {
  const [x, setX] = xValue;
  const [y, setY] = yValue;
  
  function unify() {
      let lenghtV = getLength();
      return Vector(x / lenghtV, y/lenghtV)
  }

  function getLength(){
    return Math.sqrt(x*x+y*y);
  }
}

export default Vector