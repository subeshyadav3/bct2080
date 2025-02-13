function floodFill(x, y, targetColor) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const startIndex = (y * canvas.width + x) * 4;
    const startColor = [pixels[startIndex], pixels[startIndex + 1], pixels[startIndex + 2]];

    if (startColor[0] === targetColor[0] && startColor[1] === targetColor[1] && startColor[2] === targetColor[2]) return; // Already the same color

    const stack = [[x, y]];

    while (stack.length > 0) {
        const [curX, curY] = stack.pop();
        const curIndex = (curY * canvas.width + curX) * 4;

        if (pixels[curIndex] === startColor[0] && pixels[curIndex + 1] === startColor[1] && pixels[curIndex + 2] === startColor[2]) {
            pixels[curIndex] = targetColor[0];
            pixels[curIndex + 1] = targetColor[1];
            pixels[curIndex + 2] = targetColor[2];
            pixels[curIndex + 3] = 255; 

            if (curX > 0) stack.push([curX - 1, curY]);
            if (curX < canvas.width - 1) stack.push([curX + 1, curY]);
            if (curY > 0) stack.push([curX, curY - 1]);
            if (curY < canvas.height - 1) stack.push([curX, curY + 1]);
        }
    }

    ctx.putImageData(imageData, 0, 0); 
}