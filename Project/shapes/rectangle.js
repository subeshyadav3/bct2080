function drawRect(x, y, width, height, ctx) {
    ctx.beginPath();
    ctx.lineWidth = lineWidth;  

    ctx.lineWidth =isHighlighting ? 10 : lineWidth;
    ctx.fillStyle = isHighlighting ? 'red' : selectedColor;
    
    for (let i = x; i <= x + width; i++) {
        ctx.fillRect(i, y, 1, 1);
        ctx.fillRect(i, y + height, 1, 1);
    }
    for (let j = y; j <= y + height; j++) {
        ctx.fillRect(x, j, 1, 1);
        ctx.fillRect(x + width, j, 1, 1);
    }
}
