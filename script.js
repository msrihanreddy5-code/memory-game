const gameBoard = document.getElementById("game-board");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const aiMessage = document.getElementById("ai-message");
const restartBtn = document.getElementById("restart-btn");

let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let time = 0;
let timerInterval;

const icons = ["😊", "😂", "😁", "😒", "👌", "👍", "😉", "😜"];
let cards = [...icons, ...icons];

function shuffleCards() {
  cards.sort(() => Math.random() - 0.5);
}

function createBoard() {
  shuffleCards();
  cards.forEach((icon) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="front">${icon}</div>
      <div class="back">?</div>
    `;
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard || this === firstCard) return;

  this.classList.add("flip");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    startTimer();
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  moves++;
  movesDisplay.textContent = `Moves: ${moves}`;

  if (moves === 10) {
    restartBtn.classList.remove("hidden");
  }

  let isMatch =
    firstCard.querySelector(".front").textContent ===
    secondCard.querySelector(".front").textContent;

  isMatch ? disableCards() : unflipCards();
  aiReact();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  matchedPairs++;

  if (matchedPairs === icons.length) {
    setTimeout(() => gameOver(), 800);
  }

  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 800);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function aiReact() {
  const msg = aiComments[Math.floor(Math.random() * aiComments.length)];
  aiMessage.textContent = `AI: ${msg}`;
}

function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      time++;
      timerDisplay.textContent = `Time: ${time}s`;
    }, 1000);
  }
}

function calculateScore() {
  return Math.max(1000 - (moves * 10 + time * 2), 0);
}

function gameOver() {
  clearInterval(timerInterval);
  const finalScore = calculateScore();
  scoreDisplay.textContent = `Score: ${finalScore}`;

  const overlay = document.createElement("div");
  overlay.classList.add("game-over-overlay");
  overlay.innerHTML = `
    <div class="game-over-box">
      <h2> Game Over </h2>
      <p>Your Score: <strong>${finalScore}</strong></p>
      <p>${finalScore > 800 ? "Impressive" : "Not bad Try again?"}</p>
      <button id="play-again">Play Again</button>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("play-again").addEventListener("click", () => {
    overlay.remove();
    restartGame();
  });
}

function restartGame() {
  clearInterval(timerInterval);
  timerInterval = null;
  [moves, matchedPairs, time] = [0, 0, 0];
  gameBoard.innerHTML = "";
  movesDisplay.textContent = "Moves: 0";
  timerDisplay.textContent = "Time: 0s";
  scoreDisplay.textContent = "Score: 0";
  aiMessage.textContent = "Let's see if you can beat me this time...";
  restartBtn.classList.add("hidden");
  createBoard();
}

restartBtn.addEventListener("click", restartGame);
createBoard();
