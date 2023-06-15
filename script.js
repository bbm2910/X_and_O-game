"use strict"

const startBtn = document.querySelector(".start-btn");
const intro = document.querySelector(".game-intro");
const main = document.querySelector(".main");

const vsPlayerRadio = document.getElementById("vsPlayer");
const vsComputerRadio = document.getElementById("vsComputer");
const vsPlayerLabel = document.querySelector('label[for="vsPlayer"]');
const vsComputerLabel = document.querySelector('label[for="vsComputer"]');
let gameOver = false;

startBtn.addEventListener("click", () => {
    const gameStartAudio = new Audio("audio/game-start.mp3");

    if (vsPlayerRadio.checked == true) {
        setTimeout(() => {
            intro.style.display = "none";
            main.style.display = "block";
        }, 3000);
        gameStartAudio.play();
    }
});

vsPlayerRadio.addEventListener("click", () => {
    vsPlayerLabel.style.backgroundColor = "#F29727";
    vsComputerLabel.style.backgroundColor = ""; // Reset background color of other label
});

vsComputerRadio.addEventListener("click", () => {
    vsComputerLabel.style.backgroundColor = "#F29727";
    vsPlayerLabel.style.backgroundColor = ""; // Reset background color of other label
});


const Gameboard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => board;
    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
    };

    return { getBoard, resetBoard };
})();

const Player = (name, mark) => {
    return { name, mark };
};

const Game = (() => {
    const player1 = Player('Player 1', 'X');
    const player2 = Player('Player 2', 'O');
    let currentPlayer = player1;

    const cells = document.querySelectorAll('.cell');

    const start = () => {
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => {
                handleCellClick(index);
            });
        });
        const restartBtn = document.querySelector(".restart-btn")
        restartBtn.addEventListener('click', () => {
            resetGame();
            gameOver = false;
        });

        const returnToMain = document.querySelector(".return-to-main");
        returnToMain.addEventListener("click", () => {
            setTimeout(() => {
                main.style.display = "none";
                intro.style.display = "block";
                resetGame();
            }, 300);

        });
    };

    const handleCellClick = (index) => {
        const board = Gameboard.getBoard();

        if (gameOver || board[index] !== '') {
            let invalidSelectionAudio = new Audio("audio/invalid-selection.mp3");
            invalidSelectionAudio.play();
            console.log('Cell occupied! Choose another one.');
            return;
        }

        board[index] = currentPlayer.mark;
        cells[index].textContent = currentPlayer.mark;

        const audioChoice = new Audio("audio/choice-sound.mp3");
        audioChoice.play();
        const gameDone = new Audio("audio/game-over.mp3");

        const playerScore = document.querySelector(".player-score");
        const ties = document.querySelector(".ties-score");
        const computerScore = document.querySelector(".computer-score")

        if (checkWin(currentPlayer.mark)) {
            if (currentPlayer.mark == "X") {
                let player = parseInt(playerScore.textContent) || 0;
                player++;
                playerScore.textContent = player;
                const gameBoardElement = document.querySelector('.game-board');
                const originalBackgroundColor = gameBoardElement.style.backgroundColor;
                gameBoardElement.style.backgroundColor = "#bce29e";

                setTimeout(() => {
                    gameBoardElement.style.backgroundColor = originalBackgroundColor;
                }, 1000);
                gameOver = true;
                gameDone.play();
            }
            else if (currentPlayer.mark == "O") {
                let computer = parseInt(computerScore.textContent) || 0;
                computer++;
                computerScore.textContent = computer;
                const gameBoardElement = document.querySelector('.game-board');
                const originalBackgroundColor = gameBoardElement.style.backgroundColor;
                gameBoardElement.style.backgroundColor = "#f8c4b4";

                setTimeout(() => {
                    gameBoardElement.style.backgroundColor = originalBackgroundColor;
                }, 1000);
                gameOver = true;
                gameDone.play();
            }


        } else if (checkDraw()) {
            let tieCount = parseInt(ties.textContent) || 0;
            tieCount++;
            ties.textContent = tieCount;
            const gameBoardElement = document.querySelector('.game-board');
            const originalBackgroundColor = gameBoardElement.style.backgroundColor;
            gameBoardElement.style.backgroundColor = "#e5ebb2";

            setTimeout(() => {
                gameBoardElement.style.backgroundColor = originalBackgroundColor;
            }, 1000);
            gameOver = true;
            gameDone.play();
        } else {
            currentPlayer = currentPlayer === player1 ? player2 : player1;
        }
    };

    const checkWin = (mark) => {
        const board = Gameboard.getBoard();
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] === mark && board[b] === mark && board[c] === mark) {
                return true;
            }
        }

        return false;
    };

    const checkDraw = () => {
        const board = Gameboard.getBoard();
        return board.every(cell => cell !== '');
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        cells.forEach(cell => (cell.textContent = ''));
        currentPlayer = player1;
    };

    return { start };
})();

// Start the game
Game.start();