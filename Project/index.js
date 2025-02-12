const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const shapeList = document.getElementById('shapeList');
const width = canvas.width;
const height = canvas.height;

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

colorPickerBtn.addEventListener('click', () => {
    console.log('Color picker clicked');
    colorPicker.click();  
});

colorPicker.addEventListener('input', (e) => {

    selectedColor = e.target.value; 
   

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
            drawCircle(shape.x, shape.y, shape.radius, ctx);
        } else if (shape.type === 'rectangle') {
            drawRect(shape.x, shape.y, shape.width, shape.height, ctx);
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
            const width = e.offsetX - startX;
            const height = e.offsetY - startY;
            drawRect(startX, startY, width, height, ctx);
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
            shapes.push({ type: 'rectangle', x: startX, y: startY, width: width, height: height });
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
        drawRect(shape.x, shape.y, shape.width, shape.height, ctx);
    }
}

function drawShape(shape) {
    ctx.fillStyle = 'black';
    if (shape.type === 'line') {
        drawLineBresenham(shape.x1, shape.y1, shape.x2, shape.y2, ctx);
    } else if (shape.type === 'circle') {
        drawCircle(shape.x, shape.y, shape.radius, ctx);
    } else if (shape.type === 'rectangle') {
        drawRect(shape.x, shape.y, shape.width, shape.height, ctx);
    }
}

function isPointInShape(x, y, shape) {
    if (shape.type === 'rectangle') {
        return x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height;
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



const applyTransformBtn=document.getElementById('applyTransformBtn');

applyTransformBtn.addEventListener('click', () => {
    console.log('i am in')
    console.log(selectedShape)
    if (selectedShape) {
        const translateX = parseFloat(document.getElementById('translateX').value);
        const translateY = parseFloat(document.getElementById('translateY').value);
        const scaleX = parseFloat(document.getElementById('scaleX').value);
        const scaleY = parseFloat(document.getElementById('scaleY').value);
        const rotateAngle = parseFloat(document.getElementById('rotateAngle').value);
        const reflectionAxis = document.getElementById('reflectionAxis').value;
        const shearX = parseFloat(document.getElementById('shearX').value);
        const shearY = parseFloat(document.getElementById('shearY').value);
        
        console.log(translateX, translateY, scaleX, scaleY, rotateAngle, reflectionAxis, shearX, shearY)
        
        applyTranslation(selectedShape, translateX, translateY);
        applyScaling(selectedShape, scaleX, scaleY);
        applyRotation(selectedShape, rotateAngle);
        applyReflection(selectedShape, reflectionAxis);
        applyShearing(selectedShape, shearX, shearY);
        redrawCanvas();
        console.log(translateX, translateY, scaleX, scaleY, rotateAngle, reflectionAxis, shearX, shearY)
      
    }
});
