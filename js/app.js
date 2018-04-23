const boxes = document.querySelectorAll(".box");
const startGameBtn = document.getElementById("startGame");
const counter = document.querySelector(".counter p");
const strictModeBtn = document.getElementById("strictMode");

const initSeq = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3];
// const initSeq = [0, 1, 2];
let rSeq = [];
let count = 0;
let picks = [];
let pickCount = 0;
let isPlayerTurn = false;
let maxSteps = 1;
let isStrictMode = false;

function randSeq() {
  return initSeq.map(org => Math.floor(Math.random() * Math.floor(4)));
}

// turns player's turn off and starts sequence recursively until current max steps
function startSeq() {
  isPlayerTurn = false;
  setTimeout(function () {
    step(count);
    count++;
    updateCounter(count);
    if (count < maxSteps) startSeq();
    if (count === maxSteps) {
      isPlayerTurn = true;
    }
  }, 1500);
}

// makes next step glow and play sound
function step(nextStep) {
  boxes[rSeq[nextStep]].classList.add("glow");
  playAudio(`sounds/sound${rSeq[nextStep] + 1}.wav`);
}

function playAudio(audioURL) {
  const audio = new Audio(audioURL);
  audio.play();
}


// grabs the user's guess and call function to check if correct
function pick() {
  const boxesArr = Array.from(boxes);
  let index = 0;
  if (pickCount < count && isPlayerTurn) {
    index = boxesArr.indexOf(this);
    boxes[index].classList.add("glow");
    picks.push(boxesArr.indexOf(this));
    checkIfCorrect(picks, index);
  }
  // console.log("pick count: ", pickCount);
}

function checkIfCorrect(picks, index) {
  // console.log("picks: ", picks, rSeq[pickCount]);

  if (picks[pickCount] === rSeq[pickCount]) {
    pickCount++;
    playAudio(`sounds/sound${index + 1}.wav`);
    if (maxSteps === rSeq.length && pickCount === rSeq.length) {
      playAudio("sounds/applause.wav");
      playAudio(audioURL);
      isPlayerTurn = false;
    } else if (pickCount === maxSteps) {
      pickCount = 0;
      count = 0;
      picks.length = 0;
      maxSteps++;
      startSeq();
    }
  } else {
    pickCount = 0;
    playAudio("sounds/error.wav");
    count = 0;
    picks.length = 0;
    if (!isStrictMode) {
      startSeq();
    } else {
      startStrict();
    }
  }
}



function removeTransition(e) {
  if (e.propertyName !== "opacity") return;
  this.classList.remove("glow");
}

function updateCounter(steps) {
  counter.textContent = steps;
}

function defaultSettings() {
  rSeq = randSeq();
  pickCount = 0;
  count = 0;
  picks.length = 0;
  maxSteps = 1;
}

// load default settings and start initial sequence
function startGame() {
  counter.textContent = "Normal Mode";
  strictModeBtn.classList.remove('strict-active');
  isStrictMode = false;
  defaultSettings();
  startSeq();
}

function startStrict() {
  counter.textContent = "Strict Mode";
  strictModeBtn.classList.add('strict-active');
  isStrictMode = true;
  defaultSettings();
  startSeq();
}

boxes.forEach(box => box.addEventListener("click", pick));
boxes.forEach(box => box.addEventListener("transitionend", removeTransition));
startGameBtn.addEventListener("click", startGame);
strictModeBtn.addEventListener("click", startStrict);