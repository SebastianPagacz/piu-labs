const colors = ["#1b5322", "#531c1b", "#531b39", "#531b29", "#1b4153", "#bab445", "#45ba58", "#ba45ac"];

export function colorAllShapes(shapeType){
    const shapes = document.querySelectorAll(shapeType);

    shapes.forEach(s => {
        s.style.backgroundColor = colors[Math.floor(Math.random()*8)];
    })
}

export function colorSingleShape(shape){
    shape.style.backgroundColor = colors[Math.floor(Math.random()*8)];
}