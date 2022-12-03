const myGame = {
  canvas: document.getElementById("canvas"),
  frames: 0,
  start: function () {
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight / 2;

function start_timer() {
  let timer = document.getElementById("my_timer").innerHTML;
  let arr = timer.split(":");
  let min = arr[0];
  let sec = arr[1];

  if (sec == 59) {
    min++;
    sec = 0; 
    if (min < 10) {
      min = "0" + min;
    }
  } else {
    sec++;
  }
  if (sec < 10) sec = "0" + sec;

  document.getElementById("my_timer").innerHTML = min + ":" + sec;

  const timeout = setTimeout(start_timer, 1000);
  if (player.x + player.width < 0) {
    clearTimeout(timeout);
  }
}

let scoresArray = [0];
let spongebobAudio = new Audio("/audio/spongaudio.wav");
let crowdaww = new Audio("/audio/crowdaw.mp3");
let crowdcheer = new Audio("/audio/applause.mp3");

function formatStopclock(num) {
  let _min = Math.floor(num / 60);
  let _sec = num % 60;
  if (_min < 10) _min = "0" + _min;
  if (_sec < 10) _sec = "0" + _sec;
  return `${_min}:${_sec}`;
}

window.onload = function () {
  spongebobAudio.play();
  if (typeof sessionStorage.scores !== "undefined")
    scoresArray = JSON.parse(sessionStorage.scores);
  let highestScore = scoresArray.reduce((a, b) => Math.max(a, b));
  // console.log(highestScore)
  // console.log(formatStopclock(highestScore))
  // console.log(highscoresArray)
  document.getElementById("highscore").innerHTML =
    formatStopclock(highestScore);
  myGame.start();
  start_timer();
};

class Component {
  constructor(width, height, color, x, y, radius) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speedX = 0;
    this.speedY = 0;
  }

  update() {
    const ctx = myGame.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  generateImage() {
    const spongebob = document.getElementById("spongebob");
    const ctx = myGame.context;
    ctx.drawImage(spongebob, this.x, this.y, this.width, this.height);
  }
  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (
      this.x + this.width + this.speedX > canvas.width ||
      this.x + this.speedX < 0
    ) {
      this.speedX *= -0.5;
    }
    if (
      this.y + this.height + this.speedY > canvas.height ||
      this.y + this.speedY < 0
    ) {
      this.speedY *= -0.5;
    }
  }
}

const background = new Component(canvas.width, canvas.height, "#ADD8E6", 0, 0);

const player = new Component(30, 30, "yellow", 50, 110);

document.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 38:
      player.speedY -= 1;
      break;
    case 40:
      player.speedY += 1;
      break;
    case 37:
      player.speedX -= 1;
      break;
    case 39:
      player.speedX += 1;
      break;
  }
});

const topObstacles = [];
const bottomObstacles = [];
const myRedObstacles = [];
const myGreenObstacles = [];

function updateObstacles() {
  myGame.frames += 1;
  if (myGame.frames % 120 === 0) {
    let x = myGame.canvas.width;
    let minHeight = 20;
    let maxHeight = 200;
    let height = Math.floor(
      Math.random() * (maxHeight - minHeight + 1) + minHeight
    );
    let minGap = 50;
    let maxGap = 200;
    let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    topObstacles.push(new Component(15, height, "orangered", x, 0));
    bottomObstacles.push(
      new Component(15, x - height - gap, "orangered", x, height + gap)
    );
  }

  for (let i = 0; i < topObstacles.length; i++) {
    if (formatNumber(document.getElementById("my_timer").innerHTML) > 15) {
      topObstacles[i].x += -4.5;
      topObstacles[i].update();
    } else if (
      formatNumber(document.getElementById("my_timer").innerHTML) > 22
    ) {
      topObstacles[i].x += -6;
      topObstacles[i].update();
    } else if (
      formatNumber(document.getElementById("my_timer").innerHTML) > 42
    ) {
      topObstacles[i].x += -8.5;
      topObstacles[i].update();
    } else {
      topObstacles[i].x += -2.5;
      topObstacles[i].update();
    }
  }
  for (let i = 0; i < bottomObstacles.length; i++) {
    if (formatNumber(document.getElementById("my_timer").innerHTML) > 22) {
      bottomObstacles[i].x += -6;
      bottomObstacles[i].update();
    } else if (
      formatNumber(document.getElementById("my_timer").innerHTML) > 35
    ) {
      bottomObstacles[i].x += -7.5;
      bottomObstacles[i].update();
    } else if (
      formatNumber(document.getElementById("my_timer").innerHTML) > 42
    ) {
      topObstacles[i].x += -8.5;
      topObstacles[i].update();
    } else {
      bottomObstacles[i].x += -2.5;
      bottomObstacles[i].update();
    }
  }
}

function checkCollision() {
  topObstacles.some((obstacle) => {
    let playerLeft = player.x;
    let playerRight = player.x + player.width;
    let playerTop = player.y;
    let playerBottom = player.y + player.height;
    let obstacleLeft = obstacle.x;
    let obstacleRight = obstacle.x + obstacle.width;
    let obstacleTop = obstacle.y;
    let obstacleBottom = obstacle.y + obstacle.height;
    if (
      !(
        playerBottom < obstacleTop ||
        playerTop > obstacleBottom ||
        playerRight < obstacleLeft ||
        playerLeft > obstacleRight
      )
    ) {
      player.x = obstacle.x - player.width;
      player.generateImage();
    }
  });
  bottomObstacles.some((obstacle) => {
    let playerLeft = player.x;
    let playerRight = player.x + player.width;
    let playerTop = player.y;
    let playerBottom = player.y + player.height;
    let obstacleLeft = obstacle.x;
    let obstacleRight = obstacle.x + obstacle.width;
    let obstacleTop = obstacle.y;
    let obstacleBottom = obstacle.y + obstacle.height;
    if (
      !(
        playerBottom < obstacleTop ||
        playerTop > obstacleBottom ||
        playerRight < obstacleLeft ||
        playerLeft > obstacleRight
      )
    ) {
      player.x = obstacle.x - player.width;
      player.generateImage();
    }
  });
}

function formatNumber(str) {
  arr = str.split(":");
  arr[0] = +arr[0];
  arr[1] = +arr[1];
  const result = arr[0] * 60 + arr[1];
  return result;
}

function gameOver() {
  if (player.x + player.width < 0) {
    clearInterval(myGame.interval);
    spongebobAudio.pause();

    document.getElementById("playagain").style.visibility = "visible";
    document.getElementById("yourscoreheading").style.visibility = "visible";

    let currentTime = document.getElementById("my_timer").innerHTML;
    currentTime = formatStopclock(formatNumber(currentTime) - 1);

    if (
      formatNumber(document.getElementById("my_timer").innerHTML) >=
      formatNumber(document.getElementById("highscore").innerHTML)
    ) {
      document.getElementById("highscore").innerHTML =
        document.getElementById("my_timer").innerHTML;
      crowdcheer.play();
    } else {
      crowdaww.play();
    }
    let score = document.getElementById("my_timer").innerHTML;
    let scoreInSeconds = formatNumber(score);
    console.log(score);
    scoresArray.push(scoreInSeconds);
    console.log(scoresArray);
    sessionStorage.setItem("scores", JSON.stringify(scoresArray));
  }
}

function updateGameArea() {
  myGame.clear();
  background.update();
  player.newPos();
  player.generateImage();
  updateObstacles();
  checkCollision();
  gameOver();
}

document.addEventListener("keyup", (e) => {
  player.speedX = 0;
  player.speedY = 0;
});

onresize = () => {
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;
};
