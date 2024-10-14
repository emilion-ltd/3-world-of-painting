let currentPlayer = '';
let players = JSON.parse(localStorage.getItem('players')) || {};
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

export function initializePlayerManagement() {
    const savePlayerButton = document.getElementById('save-player');
    if (savePlayerButton) {
        savePlayerButton.onclick = savePlayerName;
    }
    updatePlayerInfo();
}

function savePlayerName() {
    const nameInput = document.getElementById('player-name');
    const name = nameInput.value.trim();
    if (name) {
        currentPlayer = name;
        if (!players[name]) {
            players[name] = { highScore: 0, savedDrawings: [] };
        }
        localStorage.setItem('players', JSON.stringify(players));
        updatePlayerInfo();
        nameInput.value = '';
    }
}

function updatePlayerInfo() {
    const playerInfo = document.getElementById('player-info');
    if (currentPlayer) {
        playerInfo.innerHTML = `<p>שחקן: ${currentPlayer}</p>`;
        highScore = players[currentPlayer].highScore;
        displayHighScore();
        displaySavedDrawings();
    }
}

export function updateScore(newScore) {
    score = newScore;
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = `ניקוד: ${score}`;
    }
    
    if (currentPlayer && score > players[currentPlayer].highScore) {
        players[currentPlayer].highScore = score;
        highScore = score;
        localStorage.setItem('players', JSON.stringify(players));
    }
    
    displayHighScore();
}

function displayHighScore() {
    const highScoreElement = document.getElementById('high-score');
    if (highScoreElement) {
        highScoreElement.textContent = `שיא: ${highScore}`;
    }
}

function displaySavedDrawings() {
    const gallery = document.getElementById('drawings-gallery');
    if (gallery) {
        gallery.innerHTML = '';
        if (currentPlayer && players[currentPlayer].savedDrawings) {
            players[currentPlayer].savedDrawings.forEach((drawing, index) => {
                const img = document.createElement('img');
                img.src = drawing;
                img.alt = `ציור ${index + 1}`;
                img.style.width = '100px';
                img.style.height = '100px';
                img.style.objectFit = 'cover';
                img.style.margin = '5px';
                gallery.appendChild(img);
            });
        }
    }
}

export function saveDrawing(drawingData) {
    if (!currentPlayer) {
        console.warn('No player selected');
        return;
    }
    players[currentPlayer].savedDrawings.push(drawingData);
    localStorage.setItem('players', JSON.stringify(players));
    displaySavedDrawings();
}