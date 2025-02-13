

function floodFill(x, y, fillColor) {
    const canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = canvasData.data;
    console.log(pixels);
    const width = canvas.width;

    // Get the color of the pixel at the clicked position
    const startIndex = (y * width + x) * 4;
    const targetColor = [pixels[startIndex], pixels[startIndex + 1], pixels[startIndex + 2]];

    // If the clicked color is the same as the fill color, return early (no need to fill)
    if (
        targetColor[0] === fillColor[0] &&
        targetColor[1] === fillColor[1] &&
        targetColor[2] === fillColor[2]
    ) {
        return; // No need to fill as it already has the fill color
    }

    // Function to check if the current pixel matches the target color
    function matchColor(index) {
        return (
            pixels[index] === targetColor[0] &&
            pixels[index + 1] === targetColor[1] &&
            pixels[index + 2] === targetColor[2]
        );
    }

    // Function to color a pixel with the fill color
    function colorPixel(index) {
        pixels[index] = fillColor[0];
        pixels[index + 1] = fillColor[1];
        pixels[index + 2] = fillColor[2];
        pixels[index + 3] = 255; // Full opacity
    }

    let queue = [{ x, y }];
    let visited = new Set(); // To keep track of visited pixels

    while (queue.length > 0) {
        let { x, y } = queue.shift();
        let index = (y * width + x) * 4;

        // Avoid revisiting the same pixel
        if (visited.has(index)) continue;
        visited.add(index);

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





// function floodFill(x, y, fillColor) {
//     const canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     const pixels = canvasData.data;
//     const width = canvas.width;

//     const startIndex = (y * width + x) * 4;
//     const targetColor = [pixels[startIndex], pixels[startIndex + 1], pixels[startIndex + 2]];

//     if (
//         targetColor[0] === fillColor[0] &&
//         targetColor[1] === fillColor[1] &&
//         targetColor[2] === fillColor[2]
//     ) {
//         return; 
//     }


//     function matchColor(index) {
//         return (
//             pixels[index] === targetColor[0] &&
//             pixels[index + 1] === targetColor[1] &&
//             pixels[index + 2] === targetColor[2]
//         );
//     }


//     function colorPixel(index) {
//         pixels[index] = fillColor[0];
//         pixels[index + 1] = fillColor[1];
//         pixels[index + 2] = fillColor[2];
//         pixels[index + 3] = 255; 
//     }

//     let queue = [{ x, y }];
//     let visited = new Set(); 

//     while (queue.length > 0) {
//         let { x, y } = queue.shift();
//         let index = (y * width + x) * 4;

 
//         if (visited.has(index)) continue;
//         visited.add(index);


//         if (matchColor(index)) {
//             colorPixel(index);

//             if (x > 0) queue.push({ x: x - 1, y });
//             if (x < width - 1) queue.push({ x: x + 1, y });
//             if (y > 0) queue.push({ x, y: y - 1 });
//             if (y < canvas.height - 1) queue.push({ x, y: y + 1 });
//         }
//     }

//     ctx.putImageData(canvasData, 0, 0);
// }
