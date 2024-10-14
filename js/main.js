import { initializeDrawingModes, setGameMode, setCategory } from './drawingModes.js';
import { initializeUIControls, showMessage } from './uiControls.js';
import { initializeCanvas, startDrawing, draw, stopDrawing } from './canvasUtils.js';
import { initializePlayerManagement } from './playerManagement.js';

function initializeApp() {
    console.log('Initializing app');
    
    const canvas = document.getElementById('drawing-canvas');
    if (!canvas) {
        console.error('Canvas element is missing');
        return;
    }

    initializeCanvas(canvas);
    initializeDrawingModes(canvas, canvas.getContext('2d'));
    initializeUIControls(canvas, canvas.getContext('2d'));
    initializePlayerManagement();

    // Set up event listeners for drawing
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrawing(e.touches[0]);
    });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e.touches[0]);
    });
    canvas.addEventListener('touchend', stopDrawing);

    // Set up event listeners for game modes and categories
    document.getElementById('mode-guided').onclick = () => setGameMode('guided');
    document.getElementById('mode-draw-and-discover').onclick = () => setGameMode('drawAndDiscover');
    document.getElementById('mode-complete-drawing').onclick = () => setGameMode('completeDrawing');
    document.getElementById('mode-timed').onclick = () => setGameMode('timed');

    // Update event listeners for categories
    document.getElementById('category-animals').onclick = () => {
        try {
            setCategory('animals');
        } catch (error) {
            console.error('Error setting category:', error);
            showMessage('אירעה שגיאה בטעינת הקטגוריה. נסה שוב.');
        }
    };
    document.getElementById('category-vehicles').onclick = () => {
        try {
            setCategory('vehicles');
        } catch (error) {
            console.error('Error setting category:', error);
            showMessage('אירעה שגיאה בטעינת הקטגוריה. נסה שוב.');
        }
    };
    document.getElementById('category-food').onclick = () => {
        try {
            setCategory('food');
        } catch (error) {
            console.error('Error setting category:', error);
            showMessage('אירעה שגיאה בטעינת הקטגוריה. נסה שוב.');
        }
    };

    // Start the game in guided mode
    setGameMode('guided');

    console.log('App initialized');
}

document.addEventListener('DOMContentLoaded', initializeApp);