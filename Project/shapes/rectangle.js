function drawRect(x, y, x1, y1, ctx) {

    
    drawLineBresenham(x, y, x1, y, ctx); // Top side
    drawLineBresenham(x1, y, x1, y1, ctx); // Right side
    drawLineBresenham(x1, y1, x, y1, ctx); // Bottom side
    drawLineBresenham(x, y1, x, y, ctx); // Left side
}
