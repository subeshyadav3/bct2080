const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const shapeList = document.getElementById('shapeList');
const width = canvas.width;
const height = canvas.height;
const applyTransformBtn=document.getElementById('applyTransformBtn');
const selectedColorShow=document.getElementById('selectedColorShow');



let drawing = false;
let startX = null, startY = null;
let selectedShape = null;
let shapes = [];
let freeHandShapes = [];
let isHighlighting = false;

let lineWidth = 1;
let selectedColor = 'black';
let lastX = 0;
let lastY = 0;

let isLineMode = false;
let isCircleMode = false;
let isRectMode = false;
let isFreehandMode = true;
let is2dTransformMode = false;
let isDrawing=false;

document.addEventListener('keydown', (e) => {
    console.log('here')
    if(e.key=='e'){
        lineWidth+=1;
        console.log(lineWidth)
    }
    if(e.key=='d'){
        lineWidth-=1;
    }
});

const eraserModeBtn = document.getElementById('eraserModeBtn');
const eraserCursor = document.getElementById('eraserCursor');

let isEraserMode = false;
let eraserSize = 20; 
eraserModeBtn.addEventListener('click', () => {
    isEraserMode = !isEraserMode;
    if (isEraserMode) {
        canvas.classList.add('eraser-mode');
        console.log("Eraser Mode On");
    } else {
        canvas.classList.remove('eraser-mode');
        console.log("Eraser Mode Off");
    }
});


const colorPickerBtn = document.getElementById('colorPickerBtn');
const colorPicker = document.getElementById('colorPicker');


colorPicker.addEventListener('input', (e) => {

    selectedColor = e.target.value; 
    selectedColorShow.style.backgroundColor = selectedColor;

});



document.getElementById('lineModeBtn').addEventListener('click', () => setMode('line'));
document.getElementById('circleModeBtn').addEventListener('click', () => setMode('circle'));
document.getElementById('rectModeBtn').addEventListener('click', () => setMode('rect'));
document.getElementById('freehandModeBtn').addEventListener('click', () => setMode('freehand'));

function setMode(mode) {
    isLineMode = mode === 'line';
    isCircleMode = mode === 'circle';
    isRectMode = mode === 'rect';
    isFreehandMode = mode === 'freehand';
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => {
        // console.log(shape)
        if (shape.type === 'line') {
            drawLineBresenham(shape.x1, shape.y1, shape.x2, shape.y2, ctx);
        } else if (shape.type === 'circle') {
            console.log("drawing circle")
            drawCircle(shape.x, shape.y, shape.radius, ctx);
        } else if (shape.type === 'rectangle') {
            drawRect(shape.x, shape.y, shape.x1, shape.y1, ctx);
        }
    });

    freeHandShapes.forEach(shape => {
        shape.points.forEach((point, index) => {
            if (index > 0) {
                const prevPoint = shape.points[index - 1];

                ctx.beginPath();
                ctx.strokeStyle=shape.color;
                ctx.moveTo(prevPoint.x, prevPoint.y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
            }
        });
    });
}

canvas.addEventListener('mousedown', (e) => {
    startX = e.offsetX;
    startY = e.offsetY;
    drawing = true;
    isHighlighting = false;

    if (isFreehandMode) {
        freeHandShapes.push({ type: 'freehand', points: [{ x: startX, y: startY }] , color: selectedColor, lineWidth: lineWidth});
    }

    shapes.forEach((shape) => {
        if (isPointInShape(e.offsetX, e.offsetY, shape)) {
            selectedShape = shape;
            highlightSelectedShape(shape);
        }
    });
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;

    if (isFreehandMode) {
        freeHandShapes = handleFreehandDrawing(e, drawing, freeHandShapes);
        redrawCanvas();
    } else {
        redrawCanvas();

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = selectedColor;
     

        if (isLineMode) {
            drawLineBresenham(startX, startY, e.offsetX, e.offsetY, ctx);
        } else if (isCircleMode) {
            const radius = Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2));
            drawCircle(startX, startY, radius, ctx);
        } else if (isRectMode) {
            // const width = e.offsetX - startX;
            // const height = e.offsetY - startY;

            drawRect(startX, startY, e.offsetX, e.offsetY, ctx);
        }
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (!drawing) return;
    drawing = false;

    if (!isFreehandMode) {
        const x = e.offsetX;
        const y = e.offsetY;
        const width = x - startX;
        const height = y - startY;
        const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));

        //for thresholding
        if (Math.abs(width) < 3 && Math.abs(height) < 3) {
            return; 
        }
        


        if (isLineMode) {
            shapes.push({ type: 'line', x1: startX, y1: startY, x2: x, y2: y });
            console.log(shapes)
        } else if (isCircleMode) {
            shapes.push({ type: 'circle', x: startX, y: startY, radius: radius });
        } else if (isRectMode) {
            // shapes.push({ type: 'rectangle', x: startX, y: startY, width: width, height: height });
            shapes.push({ type: 'rectangle', x: startX, y: startY, x1: x, y1: y });
        }

    }

    redrawCanvas();
});

function addShapeToList(shape) {
    const li = document.createElement('li');
    li.textContent = `${shape.type} (${Math.round(shape.x1 || shape.x)} ${Math.round(shape.y1 || shape.y)})`;
    li.addEventListener('click', () => selectShape(shape, li));
    shapeList.appendChild(li);
}

function selectShape(shape, li) {
    
    if (selectedShape) {
        const prevLi = document.querySelector('.selected');
        if (prevLi) prevLi.classList.remove('selected');
    }
    selectedShape = shape;
    li.classList.add('selected');
    highlightSelectedShape(shape);
}

function highlightSelectedShape(shape) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(drawShape);

    ctx.strokeStyle = 'red';
    isHighlighting = true;
   
    if (shape.type === 'line') {
        drawLineBresenham(shape.x1, shape.y1, shape.x2, shape.y2, ctx);
        
    } else if (shape.type === 'circle') {
        drawCircle(shape.x, shape.y, shape.radius, ctx);
    } else if (shape.type === 'rectangle') {
        drawRect(shape.x, shape.y, shape.x1, shape.y1, ctx);
    }
}

function drawShape(shape) {
    ctx.fillStyle = 'black';
    if (shape.type === 'line') {
        drawLineBresenham(shape.x1, shape.y1, shape.x2, shape.y2, ctx);
    } else if (shape.type === 'circle') {
        drawCircle(shape.x, shape.y, shape.radius, ctx);
    } else if (shape.type === 'rectangle') {
        drawRect(shape.x, shape.y, shape.x1, shape.y1, ctx);
    }
}

function isPointInShape(x, y, shape) {
    if (shape.type === 'rectangle') {
        return x >= shape.x && x <=  shape.x1 && y >= shape.y && y <=  shape.y1;
    } else if (shape.type === 'circle') {
        const dist = Math.sqrt(Math.pow(x - shape.x, 2) + Math.pow(y - shape.y, 2));
        return dist <= shape.radius;
    } else if (shape.type === 'line') {
        return isPointNearLine(x, y, shape);
    }
    return false;
}

function isPointNearLine(px, py, line) {
    const x1 = line.x1, y1 = line.y1, x2 = line.x2, y2 = line.y2;
    const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const distance = Math.abs((y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1) / lineLength;
    return distance < 2;
}





// applyTransformBtn.addEventListener('click', () => {
//     console.log('i am in')
//     console.log(selectedShape)

//     if(!selectedShape) alert('No shape selected!');
//     if (selectedShape) {
//         let orginalShape = { ...selectedShape };  /// problem of reference either creating new object to work on 

//         let translateX = parseFloat(document.getElementById('translateX').value);
//         let translateY = parseFloat(document.getElementById('translateY').value);
//         let scaleX = parseFloat(document.getElementById('scaleX').value);
//         let scaleY = parseFloat(document.getElementById('scaleY').value);
//         let rotateAngle = parseFloat(document.getElementById('rotateAngle').value);
//         let reflectionAxis = document.getElementById('reflectionAxis').value;
//         let shearX = parseFloat(document.getElementById('shearX').value);
//         let shearY = parseFloat(document.getElementById('shearY').value);
        
//         if (translateX === 0 && translateY === 0 && scaleX === 1 && scaleY === 1 && rotateAngle === 0 &&
//             reflectionAxis === 'none' && shearX === 0 && shearY === 0) {
//             alert('No transformation Applied!');
//         }
        

//         console.log(translateX, translateY, scaleX, scaleY, rotateAngle, reflectionAxis, shearX, shearY)
        
//         if(translateX || translateY) applyTranslation(orginalShape, translateX, translateY);

//         if(scaleX>1 || scaleY>1)    applyScaling(orginalShape, scaleX, scaleY);
        
//         if(rotateAngle>0) applyRotation(orginalShape, rotateAngle);
        
//         if(reflectionAxis !=='none') applyReflection(orginalShape, reflectionAxis);

//         if(shearX>0 || shearY>0) applyShearing(orginalShape, shearX, shearY);

//        translateX=document.getElementById('translateX').value=0;
//          translateY=document.getElementById('translateY').value=0;
//             scaleX=document.getElementById('scaleX').value=1;
//             scaleY=document.getElementById('scaleY').value=1;
//             rotateAngle=document.getElementById('rotateAngle').value=0;
//             reflectionAxis=document.getElementById('reflectionAxis').value='none';
//             shearX=document.getElementById('shearX').value=0;
//             shearY=document.getElementById('shearY').value=0;

//         Object.assign(selectedShape, orginalShape);  //replacing back 
//         setTimeout(() => {
//             redrawCanvas();
//         }
//         , 1);


//     }
// });



applyTransformBtn.addEventListener('click', () => {
    console.log('i am in');
    console.log(selectedShape);

    if (!selectedShape) {
        alert('No shape selected!');
        return;
    }

    let originalShape = { ...selectedShape }; // Copy to avoid reference issues

    let translateX = parseFloat(document.getElementById('translateX').value);
    let translateY = parseFloat(document.getElementById('translateY').value);
    let scaleX = parseFloat(document.getElementById('scaleX').value);
    let scaleY = parseFloat(document.getElementById('scaleY').value);
    let rotateAngle = parseFloat(document.getElementById('rotateAngle').value);
    let reflectionAxis = document.getElementById('reflectionAxis').value;
    let shearX = parseFloat(document.getElementById('shearX').value);
    let shearY = parseFloat(document.getElementById('shearY').value);

    if (translateX === 0 && translateY === 0 && scaleX === 1 && scaleY === 1 && rotateAngle === 0 &&
        reflectionAxis === 'none' && shearX === 0 && shearY === 0) {
        alert('No transformation Applied!');
        return;
    }

    console.log(translateX, translateY, scaleX, scaleY, rotateAngle, reflectionAxis, shearX, shearY);

    if (is2dTransformMode) {
        let steps = 30;
        let step = 0;

        function animateTransformation() {
            if (step >= steps || !is2dTransformMode) return;

            let progress = (step + 1) / steps;
            let tempShape = { ...originalShape };

            if (translateX || translateY) {
                applyTranslation(tempShape, translateX * progress, translateY * progress);
            }
            if (scaleX > 1 || scaleY > 1) {
                applyScaling(tempShape, 1 + (scaleX - 1) * progress, 1 + (scaleY - 1) * progress);
            }
            if (rotateAngle > 0) {
                applyRotation(tempShape, rotateAngle * progress);
            }
            if (reflectionAxis !== 'none' && step === steps - 1) {
                applyReflection(tempShape, reflectionAxis);
            }
            if (shearX > 0 || shearY > 0) {
                applyShearing(tempShape, shearX * progress, shearY * progress);
            }

            Object.assign(selectedShape, tempShape);
            redrawCanvas();

            step++;
            setTimeout(animateTransformation, 50); 
        }

        animateTransformation();
    } else {
        if (translateX || translateY) applyTranslation(originalShape, translateX, translateY);
        if (scaleX > 1 || scaleY > 1) applyScaling(originalShape, scaleX, scaleY);
        if (rotateAngle > 0) applyRotation(originalShape, rotateAngle);
        if (reflectionAxis !== 'none') applyReflection(originalShape, reflectionAxis);
        if (shearX > 0 || shearY > 0) applyShearing(originalShape, shearX, shearY);

        Object.assign(selectedShape, originalShape);
        redrawCanvas();
    }

    // is2dTransformMode = false;
    // Reset inputs
    document.getElementById('translateX').value = 0;
    document.getElementById('translateY').value = 0;
    document.getElementById('scaleX').value = 1;
    document.getElementById('scaleY').value = 1;
    document.getElementById('rotateAngle').value = 0;
    document.getElementById('reflectionAxis').value = 'none';
    document.getElementById('shearX').value = 0;
    document.getElementById('shearY').value = 0;
});
