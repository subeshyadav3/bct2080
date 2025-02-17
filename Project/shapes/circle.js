function drawCircle(x, y, r, ctx) {
    ctx.beginPath();
    ctx.lineWidth = lineWidth;  
    
    ctx.strokeStyle = isHighlighting ? 'red' : selectedColor;
    ctx.fillStyle = isHighlighting ? 'red' : selectedColor;

    let xc = x;
    let yc = y;
    let d = 1 - r;
    let xi = 0;
    let yi = r;

    ctx.fillRect(xc + xi, yc + yi, 1, 1);
    ctx.fillRect(xc - xi, yc + yi, 1, 1);
    ctx.fillRect(xc + xi, yc - yi, 1, 1);
    ctx.fillRect(xc - xi, yc - yi, 1, 1);
    ctx.fillRect(xc + yi, yc + xi, 1, 1);
    ctx.fillRect(xc - yi, yc + xi, 1, 1);
    ctx.fillRect(xc + yi, yc - xi, 1, 1);
    ctx.fillRect(xc - yi, yc - xi, 1, 1);

    while (xi < yi) {
        if (d < 0) {
            d += 2 * xi + 3;
        } else {
            d += 2 * (xi - yi) + 5;
            yi--;
        }
        xi++;

        ctx.fillRect(xc + xi, yc + yi, 1, 1);
        ctx.fillRect(xc - xi, yc + yi, 1, 1);
        ctx.fillRect(xc + xi, yc - yi, 1, 1);
        ctx.fillRect(xc - xi, yc - yi, 1, 1);
        ctx.fillRect(xc + yi, yc + xi, 1, 1);
        ctx.fillRect(xc - yi, yc + xi, 1, 1);
        ctx.fillRect(xc + yi, yc - xi, 1, 1);
        ctx.fillRect(xc - yi, yc - xi, 1, 1);
    }

   
}