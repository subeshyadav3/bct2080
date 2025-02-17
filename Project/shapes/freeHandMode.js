function handleFreehandDrawing(e, drawing, freeHandShapes) {
    if (!drawing) return;

    const currentX = e.offsetX;
    const currentY = e.offsetY;
    
    const lastShape = freeHandShapes[freeHandShapes.length - 1];

    if (!lastShape || !lastShape.points || lastShape.points.length === 0) {
        return;
    }

    const lastPoint = lastShape.points[lastShape.points.length - 1];


    ctx.beginPath();
    ctx.lineWidth = lastShape.lineWidth;
    ctx.strokeStyle = lastShape.color; 
    

    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

   
    lastShape.points.push({ x: currentX, y: currentY });
}
