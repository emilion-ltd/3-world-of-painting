import { showMessage, clearCanvas, drawImageOnCanvas } from './uiControls.js';
import { drawTemplate } from './canvasUtils.js';

let currentGameMode = 'guided';
let currentCategory = 'animals';
let currentStep = 0;
let timeLeft = 0;
let timerInterval;

const categories = {
    animals: [
        { name: "כלב", url: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=300" },
        { name: "חתול", url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300" },
        { name: "אריה", url: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=300" },
        { name: "פיל", url: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=300" },
        { name: "ג'ירפה", url: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=300" }
    ],
    vehicles: [
        { name: "מכונית", url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=300" },
        { name: "אופניים", url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300" },
        { name: "מטוס", url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300" },
        { name: "ספינה", url: "https://images.unsplash.com/photo-1520646924857-95e4e1b3a3d7?w=300" },
        { name: "רכבת", url: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=300" }
    ],
    food: [
        { name: "פיצה", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300" },
        { name: "המבורגר", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300" },
        { name: "גלידה", url: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=300" },
        { name: "תפוח", url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300" },
        { name: "בננה", url: "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=300" }
    ]
};

const templates = [
    {
        name: "עיגול",
        path: [
            {x: 0.5, y: 0.2}, {x: 0.7, y: 0.3}, {x: 0.8, y: 0.5}, {x: 0.7, y: 0.7},
            {x: 0.5, y: 0.8}, {x: 0.3, y: 0.7}, {x: 0.2, y: 0.5}, {x: 0.3, y: 0.3},
            {x: 0.5, y: 0.2}
        ]
    },
    {
        name: "לב",
        path: [
            {x: 0.5, y: 0.3}, {x: 0.3, y: 0.2}, {x: 0.2, y: 0.4}, {x: 0.3, y: 0.6},
            {x: 0.5, y: 0.8}, {x: 0.7, y: 0.6}, {x: 0.8, y: 0.4}, {x: 0.7, y: 0.2},
            {x: 0.5, y: 0.3}
        ]
    },
    {
        name: "ריבוע",
        path: [{x: 0.3, y: 0.3}, {x: 0.7, y: 0.3}, {x: 0.7, y: 0.7}, {x: 0.3, y: 0.7}, {x: 0.3, y: 0.3}]
    },
    {
        name: "משולש",
        path: [{x: 0.5, y: 0.2}, {x: 0.8, y: 0.8}, {x: 0.2, y: 0.8}, {x: 0.5, y: 0.2}]
    },
    {
        name: "כוכב",
        path: [
            {x: 0.5, y: 0.2}, {x: 0.6, y: 0.4}, {x: 0.8, y: 0.4}, {x: 0.65, y: 0.6},
            {x: 0.7, y: 0.8}, {x: 0.5, y: 0.7}, {x: 0.3, y: 0.8}, {x: 0.35, y: 0.6},
            {x: 0.2, y: 0.4}, {x: 0.4, y: 0.4}, {x: 0.5, y: 0.2}
        ]
    }
];

export function initializeDrawingModes(canvas, ctx) {
    // Initialize any necessary variables or setup for drawing modes
}

export function setGameMode(mode) {
    currentGameMode = mode;
    clearInterval(timerInterval);
    currentStep = 0;
    switch(mode) {
        case 'guided':
            startGuidedMode();
            break;
        case 'drawAndDiscover':
            startDrawAndDiscoverMode();
            break;
        case 'completeDrawing':
            startCompleteDrawingMode();
            break;
        case 'timed':
            startTimedMode();
            break;
    }
}

export function setCategory(category) {
    currentCategory = category;
    try {
        startCategoryGame();
    } catch (error) {
        console.error('Error starting category game:', error);
        showMessage('אירעה שגיאה בטעינת הקטגוריה. נסה שוב.');
    }
}

function startGuidedMode() {
    showMessage("מצב מודרך: צייר את הצורה המוצגת");
    startGame();
}

function startDrawAndDiscoverMode() {
    const item = getRandomItem();
    showMessage(`צייר וגלה: נסה לצייר ${item}`);
    clearCanvas();
    // TODO: Implement draw and discover logic
}

function startCompleteDrawingMode() {
    const item = getRandomItem();
    showMessage(`השלם את הציור: השלם את הציור של ${item}`);
    clearCanvas();
    // TODO: Implement complete drawing logic
}

function startTimedMode() {
    timeLeft = 60;
    const item = getRandomItem();
    showMessage(`צייר לפי זמן: צייר ${item} תוך 60 שניות`);
    clearCanvas();
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        showMessage(`זמן נותר: ${timeLeft} שניות`);
    } else {
        clearInterval(timerInterval);
        showMessage("הזמן נגמר!");
        // TODO: Implement game over logic
    }
}

function getRandomItem() {
    const categoryItems = categories[currentCategory];
    return categoryItems[Math.floor(Math.random() * categoryItems.length)];
}

export function startGame() {
    clearCanvas();
    showMessage(`צייר ${templates[currentStep].name}`);
    drawTemplate(templates[currentStep]);
}

export function nextStep() {
    currentStep++;
    if (currentStep >= templates.length) {
        showMessage("כל הכבוד! סיימת את כל הצורות!");
        currentStep = 0;
    }
    startGame();
}

export function getCurrentTemplate() {
    return templates[currentStep];
}

function startCategoryGame() {
    const item = getRandomItem();
    showMessage(`צייר על התמונה: ${item.name}`);
    drawImageOnCanvas(item.url).catch(error => {
        console.error('Failed to load image:', error);
        showMessage('לא הצלחנו לטעון את התמונה. נסה שוב מאוחר יותר.');
    });
}