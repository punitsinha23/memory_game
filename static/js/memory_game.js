const board = document.getElementById("gameBoard");
const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");
const music = document.getElementById("background-music");
const startButton = document.getElementById("start-game");

let remainingTime = 5 * 60; // Initial time in seconds (5 minutes = 300 seconds)
let currentTime = remainingTime;
let tiles = [];
let firstClick = null;
let secondClick = null;
let delay = false;
let gameWon = false;
let timer;
let score = 0;
let musicPlaying = false; // Track whether the music is playing

// Shuffle and initialize the grid
function resetGame() {
    clearInterval(timer); // Clear the previous timer

    if (!gameWon) {
        currentTime = remainingTime; // Reset to full time if the game wasn't won
    } else {
        currentTime = Math.floor(currentTime * 0.75); // Reduce time by 25% if won
    }

    remainingTime = currentTime; // Set remaining time

    // Shuffle numbers for an 8-pair (16-tile) 4x4 grid
    let numbers = Array.from({ length: 8 }, (_, i) => i + 1).flatMap(n => [n, n]);
    numbers.sort(() => Math.random() - 0.5);

    tiles = [];
    board.innerHTML = ''; // Clear the game board

    // Create the 4x4 grid
    for (let i = 0; i < 16; i++) {
        const tileElement = document.createElement('div');
        tileElement.classList.add('tile');
        tileElement.innerHTML = `
            <div class="front">${numbers[i]}</div>
            <div class="back"></div>
        `;
        tileElement.dataset.number = numbers[i];
        tileElement.dataset.index = i;
        tileElement.addEventListener('click', handleTileClick);
        board.appendChild(tileElement);
        tiles.push(tileElement);
    }

    firstClick = null;
    secondClick = null;
    delay = false;
    gameWon = false;

    updateTimerDisplay(remainingTime); // Reset the timer display
    startTimer(); // Start the game timer
}

// Handle the start button click to start the game and play music
startButton.addEventListener('click', function() {
    if (!musicPlaying) {
        music.play(); // Start the music
        musicPlaying = true; // Mark the music as playing
    }
    resetGame(); // Start the game
    startButton.style.display = 'none'; // Hide the Start Game button after the game starts
});

function handleTileClick(e) {
    if (delay || gameWon) return;

    const tile = e.currentTarget;
    if (tile.classList.contains('flipped')) return;

    tile.classList.add('flipped');

    if (!firstClick) {
        firstClick = tile;
    } else if (!secondClick) {
        secondClick = tile;
        checkMatch();
    }
}

function checkMatch() {
    const firstNumber = firstClick.dataset.number;
    const secondNumber = secondClick.dataset.number;

    if (firstNumber === secondNumber) {
        firstClick.style.backgroundColor = 'green';
        secondClick.style.backgroundColor = 'green';

        firstClick = null;
        secondClick = null;

        if (checkWin()) {
            gameWon = true;
            score += 100; // Add to score
            updateScoreDisplay();
            clearInterval(timer); // Stop the timer

            // Restart the music and reset the game after a delay
            setTimeout(() => {
                alert("You won! Game resetting with reduced time.");
                music.play(); // Play the music again
                resetGame();
            }, 2000); // 2-second delay before resetting
        }
    } else {
        delay = true;
        setTimeout(() => {
            firstClick.classList.remove('flipped');
            secondClick.classList.remove('flipped');
            firstClick = null;
            secondClick = null;
            delay = false;
        }, 1000); // 1 second delay before flipping back
    }
}

function checkWin() {
    return tiles.every(tile => tile.classList.contains('flipped'));
}

function startTimer() {
    timer = setInterval(() => {
        remainingTime--; 

        if (remainingTime <= 0) {
            clearInterval(timer);
            alert("Time's up! Restarting the game.");
            resetGame();
        } else {
            updateTimerDisplay(remainingTime);
        }
    }, 1000);
}

function updateTimerDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateScoreDisplay() {
    scoreElement.textContent = `Score: ${score}`; 
}
