const startBtn = document.querySelector(".start-btn");
const intro = document.querySelector(".game-intro");
const main = document.querySelector(".main");
let playingAgainst = document.querySelector(".againstComputer");
const vsPlayerRadio = document.getElementById("vsPlayer");
const vsComputerRadio = document.getElementById("vsComputer");
const vsPlayerLabel = document.querySelector('label[for="vsPlayer"]');
const vsComputerLabel = document.querySelector('label[for="vsComputer"]');


// Start the game - btn
startBtn.addEventListener("click", () => {
    const gameStartAudio = new Audio("audio/game-start.mp3");
    if (vsComputerRadio.checked) {
        intro.classList.add("animate");
        // Set time-out so the games starts after the intro sound
        setTimeout(() => {
            intro.style.display = "none";
            intro.classList.remove("animate");
            main.style.display = "block";
            playingAgainst.textContent = "Computer";
        }, 3000);
        gameStartAudio.play();
        Game.start(true);
    }
    if (vsPlayerRadio.checked) {
        intro.classList.add("animate");
        setTimeout(() => {
            intro.style.display = "none";
            intro.classList.remove("animate");
            main.style.display = "block";
            playingAgainst = "Player - 0";
        }, 3000);
        gameStartAudio.play();
        Game.start(false);
    }

    // Score board at the start
    const playerScore = document.querySelector(".player-score");
    const ties = document.querySelector(".ties-score");
    const computerScore = document.querySelector(".computer-score");
    playerScore.textContent = "0";
    ties.textContent = "0";
    computerScore.textContent = "0";
    // console.log(Gameboard.getBoard());
});


// Change background color of the input if it's checked
vsPlayerRadio.addEventListener("click", () => {
    vsPlayerLabel.style.backgroundColor = "#F29727";
    vsComputerLabel.style.backgroundColor = "";
});

vsComputerRadio.addEventListener("click", () => {
    vsComputerLabel.style.backgroundColor = "#F29727";
    vsPlayerLabel.style.backgroundColor = "";
});


// Buttons inside the game to restart or go to the main menu
const restartBtn = document.querySelector(".restart-btn");
restartBtn.addEventListener('click', () => {
    const resetGame = new Audio("audio/reset-game.mp3")
    Game.resetGame();
    resetGame.play();
    gameOver = false;
});

const returnToMain = document.querySelector(".return-to-main");
returnToMain.addEventListener("click", () => {
    setTimeout(() => {
        main.style.display = "none";
        intro.style.display = "block";
        intro.classList.add("animate-big");
        Game.resetGame();
    }, 300);
});


// Game-board
const Gameboard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];

    const updateBoard = (index, mark) => {
        board[index] = mark;
    };

    //Check winning combinations across the board
    const checkWin = (mark) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let condition of winConditions) {
            if (
                board[condition[0]] === mark &&
                board[condition[1]] === mark &&
                board[condition[2]] === mark
            ) {
                return true;
            }
        }

        return false;
    };

    const checkTie = () => {
        return board.every(cell => cell !== '');
    };
    const getBoard = () => board;
    const clearBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
    };


    return { updateBoard, checkWin, checkTie, getBoard, clearBoard };
})();


// Game logic
const Game = (() => {
    let player1;
    let player2;
    let currentPlayer;
    let vsComputer;
    let gameOver = false;
    const cells = document.querySelectorAll('.cell');

    const start = (vsComputerMode) => {
        player1 = createPlayer('Player 1', 'X');
        player2 = vsComputerMode ? createPlayer('Computer', 'O') : createPlayer('Player 2', 'O');
        currentPlayer = player1;
        vsComputer = vsComputerMode;
        gameOver = false;
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
    };

    const createPlayer = (name, mark) => {
        return { name, mark };
    };

    const handleCellClick = (e) => {
        const selectedCell = e.target;
        const cellIndex = Array.from(cells).indexOf(selectedCell);

        if (gameOver || selectedCell.textContent !== '') {
            let invalidSelectionAudio = new Audio("audio/invalid-selection.mp3");
            invalidSelectionAudio.play();
            return;
        }

        updateBoard(cellIndex);
        selectedCell.textContent = currentPlayer.mark;
        const audioChoice = new Audio("audio/choice-sound.mp3");
        audioChoice.play();

        const gameBoardElement = document.querySelector('.game-board');
        const originalBackgroundColor = gameBoardElement.style.backgroundColor;

        if (checkWin(currentPlayer.mark)) {
            if (currentPlayer.mark === 'X') {
                let playerScore = document.querySelector(".player-score");
                let player = parseInt(playerScore.textContent) || 0;
                player++;
                playerScore.textContent = player;
                gameBoardElement.style.backgroundColor = "#bce29e";

                setTimeout(() => {
                    gameBoardElement.style.backgroundColor = originalBackgroundColor;
                }, 1000);
            } else if (currentPlayer.mark === 'O') {
                let computerScore = document.querySelector(".computer-score");
                let computer = parseInt(computerScore.textContent) || 0;
                computer++;
                computerScore.textContent = computer;
                gameBoardElement.style.backgroundColor = "#f8c4b4";

                setTimeout(() => {
                    gameBoardElement.style.backgroundColor = originalBackgroundColor;
                }, 1000);

            }

            setTimeout(() => {
                gameBoardElement.style.backgroundColor = originalBackgroundColor;
            }, 2000);

            gameOver = true;
            gameDone.play();
            return;
        }

        if (checkTie()) {
            gameOver = true;
            announceTie();
            return;
        }

        switchPlayers();
        if (vsComputer && currentPlayer === player2) {
            makeComputerMove();
        }
    };

    const updateBoard = (cellIndex) => {
        Gameboard.updateBoard(cellIndex, currentPlayer.mark);
    };

    const switchPlayers = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWin = () => {
        return Gameboard.checkWin(currentPlayer.mark);
    };

    const checkTie = () => {
        return Gameboard.checkTie();
    };
    const gameDone = new Audio("audio/game-over.mp3");

    const announceWinner = () => {
        const gameBoardElement = document.querySelector('.game-board');
        const originalBackgroundColor = gameBoardElement.style.backgroundColor;
        gameBoardElement.style.backgroundColor = "#f8c4b4";
        gameDone.play();
        setTimeout(() => {
            gameBoardElement.style.backgroundColor = originalBackgroundColor;
        }, 4000);
    };

    const announceTie = () => {
        let ties = document.querySelector(".ties-score");
        let tieCount = parseInt(ties.textContent) || 0;
        tieCount++;
        ties.textContent = tieCount;
        const gameBoardElement = document.querySelector('.game-board');
        const originalBackgroundColor = gameBoardElement.style.backgroundColor;
        gameBoardElement.style.backgroundColor = '#e5ebb2';
        gameDone.play();
        setTimeout(() => {
            gameBoardElement.style.backgroundColor = originalBackgroundColor;
        }, 4000);
    };

    // Computer moves
    const makeComputerMove = () => {
        const emptyCells = Array.from(cells).filter(cell => cell.textContent === '');
        if (emptyCells.length === 0) return;

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const selectedCell = emptyCells[randomIndex];
        const cellIndex = Array.from(cells).indexOf(selectedCell);
        const audioChoice = new Audio("audio/choice-sound.mp3");

        setTimeout(() => {
            audioChoice.play();
            selectedCell.textContent = currentPlayer.mark;
            updateBoard(cellIndex);

            if (checkWin()) {
                gameOver = true;
                announceWinner(currentPlayer);
            }

            if (checkTie()) {
                gameOver = true;
                announceTie();
            }

            switchPlayers();
        }, 1000);
    };
    const resetGame = () => {
        // Clear the game board
        Gameboard.clearBoard();

        // Reset the player and game state
        currentPlayer = player1;
        gameOver = false;

        // Clear the cell contents
        cells.forEach(cell => {
            cell.textContent = '';
        });

        // REATTACH the event listeners
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
    };

    return { start, resetGame };
})();
