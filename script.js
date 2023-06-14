"use strict"

const startBtn = document.querySelector(".start-btn");
const restartBtn = document.querySelector(".restart-btn");
const intro = document.querySelector(".game-intro");
const main = document.querySelector(".main");


startBtn.addEventListener("click", () => {
    intro.style.display = "none";
    main.style.display = "block";
});

restartBtn.addEventListener("click", () => {
    main.style.display = "none";
    intro.style.display = "block";
});