function drawLineBresenham(x0, y0, x1, y1, ctx) {
    ctx.beginPath();
    ctx.lineWidth = lineWidth;  

    ctx.lineWidth =isHighlighting ? 3 : lineWidth;
    ctx.strokeStyle = isHighlighting ? 'red' : selectedColor;
    
  

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    ctx.moveTo(Math.round(x0), Math.round(y0));   //anti-aliasing by rounding

    while (x0 !== x1 || y0 !== y1) {
        ctx.lineTo(Math.round(x1), Math.round(y1)); 

        let e2 = 2 * err;
        if (e2 > -dy) { 
            err -= dy; 
            x0 += sx; 
        }
        if (e2 < dx) { 
            err += dx; 
            y0 += sy; 
        }
    }

    ctx.stroke(); 
}
