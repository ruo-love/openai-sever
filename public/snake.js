var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var tileSize = 10;
var width = canvas.width / tileSize;
var height = canvas.height / tileSize;
var snake = [];
var direction = "right";
var food;
var score = 0;

function init() {
    console.log(13)
    createCanvas();
    createSnake();
    setInterval(move, 100);
}

function createCanvas() {
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function createSnake() {
    for (var i = 0; i < width; i++) {
        var row = [];
        for (var j = 0; j < tileSize; j++) {
            row.push(new Array(height).fill(0));
        }
        snake.push(row);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < snake.length; i++) {
        for (var j = 0; j < tileSize; j++) {
            var cell = snake[i][j];
            if (cell === 1) { // 食物格
                ctx.fillStyle = "green";
                ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
            } else {
                ctx.fillStyle = "black";
                ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
            }
        }
    }
}

function move() {
    var head = { x: snake[0].x, y: snake[0].y };
    switch (direction) {
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
        case "left":
            head.x--;
            break;
        case "right":
            head.x++;
            break;
    }
    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height || checkCollision(head, snake)) {
        return init();
    }
    var tail = { x: snake[snake.length - 1].x, y: snake[snake.length - 1].y };
    var nextDirection = getNextDirection(head, tail);
    if (nextDirection !== direction) {
        reverseSnake();
        direction = nextDirection;
    }
    snake.unshift(tail);
    draw();
}

function checkCollision(x, y) {
    for (var i = 0; i < snake.length; i++) {
        var collided = false;
        for (var j = 0; j < tileSize; j++) {
            if (snake[i][j] === 1 && x + j < 0 || snake[i][j] === 1 && x + j >= width || snake[i][j] === 0 && x + i < 0 || snake[i][j] === 0 && x + i >= width) {
                collided = true;
                break;
            }
        }
        if (collided) {
            return true;
        }
    }
    return false;
}

function reverseSnake() {
    for (var i = snake.length - 1; i > 0; i--) {
        var temp = snake[i];
        snake[i] = snake[i - 1];
        snake[i - 1] = temp;
    }
}

function getNextDirection(x, y) {
    var possibleDirections = [
        { x: x + 1, y: y },
        { x: x - 1, y: y },
        { x: x, y: y + 1 },
        { x: x, y: y - 1 }
    ];
    var randomIndex = Math.floor(Math.random() * possibleDirections.length);
    return possibleDirections[randomIndex].x;
}

init();