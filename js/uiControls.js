let currentColor = '#000000';

export function initializeUIControls(canvas, ctx) {
    createColorPicker();
    createStickerPalette();
    setupEventListeners(canvas);
}

export function showMessage(message) {
    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.display = 'block';
    } else {
        console.error('Message element not found');
    }
}

export function showHint(hint) {
    const hintElement = document.getElementById('hint');
    if (hintElement) {
        hintElement.textContent = hint;
        hintElement.style.display = 'block';
    } else {
        console.error('Hint element not found');
    }
}

export function clearMessage() {
    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.textContent = '';
        messageElement.style.display = 'none';
    }
}

export function clearHint() {
    const hintElement = document.getElementById('hint');
    if (hintElement) {
        hintElement.textContent = '';
        hintElement.style.display = 'none';
    }
}

export function clearCanvas() {
    // Implement clear canvas functionality
}

function createColorPicker() {
    const colorPicker = document.getElementById('color-picker');
    if (!colorPicker) {
        console.warn('Color picker element not found');
        return;
    }
    const colors = ['#000000', '#FFFFFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#20B2AA', '#778899'];
    colorPicker.innerHTML = '';
    colors.forEach(color => {
        const colorButton = document.createElement('button');
        colorButton.style.backgroundColor = color;
        colorButton.onclick = () => setCurrentColor(color);
        colorPicker.appendChild(colorButton);
    });
}

function createStickerPalette() {
    const palette = document.getElementById('sticker-palette');
    if (!palette) {
        console.warn('Sticker palette element not found');
        return;
    }
    const stickers = ['🌟', '🌈', '🌺', '🦄', '🎨', '🖌️'];
    palette.innerHTML = '';
    stickers.forEach(sticker => {
        const stickerButton = document.createElement('button');
        stickerButton.textContent = sticker;
        stickerButton.onclick = () => selectSticker(sticker);
        palette.appendChild(stickerButton);
    });
}

function setupEventListeners(canvas) {
    // Set up event listeners for drawing, stickers, etc.
}

function setCurrentColor(color) {
    currentColor = color;
    const canvas = document.getElementById('drawing-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = color;
    }
}

export function getCurrentColor() {
    return currentColor;
}

export function drawImageOnCanvas(imageUrl) {
    return new Promise((resolve, reject) => {
        const canvas = document.getElementById('drawing-canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            resolve();
        };
        img.onerror = function() {
            reject(new Error('Failed to load image: ' + imageUrl));
        };
        img.src = imageUrl;
    });
}