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

const background = new Component(
  canvas.width,
  canvas.height,
  "lightblue",
  0,
  0
);

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

console.log(canvas.height);

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
    myGreenObstacles.push(new Component(15, height, "limegreen", x, 0));
    myRedObstacles.push(
      new Component(15, x - height - gap, "orangered", x, height + gap)
    );
  }
 
  for (let i = 0; i < myGreenObstacles.length; i++) {
    myGreenObstacles[i].x += -1;
    myGreenObstacles[i].update();
  }
  for (let i = 0; i < myRedObstacles.length; i++) {
    myRedObstacles[i].x += -1;
    myRedObstacles[i].update();
  }
    }

    
    function checkCollision() {
      myGreenObstacles.some((obstacle) => {
        let playerLeft = player.x;
        let playerRight = player.x + player.width;
        let playerTop = player.y;
        let playerBottom = player.y + player.height;
        let obstacleLeft = obstacle.x;
        let obstacleRight = obstacle.x + obstacle.width;
        let obstacleTop = obstacle.y;
        let obstacleBottom = obstacle.y + obstacle.height;
        if (!(playerBottom < obstacleTop || playerTop > obstacleBottom || playerRight < obstacleLeft || playerLeft > obstacleRight)) {
          player.x = obstacle.x - (2 * obstacle.width);
          player.update()
        }
      })
    }





function updateGameArea() {
  myGame.clear();
  background.update();
  player.newPos();
  player.update();
  updateObstacles();
  checkCollision();
}

document.addEventListener("keyup", (e) => {
  player.speedX = 0;
  player.speedY = 0;
});

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
  setTimeout(start_timer, 1000);
}

onresize = () => {
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;
};

window.onload = function () {
  myGame.start();
  start_timer();
};