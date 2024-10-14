let canvas, ctx;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

export function initializeCanvas(canvasElement) {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

export function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    redrawCanvas();
}

export function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Add any additional redraw logic here
}

export function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCoordinates(e);
}

export function draw(e) {
    if (!isDrawing) return;
    const [x, y] = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
}

export function stopDrawing() {
    isDrawing = false;
}

export function drawTemplate(template) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.moveTo(template.path[0].x * canvas.width, template.path[0].y * canvas.height);
    for (let i = 1; i < template.path.length; i++) {
        ctx.lineTo(template.path[i].x * canvas.width, template.path[i].y * canvas.height);
    }
    
    ctx.stroke();

    ctx.font = '24px Heebo';
    ctx.fillStyle = 'rgba(100, 100, 100, 0.7)';
    ctx.textAlign = 'center';
    ctx.fillText(template.name, canvas.width / 2, 30);
}

function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (e.touches && e.touches[0]) {
        return [
            (e.touches[0].clientX - rect.left) * scaleX,
            (e.touches[0].clientY - rect.top) * scaleY
        ];
    }
    return [
        (e.clientX - rect.left) * scaleX,
        (e.clientY - rect.top) * scaleY
    ];
}