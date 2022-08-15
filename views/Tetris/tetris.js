const KEY = {
  ESC: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  P: 80,
};

let height = 31; // field size, original: 34
let width = 17; // field size, original: 20
let tileColor = "#BDBDBD",
  tetrominoColor,
  wallColor = "#7D7D7D";
let currentColorIndex, nextColorIndex;
let currentRotateIndex = 0;
let currentTetromino, nextTetromino;
let tetrominoPoint;
let generatePoint = [1, Math.floor(width / 2) - 2];
let tetrominoCell;
let fastMode = false;
let movingSpeed,
  initSpeed = 500;
let movingThread;
let deltaSpeed = 40;
let fastSpeed = 25;
let score,
  level,
  levelStack = 0;
let realField = [];
let isPaused = false;

let TETROMINOES = [
  [
    // I
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],
  [
    // J
    [
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [1, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [1, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  [
    // L
    [
      [0, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [1, 1, 1, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  [
    // ㅁ
    [
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  [
    // ㅗ
    [
      [0, 0, 1, 0],
      [0, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 1],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 1],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ],
  ],
  [
    // ㄹ(1)
    [
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 1],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 1],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  [
    // ㄹ(2)
    [
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 0, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 0, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
];

let tetrominoColorArray = [
  "rgb(199,82,82)",
  "rgb(233,174,43)",
  "rgb(105,155,55)",
  "rgb(53,135,145)",
  "rgb(49,95,151)",
  "rgb(102,86,167)",
];

function info() {
  alert("This is an alert.\n");
}

function pause() {
  if (isPaused) {
    movingThread = setTimeout("moveDown()", movingSpeed);
    document.getElementById("pause").style.visibility = "hidden";
    document.getElementById("gameField").style.visibility = "visible";
    isPaused = false;
  } else {
    clearTimeout(movingThread);
    document.getElementById("gameField").style.visibility = "hidden";
    document.getElementById("pause").style.visibility = "visible";
    isPaused = true;
  }
}

function gameOver() {
  clearTimeout(movingThread);
  generateField();
  alert("[Game Over]\nLevel: " + level + "\nScore: " + score);
  document.getElementById("gameField").style.visibility = "hidden";
  document.getElementById("gameover").style.visibility = "visible";
}

function displayCombo(combo, finalScore) {
  let comboStr = combo + " COMBO +" + finalScore;
  document.getElementById("comboField").innerHTML = comboStr;
  setTimeout(function () {
    document.getElementById("comboField").innerHTML = "";
  }, 700);
}

function updateScore(plusScore, combo) {
  let comboScore = plusScore * combo;
  score += comboScore;
  document.getElementById("score").innerHTML = score;
  return comboScore;
}

function leveling() {
  if (level === 10) return;
  if (levelStack === level * 10) {
    level++;
    levelStack = 0;
    if (!fastMode) movingSpeed = initSpeed - level * deltaSpeed;
  }
  document.getElementById("level").innerHTML = level;
}

function removeLine(lineIndex) {
  for (let i = lineIndex - 1; i >= 1; i--) {
    for (let j = 1; j < width - 1; j++) {
      shortCut(i + 1, j).style.background = shortCut(i, j).style.background;
      realField[i + 1][j] = realField[i][j];
    }
  }
}

function isFull(lineIndex) {
  for (let i = 1; i < width - 1; i++)
    if (!realField[lineIndex][i]) return false;
  return true;
}

function checkLine() {
  let plusScore = level * 100;
  let combo = 0;
  let finalScore = 0;
  for (let i = height - 2; i > 1; i--) {
    if (isFull(i)) {
      removeLine(i);
      i++;
      finalScore += updateScore(plusScore, ++combo);
    }
    if (combo > 0) displayCombo(combo, finalScore);
  }
}

function commitExist() {
  for (let i = 0; i < tetrominoCell.length; i++) {
    let y = tetrominoCell[i][0];
    let x = tetrominoCell[i][1];
    realField[y][x] = true;
  }
}

function moveSlow() {
  if (!fastMode) return;
  clearTimeout(movingThread);
  movingSpeed = initSpeed - level * deltaSpeed;
  movingThread = setTimeout("moveDown()", movingSpeed);
  fastMode = false;
}

function moveFast() {
  if (fastMode) return;
  clearTimeout(movingThread);
  movingSpeed = fastSpeed;
  movingThread = setTimeout("moveDown()", movingSpeed);
  fastMode = true;
}

function moveLR(delta) {
  if (!canMove(0, delta) || isPaused) return;
  removeTetromino();
  for (let i = 0; i < tetrominoCell.length; i++) tetrominoCell[i][1] += delta;
  tetrominoPoint[1] += delta;
  showTetromino();
}

function canMove(dy, dx) {
  for (let i = 0; i < tetrominoCell.length; i++) {
    let ny = tetrominoCell[i][0] + dy;
    let nx = tetrominoCell[i][1] + dx;
    if (!isValidPoint(ny, nx)) {
      return false;
    }
  }
  return true;
}

function showTetromino() {
  for (let i = 0; i < tetrominoCell.length; i++) {
    shortCut(
      tetrominoCell[i][0],
      tetrominoCell[i][1]
    ).style.background = tetrominoColor;
  }
}

function removeTetromino() {
  for (let i = 0; i < tetrominoCell.length; i++) {
    shortCut(
      tetrominoCell[i][0],
      tetrominoCell[i][1]
    ).style.background = tileColor;
  }
}

//  true for valid, false for invalid
function isValidPoint(y, x) {
  return !(
    y <= 0 ||
    y >= height - 1 ||
    x <= 0 ||
    x >= width - 1 ||
    realField[y][x]
  );
}

function canRotate() {
  let tempRotateIndex = currentRotateIndex + 1;
  if (tempRotateIndex === 4) tempRotateIndex = 0;
  let tempTetromino = TETROMINOES[currentTetromino][tempRotateIndex];
  for (let i = 0; i < tempTetromino.length; i++) {
    for (let j = 0; j < tempTetromino.length; j++) {
      if (tempTetromino[i][j] === 1) {
        let ty = tetrominoPoint[0] + i;
        let tx = tetrominoPoint[1] + j;
        if (!isValidPoint(ty, tx)) {
          return false;
        }
      }
    }
  }
  return true;
}

function rotateTetromino() {
  if (!canRotate()) return;
  removeTetromino();
  tetrominoCell = [];
  currentRotateIndex++;
  if (currentRotateIndex === 4) currentRotateIndex = 0;
  tetromino = TETROMINOES[currentTetromino][currentRotateIndex];
  for (let i = 0; i < tetromino.length; i++) {
    for (let j = 0; j < tetromino.length; j++) {
      if (tetromino[i][j] === 1) {
        let sy = tetrominoPoint[0] + i;
        let sx = tetrominoPoint[1] + j;
        document.getElementById(
          String(sy) + " " + String(sx)
        ).style.background = tetrominoColor;
        tetrominoCell.push([sy, sx]);
      }
    }
  }
  console.log("rotateTetromino currentRotateIndex: ", currentRotateIndex);
  showTetromino();
}

function goBottom() {
  while (canMove(1, 0)) {
    if (!canMove(1, 0)) {
      commitExist();
      checkLine();
      tetrominoCell = [];
      generateTetromino();
      return;
    }
    removeTetromino();
    for (let i = 0; i < tetrominoCell.length; i++) tetrominoCell[i][0]++;
    tetrominoPoint[0]++;
    showTetromino();
  }
}

function moveDown() {
  if (!canMove(1, 0)) {
    commitExist();
    checkLine();
    tetrominoCell = [];
    generateTetromino();
    return;
  }
  removeTetromino();
  for (let i = 0; i < tetrominoCell.length; i++) tetrominoCell[i][0]++;
  tetrominoPoint[0]++;
  showTetromino();
  movingThread = setTimeout("moveDown()", movingSpeed);
}

function initNextTable() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      document.getElementById(String(i) + String(j)).style.background =
        "#7D7D7D";
    }
  }
}

function generateTetromino() {
  for (let i = 0; i < 2; i++) tetrominoPoint[i] = generatePoint[i];
  currentTetromino = nextTetromino;
  currentColorIndex = nextColorIndex;
  tetrominoColor = tetrominoColorArray[currentColorIndex];
  let tetromino = TETROMINOES[currentTetromino][0];
  pickingNextTetromino();
  pickingNextColor();
  displayNextTetromino();
  for (let i = 0; i < tetromino.length; i++) {
    for (let j = 0; j < tetromino.length; j++) {
      if (tetromino[i][j] === 1) {
        let sy = tetrominoPoint[0] + i;
        let sx = tetrominoPoint[1] + j;
        if (!isValidPoint(sy, sx)) gameOver();
        shortCut(
          Math.floor(sy),
          Math.floor(sx)
        ).style.background = tetrominoColor;
        tetrominoCell.push([sy, sx]);
      }
    }
  }
  currentRotateIndex = 0;
  levelStack++;
  leveling();
  movingThread = setTimeout("moveDown()", movingSpeed);
}

function displayNextTetromino() {
  initNextTable();
  let tetromino = TETROMINOES[nextTetromino][0];
  let color = tetrominoColorArray[nextColorIndex];
  for (let i = 0; i < tetromino.length; i++) {
    for (let j = 0; j < tetromino.length; j++) {
      if (tetromino[i][j] === 1)
        document.getElementById(String(i) + String(j)).style.background = color;
    }
  }
}

function pickingNextColor() {
  if (++nextColorIndex === tetrominoColorArray.length) nextColorIndex = 0;
}

function pickingNextTetromino() {
  nextTetromino = Math.floor(Math.random() * TETROMINOES.length);
}

function setWall() {
  for (var i = 0; i < height; i++) {
    shortCut(i, 0).style.background = wallColor;
    shortCut(i, width - 1).style.background = wallColor;
    realField[i][0] = true;
    realField[i][width - 1] = true;
  }
  for (var i = 0; i < width; i++) {
    shortCut(0, i).style.background = wallColor;
    shortCut(height - 1, i).style.background = wallColor;
    realField[0][i] = true;
    realField[height - 1][i] = true;
  }
}

function shortCut(y, x) {
  let temp = document.getElementById(String(y) + " " + String(x));
  return temp;
}

//  generating a real field
function generateField() {
  //  making an a height length array
  realField = new Array(height);
  //    each element of the array is a width length array (which is a 2D array)
  for (let i = 0; i < height; i++) realField[i] = new Array(width);
  // every single array has false value to make sure that all the field are empty.
  for (let i = 0; i < height; i++)
    for (let j = 0; j < width; j++) realField[i][j] = false;
}

//  drawing a field visually
function drawField() {
  let fieldTag = '<table id="gameTable" border=0>';
  for (let i = 0; i < height; i++) {
    fieldTag += "<tr>";
    for (let j = 0; j < width; j++) {
      fieldTag += '<td id="' + String(i) + " " + String(j) + '"></td>';
    }
    fieldTag += "</tr>";
  }
  document.write(fieldTag);
}

document.onkeyup = keyUpEventHandler;
function keyUpEventHandler(e) {
  if (e.keyCode === KEY.DOWN) moveSlow();
}

document.onkeydown = keyDownEventHandler;
function keyDownEventHandler(e) {
  switch (e.keyCode) {
    case KEY.LEFT:
      setTimeout("moveLR(-1)", 100);
      break;
    case KEY.RIGHT:
      setTimeout("moveLR(1)", 100);
      break;
    case KEY.SPACE:
      setTimeout("goBottom()", 100);
      break;
    case KEY.UP:
      setTimeout("rotateTetromino()", 100);
      break;
    case KEY.DOWN:
      moveFast();
      break;
    case KEY.P:
      pause();
      break;
  }
}

function init() {
  drawField();
  generateField();
  setWall();
  nextColorIndex = -1;
  movingSpeed = initSpeed;
  tetrominoCell = [];
  tetrominoPoint = [1, 1];
  score = 0;
  level = 1;
  pickingNextTetromino();
  pickingNextColor();
  generateTetromino();
  canRotate();
}

init();
