var buttons = document.querySelectorAll('.colorBtn');
var startBtn = document.querySelector('#start');
var redBtn = document.querySelector('#red');
var greenBtn = document.querySelector('#green');
var blueBtn = document.querySelector('#blue');
var yellowBtn = document.querySelector('#yellow');
var sequence = [];
var selected = [];
var round = 0;
var presses = 0;
var lives = 3;
var mode = 'normal';
var redSound = document.querySelector('#redSound');
var blueSound = document.querySelector('#blueSound');
var yellowSound = document.querySelector('#yellowSound');
var greenSound = document.querySelector('#greenSound');
var countDisplay = document.querySelector('#count');
var strictButton = document.querySelector('#strictBtn');
var placeHolder = 0;
var tryDiv = document.querySelector('#tryAgain');
var loseDiv = document.querySelector('#loseGame');
var winDiv = document.querySelector('#winGame');
var triesLeft = document.querySelector('#tries');

function hello(){
  playYellow();
  setTimeout(playRed, 300);
  setTimeout(playBlue, 600);
  setTimeout(playGreen, 900);
}
hello();

function playRed() {
  redSound.currentTime = 0;
  redSound.play();
  redBtn.classList = 'colorBtn playing';
  setTimeout(function() {
    redBtn.classList = 'colorBtn';
  }, 350);
}

function playGreen() {
  greenSound.currentTime = 0;
  greenSound.play();
  greenBtn.classList = 'colorBtn playing';
  setTimeout(function() {
    greenBtn.classList = 'colorBtn';
  }, 350);
}

function playBlue() {
  blueSound.currentTime = 0;
  blueSound.play();
  blueBtn.classList = 'colorBtn playing';
  setTimeout(function() {
    blueBtn.classList = 'colorBtn';
  }, 350);
}

function playYellow() {
  yellowSound.currentTime = 0;
  yellowSound.play();
  yellowBtn.classList = 'colorBtn playing';
  setTimeout(function() {
    yellowBtn.classList = 'colorBtn';
  }, 350);
}

function playSound(color) {
  if (color === 'red') playRed();
  else if (color === 'green') playGreen();
  else if (color === 'blue') playBlue();
  else if (color === 'yellow') playYellow();
}

function delayPlay() {
  if (placeHolder === sequence.length) {
    placeHolder = 0;
    buttons.forEach(function(button) {
      button.addEventListener('click', selectButton);
    });
    return;
  }
  setTimeout(function() {
    playSound(sequence[placeHolder]);
    placeHolder++;
    delayPlay();
  }, 500);
}

function computerTurn() {
  setTimeout(function() {
    console.log('computer taking turn');
    buttons.forEach(function(button) {
      button.removeEventListener('click', selectButton);
    });
    round++;
    countDisplay.innerHTML = round;
    //create button press sequences
    sequence.push(buttons[Math.floor(Math.random() * buttons.length)].id);
    console.log('sequence = ' + sequence);
    /**for (var k in sequence) {
        setTimeout(playSound(sequence[k]), (k * 1000));
    } */
    delayPlay();

    //play a tone dependent on the id of the button pressed
    presses = 0; //reset number of player button presses
    selected = []; //clear player selections
    lives = 3;
  }, 500);
}

function hideWin() {
  setTimeout(function() {
    winDiv.style.display = 'none';
  }, 3000);
}

function hideLose() {
  setTimeout(function() {
    loseDiv.style.display = 'none';
  }, 2000);
}

function hideTry() {
  setTimeout(function() {
    tryDiv.style.display = 'none';
  }, 2000);
}

function addListeners() {
  buttons.forEach(function(button) {
    button.removeEventListener('click', selectButton);
  });
}

function selectButton() { //for user to select buttons
  presses++;
  playSound(this.id);
  selected.push(this.id);
  //add to the array, check each time for match, once selected array matches length of sequence array, begin new turn
  for (var j = 0; j < selected.length; j++) {
    if (selected) {
      if (selected[j] != sequence[j]) { //if you press the wrong sequence
        if (mode === 'strict') { //if you press the wrong sequence in strict mode
          loseDiv.style.display = 'inline';
          hideLose();
          reset();
          return;
        } else if (mode !== 'strict' && lives > 1) { //wrong sequence in normal mode
          triesLeft.innerHTML = lives - 1;
          tryDiv.style.display = 'inline';
          hideTry();
        }
        addListeners();
        setTimeout(delayPlay, 2000);
        presses = 0;
        selected = [];
        lives--;
        if (lives < 1) {
          loseDiv.style.display = 'inline';
          hideLose();
          reset();
          return;
        }
      }
    }
    if (presses === sequence.length) {
      if (sequence.length === 20) { //number of rounds to win
        winDiv.style.display = 'inline';
        hideWin();
        reset();
        return;
      }
      computerTurn();
      return;
    }
  }
}

function startGame() {
  console.log('Starting game', "Mode = " + mode);
  strictButton.removeEventListener('click', strictMode);
  buttons.forEach(function(button) {
    button.addEventListener('click', selectButton);
  });
  startBtn.removeEventListener('click', startGame);
  computerTurn();
  startBtn.innerHTML = 'Reset';
  startBtn.addEventListener('click', reset);
}

function strictMode() {
  console.log('strictMode function called by ' + this.id);
  if (mode !== 'strict') {
    mode = 'strict';
    strictButton.style.backgroundColor = 'red';
    console.log('Strict mode enabled', "Mode = " + mode);
  } else {
    mode = 'normal';
    strictButton.style.backgroundColor = 'darkred';
    console.log('Strict mode disabled', "Mode = " + mode);
  }
}

function reset() {
  startBtn.innerHTML = 'Start';
  countDisplay.innerHTML = 0;
  round = 0;
  sequence = [];
  selected = [];
  lives = 3;
  placeHolder = 0;
  presses = 0;
  startBtn.addEventListener('click', startGame);
  buttons.forEach(function(button) {
    button.removeEventListener('click', selectButton);
  });
  strictButton.addEventListener('click', strictMode);
  return;
}

startBtn.addEventListener('click', startGame);
strictButton.addEventListener('click', strictMode);
