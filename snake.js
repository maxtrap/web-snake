const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;


let canvas, context;


let leftKeyDown = false;
let upKeyDown = false;
let rightKeyDown = false;
let downKeyDown = false;



const LEFT = 1;
const UP = 2;
const RIGHT = 3;
const DOWN = 4;

let suggestedDirection = null;
let direction = RIGHT;

let snake;



let score = 0;
let apple;

let gameLost = false;

let mainLoop;



const GAME_WIDTH = 25;
const GAME_HEIGHT = 15;

const TILE_SIZE = 40;



const gameboard = new Array(GAME_HEIGHT);


document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('game-canvas');
    context = canvas.getContext('2d');

    document.addEventListener('keydown', keyPressed);
    document.addEventListener('keyup', keyReleased);

    initializeGame();

    gameLoop();
    mainLoop = setInterval(gameLoop, 1000/10);
});



//Event Handling

function keyPressed(evt) {
    switch (evt.keyCode) {
        case LEFT_KEY:
            if (!leftKeyDown) {
                leftKeyDown = true;
                suggestedDirection = LEFT;
            }
            break;
        case UP_KEY:
            if (!upKeyDown) {
                upKeyDown = true;
                suggestedDirection = UP;
            }
            break;
        case RIGHT_KEY:
            if (!rightKeyDown) {
                rightKeyDown = true;
                suggestedDirection = RIGHT;
            }
            break;
        case DOWN_KEY:
            if (!downKeyDown) {
                downKeyDown = true;
                suggestedDirection = DOWN;
            }
            break;
        default:
            break;
    }
}

function keyReleased(evt) {
    switch (evt.keyCode) {
        case LEFT_KEY:
            leftKeyDown = false;
            break;
        case UP_KEY:
            upKeyDown = false;
            break;
        case RIGHT_KEY:
            rightKeyDown = false;
            break;
        case DOWN_KEY:
            downKeyDown = false;
            break;
        default:
            break;
    }
}











//Game Logic


class SnakeTile {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }
}

function initializeGame() {
    for (let i = 0; i < GAME_HEIGHT; i++) {
        gameboard[i] = new Array(GAME_WIDTH);
        gameboard[i].fill(0);
    }

    snake = new LinkedList();
    for (let i = 0; i < 5; i++) {
        snake.insert(new SnakeTile(10, 10));
    }

    generateApple();
    
}

function generateApple() {
    do {
        apple = {
            x: Math.floor(Math.random() * GAME_WIDTH),
            y: Math.floor(Math.random() * GAME_HEIGHT),
        }
    } while (gameboard[apple.y][apple.x] === 1);
    gameboard[apple.y][apple.x] = 2;
}

function moveSnake() {
    checkDirectionSwitch();

    let snakeHead = snake.insert(getNextSnakeStep(snake.tail.value));
    /* The line above is very confusing. The reason that im getting the tail and not the head is because
    in the linkedlist implementation that I'm using, it is convenient to have the tail of the list act as the head of the snake
    and the head of the list to act as the tail */


    if (checkGameLose(snakeHead)) {
        loseGame();
        return;
    }

    let appleEaten;
    if (appleEaten = gameboard[snakeHead.y][snakeHead.x] === 2) {
        console.log('wowza');
        score++;
        generateApple();
    }

    gameboard[snakeHead.y][snakeHead.x] = 1;
    

    if (!appleEaten) {
        let snakeTail = snake.removeHead(); //removes the tail of the snake and stores the tile object into a variable
        gameboard[snakeTail.y][snakeTail.x] = 0; //removes the tail from the gameboard
    }

}

function checkDirectionSwitch() {
    if (suggestedDirection) {
        switch (suggestedDirection) {
            case LEFT:
                if (direction !== RIGHT) {
                    direction = LEFT;
                }
                break;
            case UP:
                if (direction !== DOWN) {
                    direction = UP;
                }
                break;
            case RIGHT:
                if (direction !== LEFT) {
                    direction = RIGHT;
                }
                break;
            case DOWN:
                if (direction !== UP) {
                    direction = DOWN;
                }
                break;
            default:
                console.log('Failed to validate suggested direction');
                break;
        }
        suggestedDirection = null;
    }
}

function getNextSnakeStep(snakeHead) {
    let nextX = snakeHead.x;
    let nextY = snakeHead.y;
    switch (direction) {
        case LEFT:
            nextX--;
            break;
        case UP:
            nextY--;
            break;
        case RIGHT:
            nextX++;
            break;
        case DOWN:
            nextY++;
            break;
        default:
            console.log('Failed to identify snake direction');
            break;
    }
    return new SnakeTile(nextX, nextY);
}

function checkGameLose(snakeHead) {
    snakeX = snakeHead.x;
    snakeY = snakeHead.y;
    return snakeX < 0 || snakeY < 0 || snakeX >= GAME_WIDTH || snakeY >= GAME_HEIGHT || gameboard[snakeY][snakeX] === 1;
}

function loseGame() {
    clearInterval(mainLoop);
    gameLost = true;
}




//Main Loop

function gameLoop() {

    //Do game logic
    moveSnake();



    //Draw
    if (gameLost) {
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = "bold 80px Arial";
        context.fillStyle = 'white';
        context.fillText('Your Score: ' + score, canvas.width/2 - 250, canvas.height/2 + 30);
        return;
    }


    context.fillStyle = '#333333';
    context.fillRect(0, 0, canvas.width, 100);
    context.font = "bold 40px Arial";
    context.fillStyle = 'white';
    context.fillText(score, 30, 65);

    
    
    
    context.translate(0, 100);

    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < GAME_HEIGHT; row++) {
        for (let col = 0; col < GAME_WIDTH; col++) {
            if (gameboard[row][col]) {
                context.fillStyle = gameboard[row][col] === 2 ? '#FF0000' : '#00FF00';
                context.fillRect(col * TILE_SIZE + 1, row * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
            }
        }
    }
    context.translate(0, -100);
}