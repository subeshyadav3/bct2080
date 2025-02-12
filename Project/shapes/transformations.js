function applyTranslation(shape, tx, ty) {
    shape.x1 += tx;
    shape.y1 += ty;
    if (shape.type === 'line') {
        shape.x2 += tx;
        shape.y2 += ty;
    } else if (shape.type === 'circle') {
        shape.x += tx;
        shape.y += ty;
    } else if (shape.type === 'rectangle') {
        shape.x += tx;
        shape.y += ty;
    }
    redrawCanvas();
}
function applyScaling(shape, sx, sy) {
    console.log('Before Scaling:', JSON.stringify(shape)); // Log before scaling
    console.log(typeof(shape.x1));

    // Step 1: Translate shape to origin (move to (0, 0))
    if (shape.type === 'line') {
        // Calculate center of the line
        const centerX = (shape.x1 + shape.x2) / 2;
        const centerY = (shape.y1 + shape.y2) / 2;
        
        // Translate to origin by subtracting center
        shape.x1 -= centerX;
        shape.y1 -= centerY;
        shape.x2 -= centerX;
        shape.y2 -= centerY;
        
        // Step 2: Scale relative to origin
        shape.x1 *= sx;
        shape.y1 *= sy;
        shape.x2 *= sx;
        shape.y2 *= sy;
        
        // Step 3: Translate back to original position
        shape.x1 += centerX;
        shape.y1 += centerY;
        shape.x2 += centerX;
        shape.y2 += centerY;
    } else if (shape.type === 'circle') {
        // For circle, center is (x, y) and radius scales
        const centerX = shape.x;
        const centerY = shape.y;

        // Translate to origin by subtracting center
        shape.x -= centerX;
        shape.y -= centerY;
        
        // Step 2: Scale relative to origin
        shape.x *= sx;
        shape.y *= sy;
        shape.radius *= sx; // Only scale the radius in X direction

        // Step 3: Translate back to original position
        shape.x += centerX;
        shape.y += centerY;
    } else if (shape.type === 'rectangle') {
        // For rectangle, the center is (x + width / 2, y + height / 2)
        const centerX = shape.x + shape.width / 2;
        const centerY = shape.y + shape.height / 2;

        // Translate to origin by subtracting center
        shape.x -= centerX;
        shape.y -= centerY;
        
        // Step 2: Scale relative to origin
        shape.x *= sx;
        shape.y *= sy;
        shape.width *= sx;
        shape.height *= sy;
        
        // Step 3: Translate back to original position
        shape.x += centerX;
        shape.y += centerY;
    }

    console.log('After Scaling:', JSON.stringify(shape)); // Log after scaling
    
    redrawCanvas();  // Make sure to redraw the canvas to reflect the updated shape
}

function applyRotation(shape, angle) {
    const radians = (Math.PI / 180) * angle;
    if (shape.type === 'line') {
        const cx = (shape.x1 + shape.x2) / 2;
        const cy = (shape.y1 + shape.y2) / 2;

        shape.x1 = cx + (shape.x1 - cx) * Math.cos(radians) - (shape.y1 - cy) * Math.sin(radians);
        shape.y1 = cy + (shape.x1 - cx) * Math.sin(radians) + (shape.y1 - cy) * Math.cos(radians);
        
        shape.x2 = cx + (shape.x2 - cx) * Math.cos(radians) - (shape.y2 - cy) * Math.sin(radians);
        shape.y2 = cy + (shape.x2 - cx) * Math.sin(radians) + (shape.y2 - cy) * Math.cos(radians);
    } else if (shape.type === 'circle') {
        shape.x = shape.x * Math.cos(radians) - shape.y * Math.sin(radians);
        shape.y = shape.x * Math.sin(radians) + shape.y * Math.cos(radians);
    } else if (shape.type === 'rectangle') {
        const cx = shape.x + shape.width / 2;
        const cy = shape.y + shape.height / 2;
        shape.x = cx + (shape.x - cx) * Math.cos(radians) - (shape.y - cy) * Math.sin(radians);
        shape.y = cy + (shape.x - cx) * Math.sin(radians) + (shape.y - cy) * Math.cos(radians);

        shape.width *= Math.cos(radians);
        shape.height *= Math.sin(radians);
    }
    redrawCanvas();
}

function applyReflection(shape, axis) {
    if (axis === 'x') {
        if (shape.type === 'line') {
            shape.y1 = -shape.y1;
            shape.y2 = -shape.y2;
        } else if (shape.type === 'circle') {
            shape.y = -shape.y;
        } else if (shape.type === 'rectangle') {
            shape.y = -shape.y;
        }
    } else if (axis === 'y') {
        if (shape.type === 'line') {
            shape.x1 = -shape.x1;
            shape.x2 = -shape.x2;
        } else if (shape.type === 'circle') {
            shape.x = -shape.x;
        } else if (shape.type === 'rectangle') {
            shape.x = -shape.x;
        }
    }
    redrawCanvas();
}

function applyShearing(shape, shx, shy) {
    if (shape.type === 'line') {
        shape.x1 += shx * shape.y1;
        shape.y1 += shy * shape.x1;
        shape.x2 += shx * shape.y2;
        shape.y2 += shy * shape.x2;
    } else if (shape.type === 'circle') {
        shape.x += shx * shape.y;
        shape.y += shy * shape.x;
    } else if (shape.type === 'rectangle') {
        shape.x += shx * shape.height;
        shape.y += shy * shape.width;
    }
    redrawCanvas();
}
