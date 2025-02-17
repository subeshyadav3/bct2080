function floodFill(x, y, fillColor) {
    const canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = canvasData.data;
    const width = canvas.width;

    const startIndex = (y * width + x) * 4;
    const targetColor = [pixels[startIndex], pixels[startIndex + 1], pixels[startIndex + 2]];
    console.log(targetColor);
    if (
        targetColor[0] == fillColor[0] &&
        targetColor[1] == fillColor[1] &&
        targetColor[2] == fillColor[2]
    ) {
        return; 
    }

    function matchColor(index) {

        return (

            pixels[index] == targetColor[0] &&
            pixels[index + 1] == targetColor[1] &&
            pixels[index + 2] == targetColor[2]
        );
    }

    function colorPixel(index) {
        pixels[index] = fillColor[0];
        pixels[index + 1] = fillColor[1];
        pixels[index + 2] = fillColor[2];
        pixels[index + 3] = 255; 
    }

    let queue = [{ x, y }];
    let visited = new Set(); 

    const boundaryColor = [255, 255, 255];  

    while (queue.length > 0) {
        let { x, y } = queue.shift();
        let index = (y * width + x) * 4;

        if (visited.has(index)) continue;
        visited.add(index);


        if (
            pixels[index] == boundaryColor[0] &&
            pixels[index + 1] == boundaryColor[1] &&
            pixels[index + 2] == boundaryColor[2]
        ) {
            continue; 
        }

        if (matchColor(index)) {
            colorPixel(index);

            if (x > 0) queue.push({ x: x - 1, y });
            if (x < width - 1) queue.push({ x: x + 1, y });
            if (y > 0) queue.push({ x, y: y - 1 });
            if (y < canvas.height - 1) queue.push({ x, y: y + 1 });
        }
    }

    ctx.putImageData(canvasData, 0, 0);
}
