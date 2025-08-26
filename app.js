// Game state
let gameState = {
    playerScore: 0,
    computerScore: 0,
    currentRound: 1,
    maxRounds: 5,
    gameOver: false,
    choices: ['rock', 'paper', 'scissors'],
    emojis: {
        rock: '🪨',
        paper: '📄',
        scissors: '✂️'
    }
};

// Game rules - what beats what
const gameRules = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
};

// DOM elements
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');
const currentRoundEl = document.getElementById('currentRound');
const resultSectionEl = document.getElementById('resultSection');
const roundResultEl = document.getElementById('roundResult');
const resultMessageEl = document.getElementById('resultMessage');
const playerChoiceEmojiEl = document.getElementById('playerChoiceEmoji');
const playerChoiceTextEl = document.getElementById('playerChoiceText');
const computerChoiceEmojiEl = document.getElementById('computerChoiceEmoji');
const computerChoiceTextEl = document.getElementById('computerChoiceText');
const gameOverSectionEl = document.getElementById('gameOverSection');
const finalResultEl = document.getElementById('finalResult');
const finalPlayerScoreEl = document.getElementById('finalPlayerScore');
const finalComputerScoreEl = document.getElementById('finalComputerScore');
const playAgainBtnEl = document.getElementById('playAgainBtn');

// Choice buttons
const choiceButtons = document.querySelectorAll('.choice-btn');

// Initialize game
function initGame() {
    // Reset game state
    gameState = {
        playerScore: 0,
        computerScore: 0,
        currentRound: 1,
        maxRounds: 5,
        gameOver: false,
        choices: ['rock', 'paper', 'scissors'],
        emojis: {
            rock: '🪨',
            paper: '📄',
            scissors: '✂️'
        }
    };

    // Update UI
    updateScoreboard();
    resultSectionEl.classList.add('hidden');
    gameOverSectionEl.classList.add('hidden');
    
    // Enable choice buttons
    choiceButtons.forEach(btn => {
        btn.disabled = false;
    });
}

// Update scoreboard display
function updateScoreboard() {
    playerScoreEl.textContent = gameState.playerScore;
    computerScoreEl.textContent = gameState.computerScore;
    currentRoundEl.textContent = gameState.currentRound;
}

// Generate computer choice
function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * gameState.choices.length);
    return gameState.choices[randomIndex];
}

// Determine round winner
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'draw';
    }
    
    if (gameRules[playerChoice] === computerChoice) {
        return 'player';
    } else {
        return 'computer';
    }
}

// Get result message based on winner
function getResultMessage(winner, playerChoice, computerChoice) {
    if (winner === 'draw') {
        return "It's a Draw!";
    } else if (winner === 'player') {
        return `You Win! ${capitalize(playerChoice)} beats ${capitalize(computerChoice)}!`;
    } else {
        return `You Lose! ${capitalize(computerChoice)} beats ${capitalize(playerChoice)}!`;
    }
}

// Capitalize first letter
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

// Update round result display
function displayRoundResult(playerChoice, computerChoice, winner, message) {
    // Update choice displays
    playerChoiceEmojiEl.textContent = gameState.emojis[playerChoice];
    playerChoiceTextEl.textContent = capitalize(playerChoice);
    computerChoiceEmojiEl.textContent = gameState.emojis[computerChoice];
    computerChoiceTextEl.textContent = capitalize(computerChoice);

    // Update result message
    resultMessageEl.textContent = message;
    
    // Add appropriate styling based on result
    resultMessageEl.className = 'result-message';
    if (winner === 'player') {
        resultMessageEl.classList.add('result-win');
    } else if (winner === 'computer') {
        resultMessageEl.classList.add('result-lose');
    } else {
        resultMessageEl.classList.add('result-draw');
    }

    // Show result section
    resultSectionEl.classList.remove('hidden');
}

// Check if game is over
function checkGameOver() {
    return gameState.currentRound >= gameState.maxRounds;
}

// Show final game result
function showGameOverScreen() {
    let finalMessage = '';
    
    if (gameState.playerScore > gameState.computerScore) {
        finalMessage = 'Congratulations! You Won The Game!';
        finalResultEl.style.color = 'var(--color-success)';
    } else if (gameState.computerScore > gameState.playerScore) {
        finalMessage = 'Game Over! Computer Wins The Game!';
        finalResultEl.style.color = 'var(--color-error)';
    } else {
        finalMessage = "It's a Tie Game! Try Again!";
        finalResultEl.style.color = 'var(--color-warning)';
    }

    finalResultEl.textContent = finalMessage;
    finalPlayerScoreEl.textContent = gameState.playerScore;
    finalComputerScoreEl.textContent = gameState.computerScore;
    
    // Disable all choice buttons
    choiceButtons.forEach(btn => {
        btn.disabled = true;
    });
    
    gameOverSectionEl.classList.remove('hidden');
    gameState.gameOver = true;
}

// Play a round
function playRound(playerChoice) {
    // Prevent playing if game is over
    if (gameState.gameOver) return;
    
    // Disable buttons during round processing
    choiceButtons.forEach(btn => {
        btn.disabled = true;
    });

    // Generate computer choice
    const computerChoice = getComputerChoice();
    
    // Determine winner
    const winner = determineWinner(playerChoice, computerChoice);
    
    // Update scores
    if (winner === 'player') {
        gameState.playerScore++;
    } else if (winner === 'computer') {
        gameState.computerScore++;
    }

    // Get result message
    const message = getResultMessage(winner, playerChoice, computerChoice);

    // Display round result with slight delay for better UX
    setTimeout(() => {
        displayRoundResult(playerChoice, computerChoice, winner, message);
        updateScoreboard();

        // Check if this was the last round
        if (checkGameOver()) {
            // Game is over, show final results after a delay
            setTimeout(() => {
                showGameOverScreen();
            }, 2000);
        } else {
            // Prepare for next round
            gameState.currentRound++;
            updateScoreboard();
            
            // Re-enable buttons after a short delay for next round
            setTimeout(() => {
                if (!gameState.gameOver) {
                    choiceButtons.forEach(btn => {
                        btn.disabled = false;
                    });
                }
            }, 1500);
        }
    }, 500);
}

// Add click event listeners to choice buttons
choiceButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (gameState.gameOver) return;
        
        const playerChoice = button.dataset.choice;
        playRound(playerChoice);
    });
});

// Add keyboard support for choice buttons
choiceButtons.forEach(button => {
    button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!gameState.gameOver && !button.disabled) {
                const playerChoice = button.dataset.choice;
                playRound(playerChoice);
            }
        }
    });
});

// Play Again button event listener
playAgainBtnEl.addEventListener('click', () => {
    initGame();
});

// Add keyboard support for Play Again button
playAgainBtnEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        initGame();
    }
});

// Close game over modal when clicking outside (optional enhancement)
gameOverSectionEl.addEventListener('click', (e) => {
    if (e.target === gameOverSectionEl) {
        // Don't close automatically - require Play Again button click
        // This ensures player sees the final result
    }
});

// Add keyboard shortcut for choices (optional enhancement)
document.addEventListener('keydown', (e) => {
    if (gameState.gameOver) return;
    
    // Allow keyboard shortcuts only when buttons are enabled
    const anyButtonEnabled = Array.from(choiceButtons).some(btn => !btn.disabled);
    if (!anyButtonEnabled) return;

    switch(e.key.toLowerCase()) {
        case 'r':
            e.preventDefault();
            document.getElementById('rockBtn').click();
            break;
        case 'p':
            e.preventDefault();
            document.getElementById('paperBtn').click();
            break;
        case 's':
            e.preventDefault();
            document.getElementById('scissorsBtn').click();
            break;
    }
});

// Add visual feedback for button interactions
choiceButtons.forEach(button => {
    // Add hover sound effect simulation with visual feedback
    button.addEventListener('mouseenter', () => {
        if (!button.disabled) {
            button.style.transform = 'translateY(-2px)';
        }
    });
    
    button.addEventListener('mouseleave', () => {
        if (!button.disabled) {
            button.style.transform = '';
        }
    });
    
    // Add click animation
    button.addEventListener('mousedown', () => {
        if (!button.disabled) {
            button.style.transform = 'translateY(0)';
        }
    });
    
    button.addEventListener('mouseup', () => {
        if (!button.disabled) {
            button.style.transform = 'translateY(-2px)';
        }
    });
});

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    // Add initial focus to first choice button for accessibility
    document.getElementById('rockBtn').focus();
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    // Ensure game over modal stays centered
    if (!gameOverSectionEl.classList.contains('hidden')) {
        // Modal positioning is handled by CSS, but we can add any resize-specific logic here
    }
});

// Prevent context menu on choice buttons for better mobile experience
choiceButtons.forEach(button => {
    button.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});

// Add touch support for mobile devices
choiceButtons.forEach(button => {
    let touchStartTime = 0;
    
    button.addEventListener('touchstart', (e) => {
        touchStartTime = Date.now();
        if (!button.disabled) {
            button.style.transform = 'translateY(0)';
        }
    });
    
    button.addEventListener('touchend', (e) => {
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration < 500 && !button.disabled) { // Prevent accidental long presses
            button.style.transform = '';
        }
    });
    
    button.addEventListener('touchcancel', () => {
        if (!button.disabled) {
            button.style.transform = '';
        }
    });
});

// Console log for debugging (can be removed in production)
console.log('Rock Paper Scissors game initialized!');
console.log('Keyboard shortcuts: R for Rock, P for Paper, S for Scissors');