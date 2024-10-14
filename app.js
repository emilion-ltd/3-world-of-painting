console.log('Script loaded');

const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const hint = document.getElementById('hint');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentColor = '#000000';
let currentTool = 'brush';
let brushSize = 5;
let currentStep = 0;
let guidedMode = true;
let selectedSticker = null;
let stickerSize = 30;
let stickerX = 0;
let stickerY = 0;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let currentPlayer = '';
let players = JSON.parse(localStorage.getItem('players')) || {};

let currentGameMode = 'free';
let currentCategory = 'animals';
let timeLeft = 0;
let timerInterval;

const guidedSteps = [
    { hint: "צייר עיגול גדול לראש", color: "#000000" },
    { hint: "הוסף שתי עיניים עגולות", color: "#00FF00" },
    { hint: "צייר אף קטן באמצע", color: "#0000FF" },
    { hint: "הוסף חיוך גדול", color: "#FF0000" },
    { hint: "צייר שתי אוזניים בצדדים", color: "#FFA500" }
];

function initializeApp() {
    console.log('Initializing app');
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    createColorPicker();
    createStickerPalette();

    document.getElementById('mode-guided').onclick = () => setGameMode('guided');
    document.getElementById('mode-complete-drawing').onclick = () => setGameMode('completeDrawing');
    document.getElementById('mode-timed').onclick = () => setGameMode('timed');
    document.getElementById('mode-free').onclick = () => setGameMode('free');
    document.getElementById('end-current-mode').onclick = endCurrentGameMode;

    document.getElementById('category-animals').onclick = () => setCategory('animals');
    document.getElementById('category-vehicles').onclick = () => setCategory('vehicles');
    document.getElementById('category-food').onclick = () => setCategory('food');

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }

    startGame();
    updateScore();

    console.log('App initialized');
}

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    redrawCanvas();
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    switch(currentGameMode) {
        case 'guided':
            drawGuidedStep();
            break;
        case 'completeDrawing':
            // אם יש תמונת רקע למצב זה, צייר אותה כאן
            break;
        case 'timed':
        case 'free':
            // אם יש משהו מיוחד לצייר במצבים אלה, הוסף אותו כאן
            break;
    }
}

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCoordinates(e);
}

function draw(e) {
    if (!isDrawing) return;
    const [x, y] = getCoordinates(e);
    
    switch(currentGameMode) {
        case 'guided':
            drawGuidedMode(x, y);
            break;
        case 'completeDrawing':
        case 'timed':
        case 'free':
            drawFreeMode(x, y);
            break;
    }
}

function stopDrawing() {
    isDrawing = false;
}

function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    return [
        e.clientX - rect.left,
        e.clientY - rect.top
    ];
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    startDrawing(touch);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    draw(touch);
}

function handleTouchEnd() {
    stopDrawing();
}

function setGameMode(mode) {
    currentGameMode = mode;
    clearCanvas();
    stopTimer();
    
    switch(mode) {
        case 'guided':
            startGuidedMode();
            break;
        case 'completeDrawing':
            startCompleteDrawingMode();
            break;
        case 'timed':
            startTimedMode();
            break;
        case 'free':
            startFreeMode();
            break;
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function startGuidedMode() {
    currentStep = 0;
    showMessage(guidedSteps[currentStep].hint);
    currentColor = guidedSteps[currentStep].color;
}

function startCompleteDrawingMode() {
    // כאן תוכל להוסיף לוגיקה ספציפית למצב זה
    showMessage("השלם את הציור: הוסף פרטים לתמונה הבסיסית");
    // לדוגמה, צייר צורה בסיסית על הקנבס
    drawBasicShape();
}

function startTimedMode() {
    timeLeft = 60;
    showMessage("צייר מהר! יש לך 60 שניות");
    startTimer();
}

function startFreeMode() {
    showMessage("מצב ציור חופשי. תהנה!");
}

function drawBasicShape() {
    // צייר צורה בסיסית על הקנבס
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, 2 * Math.PI);
    ctx.stroke();
}

function endCurrentGameMode() {
    setGameMode('free');
    showMessage("חזרת למצב ציור חופשי");
}

function setCategory(category) {
    currentCategory = category;
    showMessage(`קטגוריה נבחרה: ${category}`);
    // כאן תוכל להוסיף לוגיקה ספציפית לכל קטגוריה
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        showMessage(`זמן נותר: ${timeLeft} שניות`);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showMessage("הזמן נגמר!");
        }
    }, 1000);
}

function showMessage(message) {
    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.textContent = message;
    }
}

function createColorPicker() {
    const colorPicker = document.getElementById('color-picker');
    if (!colorPicker) return;
    const colors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#800080'];
    colors.forEach(color => {
        const colorButton = document.createElement('button');
        colorButton.style.backgroundColor = color;
        colorButton.onclick = () => currentColor = color;
        colorPicker.appendChild(colorButton);
    });
}

function createStickerPalette() {
    const stickerPalette = document.getElementById('sticker-palette');
    if (!stickerPalette) return;
    const stickers = ['🌟', '🌈', '🌺', '🦄', '🎨', '🖌️'];
    stickers.forEach(sticker => {
        const stickerButton = document.createElement('button');
        stickerButton.textContent = sticker;
        stickerButton.onclick = () => selectSticker(sticker);
        stickerPalette.appendChild(stickerButton);
    });
}

function selectSticker(sticker) {
    selectedSticker = sticker;
    // יש להוסיף לוגיקה להוספת מדבקה לקנבס
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

function startGame() {
    score = 0;
    updateScore();
    showMessage("ברוכים הבאים לעולם הציורים!");
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    
    if (scoreElement) {
        scoreElement.textContent = score;
    }
    
    if (highScoreElement) {
        highScoreElement.textContent = `שיא: ${highScore}`;
    }
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}

function checkGuidedStepCompletion() {
    if (currentStep < guidedSteps.length - 1) {
        currentStep++;
        showMessage(guidedSteps[currentStep].hint);
        currentColor = guidedSteps[currentStep].color;
    } else {
        showMessage("כל הכבוד! סיימת את כל השלבים!");
        setGameMode('free');
    }
}

function drawFreeMode(x, y) {
    ctx.lineTo(x, y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function drawGuidedMode(x, y) {
    drawFreeMode(x, y);
    // כאן אפשר להוסיף לוגיקה נוספת ספציפית למצב המודרך
}

function drawGuidedStep() {
    if (currentStep < guidedSteps.length) {
        ctx.font = '24px Heebo';
        ctx.fillStyle = guidedSteps[currentStep].color;
        ctx.textAlign = 'center';
        ctx.fillText(guidedSteps[currentStep].hint, canvas.width / 2, 30);
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);

console.log('Script finished loading');