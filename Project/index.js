const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const shapeList = document.getElementById('shapeList');
const width = canvas.width;
const height = canvas.height;
const applyTransformBtn = document.getElementById('applyTransformBtn');
const selectedColorShow = document.getElementById('selectedColorShow');
const colorSelector = document.querySelectorAll('.colorSelector button');
let drawing = false;
let startX = null, startY = null;
let selectedShape = null;
let shapes = [];
let freeHandShapes = [];
let eraserShapes = [];
let isHighlighting = false;
let lineWidth = 2;
let selectedColor = '#000000';
let lastX = 0;
let lastY = 0;
let isLineMode = false;
let isCircleMode = false;
let isRectMode = false;
let isFreehandMode = true;
let is2dTransformMode = true;
const eraser = document.getElementById('eraserCursor');
const eraserCursorBtn = document.getElementById('eraserCursorBtn');
eraser.style.display = 'none';
let isEraserMode = false;
let eraserSize = 70;
let eraserX = 0, eraserY = 0;
let isUpdating = false;
let isFillMode = false;
let isHighlightedMode = false;

colorSelector.forEach((button) => {
    button.addEventListener('click', () => {
        selectedColor = button.name;
        console.log(selectedColor);
        selectedColorShow.style.backgroundColor = selectedColor;
        console.log(selectedColor);
    });
});

eraserCursorBtn.addEventListener('click', () => {
    isEraserMode = !isEraserMode;
    eraser.style.width = `${eraserSize}px`;
    eraser.style.height = `${eraserSize}px`;
    if (!isEraserMode) {
        eraser.style.display = 'none';
        document.body.style.cursor = "default";
    } else {
        is2dTransformMode = false;
        isLineMode = false;
        isCircleMode = false;
        isRectMode = false;
        isFreehandMode = false;
        drawing = false;
        isHighlighting = false;
        isHighlightedMode = false;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isEraserMode) {
        eraserX = e.offsetX;
        eraserY = e.offsetY;
        if (!isUpdating) {
            isUpdating = true;
            requestAnimationFrame(updateEraserPosition);
        }
    }
});

function updateEraserPosition() {
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.arc(eraserX, eraserY, eraserSize / 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.fill();
    ctx.stroke();
    isUpdating = false;
}


document.addEventListener('keydown', (e) => {
    if (e.key == 'e') {
        lineWidth += 1;
    }
    if (e.key == 'd') {
        lineWidth -= 1;
    }
    if (e.key == 'h') {
        isHighlightedMode = !isHighlightedMode;
    }
    if (e.key == 'b') {
        eraserSize += 10;
    }
    if (e.ctrlKey && e.key == 'z') {
        if (isFreehandMode) {
            freeHandShapes.pop();
        } else {
            shapes.pop();
        }
        redrawCanvas();
    }
});



const colorPickerBtn = document.getElementById('colorPickerBtn');
const colorPicker = document.getElementById('colorPicker');

colorPicker.addEventListener('input', (e) => {
    selectedColor = e.target.value;
    // console.log(selectedColor);
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


document.getElementById('fillBtn').addEventListener('click', () => {
    isFillMode = !isFillMode;

    console.log("Fill Mode changed");
    console.log(isFillMode);
});

canvas.addEventListener('click', (e) => {
  
    if (isFillMode) {
        const x = e.offsetX;
        const y = e.offsetY;
        if(selectedColor=='#000000')  alert('Please select a color to fill');
        console.log(typeof selectedColor)
        const fillColor = hexToRgb(selectedColor);
        
        console.log(fillColor);
        floodFill(x, y, fillColor);
        
    }
});

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}


canvas.addEventListener('mousedown', (e) => {
    startX = e.offsetX;
    startY = e.offsetY;
    drawing = true;
    isHighlighting = false;
    isEraserMode = false;
    eraser.style.display = 'none';
    document.body.style.cursor = "default";
    if (isFreehandMode) {
        freeHandShapes.push({ type: 'freehand', points: [{ x: startX, y: startY }], color: selectedColor, lineWidth: lineWidth });
    }
    if (isHighlightedMode) {
        shapes.forEach((shape) => {
            if (isPointInShape(e.offsetX, e.offsetY, shape)) {
                selectedShape = shape;
                highlightSelectedShape(shape);
            }
        });
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    if (isFreehandMode) {
        handleFreehandDrawing(e, drawing, freeHandShapes);
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (!drawing) return;
    drawing = false;
    tempShapes = [];
    if (!isFreehandMode) {
        const x = e.offsetX;
        const y = e.offsetY;
        const width = x - startX;
        const height = y - startY;
        const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
        if (Math.abs(width) < 3 && Math.abs(height) < 3) {
            return;
        }
        if (isLineMode) {
            shapes.push({ type: 'line', x1: startX, y1: startY, x2: x, y2: y });
            drawLineBresenham(startX, startY, x, y, ctx);
        } else if (isCircleMode) {
            shapes.push({ type: 'circle', x: startX, y: startY, radius: radius });
            drawCircle(startX, startY, radius, ctx);
        } else if (isRectMode) {
            shapes.push({ type: 'rectangle', x: startX, y: startY, x1: x, y1: y });
            drawRect(startX, startY, x, y, ctx);
        }
    }
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

function isPointInShape(x, y, shape) {
    if (shape.type === 'rectangle') {
        return x >= shape.x && x <= shape.x1 && y >= shape.y && y <= shape.y1;
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

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => {
        if (shape.type === 'line') {
            drawLineBresenham(shape.x1, shape.y1, shape.x2, shape.y2, ctx);
        } else if (shape.type === 'circle') {
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
                ctx.strokeStyle = shape.color;
                ctx.lineWidth = shape.lineWidth;
                ctx.moveTo(prevPoint.x, prevPoint.y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
            }
        });
    });
}

applyTransformBtn.addEventListener('click', () => {
    if (!selectedShape) {
        alert('No shape selected!');
        return;
    }
    let originalShape = { ...selectedShape };
    let translateX = parseFloat(document.getElementById('translateX').value);
    let translateY = parseFloat(document.getElementById('translateY').value);
    let scaleX = parseFloat(document.getElementById('scaleX').value);
    let scaleY = parseFloat(document.getElementById('scaleY').value);
    let rotateAngle = parseFloat(document.getElementById('rotateAngle').value);
    let reflectionAxis = document.getElementById('reflectionAxis').value;
    if (translateX === 0 && translateY === 0 && scaleX === 1 && scaleY === 1 && rotateAngle === 0 && reflectionAxis === 'none') {
        alert('No transformation Applied!');
        return;
    }
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
            if (scaleX !== 1 || scaleY !== 1) {
                applyScaling(tempShape, 1 + (scaleX - 1) * progress, 1 + (scaleY - 1) * progress);
            }
            if (rotateAngle !== 0) {
                applyRotation(tempShape, rotateAngle * progress);
            }
            if (reflectionAxis !== 'none' && step === steps - 1) {
                applyReflection(tempShape, reflectionAxis);
            }
            Object.assign(selectedShape, tempShape);
            redrawCanvas();
            step++;
            setTimeout(animateTransformation, 50);
        }
        animateTransformation();
    }
    document.getElementById('translateX').value = 0;
    document.getElementById('translateY').value = 0;
    document.getElementById('scaleX').value = 1;
    document.getElementById('scaleY').value = 1;
    document.getElementById('rotateAngle').value = 0;
    document.getElementById('reflectionAxis').value = 'none';
});