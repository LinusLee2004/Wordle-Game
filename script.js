const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

let secretWord = "";
let validWords = []; // All words from words.txt
let currentRow = 0;
let currentTile = 0;
let grid = document.querySelectorAll(".row .tile");

// Load words from local file
fetch("words.txt")
  .then(response => response.text())
  .then(text => {
    // Split lines and uppercase
    validWords = text.split("\n").map(word => word.trim().toUpperCase());

    // Filter words of correct length
    const wordLengthWords = validWords.filter(word => word.length === WORD_LENGTH);

    // Pick a random secret word
    secretWord = wordLengthWords[Math.floor(Math.random() * wordLengthWords.length)];
    console.log("Secret Word:", secretWord);
  })
  .catch(err => console.error("Failed to load words.txt", err));

// Handle keyboard input
document.addEventListener("keydown", handleKey);

function handleKey(e) {
  const key = e.key.toUpperCase();

  if (key === "BACKSPACE") {
    deleteLetter();
    return;
  }

  if (key === "ENTER") {
    submitGuess();
    return;
  }

  if (key.length === 1 && key.match(/[A-Z]/i)) {
    addLetter(key);
  }
}

function addLetter(letter) {
  if (currentTile < WORD_LENGTH) {
    const tile = getTile(currentRow, currentTile);
    tile.textContent = letter;
    currentTile++;
  }
}

function deleteLetter() {
  if (currentTile > 0) {
    currentTile--;
    const tile = getTile(currentRow, currentTile);
    tile.textContent = "";
  }
}

function submitGuess() {
  if (currentTile !== WORD_LENGTH) {
    alert("Please fill out every letter!");
    return;
  }

  let guess = "";
  for (let i = 0; i < WORD_LENGTH; i++) {
    guess += getTile(currentRow, i).textContent;
  }

  guess = guess.toUpperCase();

  if (!validWords.includes(guess)) {
    alert("Word not in dictionary!");
    return;
  }

  checkGuess(guess);
  currentRow++;
  currentTile = 0;

  if (currentRow === MAX_GUESSES && guess !== secretWord) {
    alert("Game Over! The word was " + secretWord);
  }
}

function checkGuess(guess) {
  for (let i = 0; i < WORD_LENGTH; i++) {
    const tile = getTile(currentRow, i);

    if (guess[i] === secretWord[i]) {
      tile.classList.add("correct");
    } else if (secretWord.includes(guess[i])) {
      tile.classList.add("present");
    } else {
      tile.classList.add("absent");
    }
  }

  if (guess === secretWord) {
    alert("You Win!");
  }
}

function getTile(row, col) {
  return grid[row * WORD_LENGTH + col];
}
