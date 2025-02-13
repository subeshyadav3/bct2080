
function bresenhamLine(x1, y1, x2, y2,color,lineWidth) {
    let points = [];
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let sx = (x1 < x2) ? 1 : -1;
    let sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    while (true) {
        points.push({ x: x1, y: y1 });
        points.push({ x: x1+1.0, y: y1+1.0 });   ///more nicer dark
        // points.push({ x: x1-1.0, y: y1-1.0 });

        if (x1 === x2 && y1 === y2) break;
        let e2 = err * 2;
        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
    }
    
    return points;
}


function handleFreehandDrawing(e, drawing, freeHandShapes) {
    if (!drawing) return;
    
    const currentX = e.offsetX;
    const currentY = e.offsetY;
    
    const lastShape = freeHandShapes[freeHandShapes.length - 1];
    const lastPoint = lastShape.points[lastShape.points.length - 1];

 
    const newPoints = bresenhamLine(lastPoint.x, lastPoint.y, currentX, currentY,lastShape.color,lastShape.lineWidth);
    lastShape.points.push(...newPoints);

    return freeHandShapes;
}
