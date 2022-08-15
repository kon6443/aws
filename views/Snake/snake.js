const form = document.querySelector(".js-form");
const input = form.querySelector("input");
const greeting = document.querySelector(".js-greetings");

let y, x; // player
let cy, cx; // coin
let MY = 20,
  MX = 34; // field size
let score;
let keepMove;
let direction; // 0 1 2 3 상 하 좌 우
let speed;
let snakeQueue = new Array();
let snakeColor = "#A52A2A",
  tileColor = "#EEEEEE",
  wallColor = "#2E2E2E",
  coinColor = "#4476C6";

let givenName;

const SHOWING_CN = "showing";

/*
let rankObject = {
  score: 0,
  name: null,
};
*/
let rankObject = [];

function showName(text) {
  let lastNum = localStorage.getItem(rankObject).length - 1;
  document
    .getElementById("rank" + String(lastNum) + "2")
    .classList.add(SHOWING_CN);
  document.getElementById("rank" + String(lastNum) + "2").innerHTML = `${text}`;
}

function handleSubmit(event) {
  console.log("handlesubmit");
  event.preventDefault();
  const currentValue = input.value;
  showName(currentValue);
  saveName(currentValue);
  loadRank();
}

function getName(i) {
  document.getElementById("rank" + String(i) + "2").classList.add(SHOWING_CN);
  document
    .getElementById("rank" + String(i) + "2")
    .addEventListener("submit", handleSubmit);
}

function saveName(text) {
  if (localStorage.length == 0) return;
  else {
    let lastNum = localStorage.getItem(rankObject).length - 1;
    localStorage.setItem(rankObject[lastNum].name, text);
  }
}

function compareRank() {
  for (let i = 0; i < 10; i++) {
    if (document.getElementById("rank" + String(i) + "1").innerHTML == 0) {
      document.getElementById("rank" + String(i) + "1").innerHTML = score;
      localStorage.setItem("rankObject", rankObject[i].score);
      //event.preventDefault();
      return;
    }
    if (score >= document.getElementById("rank" + String(i) + "1").innerHTML) {
      temp = i;
      for (let j = i; j < 10 - temp; j++) {
        document.getElementById(
          "rank" + String(9 - j) + "1"
        ).innerHTML = document.getElementById(
          "rank" + String(8 - j) + "1"
        ).innerHTML;
      }
    }
  }
}

const OBJECT_LS = "rankObject";

function loadRank() {
  const loadedRankObjects = localStorage.getItem(OBJECT_LS);
  if (loadedRankObjects !== null) {
    for (let i = 0; i < localStorage.rankObject.length; i++) {
      const parsedRankObjects = JSON.parse(loadedRankObjects);
      //parsedRankObjects.forEach(function ())
      document.getElementById(
        "rank" + String(i) + "1"
      ).innerHTML = localStorage.getItem(rankObject[i].score);
      document.getElementById(
        "rank" + String(i) + "2"
      ).innerHTML = localStorage.getItem(rankObject[i].name);
    }
    //compareRank();
  }
}

function askForName() {
  //document.querySelector(".js-form").classList.add(SHOWING_CN);
  //document.querySelector(".js-form").addEventListener("submit", handleSubmit);
  form.classList.add(SHOWING_CN);
  form.addEventListener("submit", handleSubmit);
}

function saveObjectRank() {
  localStorage.setItem("rankObject", JSON.stringify(rankObject));
}

function saveNewRecord() {
  let lastNum = localStorage.length - 1;
  if (localStorage.length == 0) lastNum = 0;
  document.getElementById("rank" + String(lastNum) + "1").innerHTML = score;
  askForName();
  document.getElementById("rank" + String(lastNum) + "2").innerHTML = givenName;
  const object = {
    name: givenName,
    score: score,
  };
  rankObject.push(object);
  console.log(object);
  saveObjectRank();
}

function isNewRecord() {
  if (localStorage.length == 0) return true;
  else if (localStorage.length <= 10 && localStorage.length > 0) {
    let lastNum = localStorage.getItem(rankObject).length - 1;
    if (lastNum == -1) lastNum = 0;
    if (localStorage.getItem(rankObject[lastNum]) < score) {
      return true;
    }
  } else return false;
}

function gameOver() {
  console.log(localStorage.getItem(rankObject));
  alert("[Game Over]\nScore: " + score);
  if (isNewRecord()) saveNewRecord();
  init();
  location.reload();
}

function scoring() {
  document.getElementById("score").innerHTML = score;
}

function isCoin() {
  return y == cy && x == cx;
}

function setCoin() {
  do {
    let rand = Math.floor(Math.random() * ((MY - 2) * (MX - 2)));
    cy = Math.floor(rand / (MX - 2)) + 1;
    cx = (rand % (MX - 2)) + 1;
  } while (isInQueue(cy, cx));
  document.getElementById(
    String(cy) + " " + String(cx)
  ).style.background = coinColor;
  document.getElementById(String(cy) + " " + String(cx)).style.borderRadius =
    "6px";
}

function isInQueue(y, x) {
  let p = new Array(y, x);
  for (let i = 0; i < snakeQueue.length; i++)
    if (snakeQueue[i][0] === p[0] && snakeQueue[i][1] === p[1]) return true;
  return false;
}
//("");

function isCollapsed(y, x) {
  if (isInQueue(y, x)) return true;
  return false;
}

function isInvalidMove(y, x) {
  return y == 0 || y == MY - 1 || x == 0 || x == MX - 1 || isCollapsed(y, x);
}

function showPlus() {
  let plusedScore = 100 * (snakeQueue.length - 1);

  // showing + score
  document.getElementById("plus").innerHTML = "     +" + plusedScore;
  // remove the plused scored on the board
  setTimeout('document.getElementById("plus").innerHTML=""', 1000);
}

function meetCoin() {
  if (isCoin()) {
    score += 100 * (snakeQueue.length - 1);
    setCoin();
    showPlus();
    document.getElementById(String(y) + " " + String(x)).style.borderRadius =
      "3px";
  } else {
    removeSnake(y, x);
    score += snakeQueue.length;
  }
}

function move(direction) {
  switch (direction) {
    case 0:
      y -= 1;
      break;
    case 1:
      y += 1;
      break;
    case 2:
      x -= 1;
      break;
    case 3:
      x += 1;
      break;
    default:
      return;
  }
  if (isInvalidMove(y, x)) gameOver();
  setSnake(y, x);
  meetCoin();
  scoring();
}

function removeSnake() {
  let ty = snakeQueue[0][0];
  let tx = snakeQueue[0][1];
  snakeQueue.shift();
  document.getElementById(
    String(ty) + " " + String(tx)
  ).style.background = tileColor;
}

function setSnake(y, x) {
  snakeQueue.push(new Array(y, x));
  document.getElementById(
    String(y) + " " + String(x)
  ).style.background = snakeColor;
}

function drawWall() {
  let wallCell = new Array();
  for (let i = 0; i < MY; i++) wallCell.push(new Array(i, 0));
  for (let i = 0; i < MY; i++) wallCell.push(new Array(i, MX - 1));
  for (let i = 0; i < MX; i++) wallCell.push(new Array(0, i));
  for (let i = 0; i < MX; i++) wallCell.push(new Array(MY - 1, i));
  for (let i = 0; i < wallCell.length; i++) {
    let wy = wallCell[i][0];
    let wx = wallCell[i][1];
    document.getElementById(
      String(wy) + " " + String(wx)
    ).style.background = wallColor;
    document.getElementById(String(wy) + " " + String(wx)).style.borderRadius =
      "1.5px";
  }
}

function drawBoard() {
  let boardTag = "<table border=0>";
  for (let i = 0; i < MY; i++) {
    boardTag += "<tr>";
    for (let j = 0; j < MX; j++)
      boardTag += '<td id="' + String(i) + " " + String(j) + '"></td>';
    boardTag += "</tr>";
  }
  boardTag += "</table>";
  document.write(boardTag);
}

document.onkeydown = keyDownEventHandler;
function keyDownEventHandler(e) {
  if (e.keyCode == 38 && direction != 1) direction = 0;
  // up
  else if (e.keyCode == 40 && direction != 0) direction = 1;
  // down
  else if (e.keyCode == 37 && direction != 3) direction = 2;
  // left
  else if (e.keyCode == 39 && direction != 2) direction = 3; // right
}

function init() {
  drawBoard();
  drawWall();
  y = parseInt(MY / 2);
  x = parseInt(MX / 2);
  console.log("localStorage.length: ", localStorage.length);
  console.log("localStorage: ", localStorage);
  console.log(
    "localStorage.getItem(rankObject): ",
    localStorage.getItem(rankObject)
  );
  loadRank();
  setSnake(y, x);
  setCoin();
  score = 0;
  direction = -1;
  speed = 100;
  keepMove = setInterval("move(direction)", speed);
}

init();
