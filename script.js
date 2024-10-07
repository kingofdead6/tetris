const board = document.querySelector('#game-board');
const scoreDisplay = document.querySelector('#score');
const width = 10; 
let currentPosition = 4; 
let timerId;
let score = 0;

const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
];

const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
];

const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
];

const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
];

const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
];

const tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

let currentRotation = 0; 
let random = Math.floor(Math.random() * tetrominoes.length); 
let currentTetromino = tetrominoes[random][currentRotation]; 

for (let i = 0; i < 200; i++) {
    const square = document.createElement('div');
    board.appendChild(square);
}

for (let i = 0; i < 10; i++) {
    const square = document.createElement('div');
    square.classList.add('taken');
    board.appendChild(square);
}

function draw() {
    currentTetromino.forEach(index => {
        board.children[currentPosition + index].classList.add('tetromino');
    });
}

function undraw() {
    currentTetromino.forEach(index => {
        board.children[currentPosition + index].classList.remove('tetromino');
    });
}
function rotate() {
    undraw();
    const nextRotation = (currentRotation + 1) % tetrominoes[random].length; 
    const nextTetromino = tetrominoes[random][nextRotation];

    if (validRotate(nextTetromino)) {
        currentRotation = nextRotation; 
        currentTetromino = nextTetromino; 
    }
    draw();
}

function validRotate(newRotation) {
    return newRotation.every(index => {
        return (
            board.children[currentPosition + index] && 
            !board.children[currentPosition + index].classList.contains('taken') &&
            (currentPosition % width + index % width < width) 
        );
    });
}
function moveLeft() {
    undraw();
    const isAtLeftEdge = currentTetromino.some(index => (currentPosition + index) % width === 0);
    if (!isAtLeftEdge) currentPosition -= 1;
    if (currentTetromino.some(index => board.children[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1;
    }
    draw();
}

function moveRight() {
    undraw();
    const isAtRightEdge = currentTetromino.some(index => (currentPosition + index) % width === width - 1);
    if (!isAtRightEdge) currentPosition += 1;
    if (currentTetromino.some(index => board.children[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1;
    }
    draw();
}
function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
}

function freeze() {
    if (currentTetromino.some(index => board.children[currentPosition + index + width].classList.contains('taken'))) {
        currentTetromino.forEach(index => board.children[currentPosition + index].classList.add('taken'));

        random = Math.floor(Math.random() * tetrominoes.length); 
        currentRotation = 0; 
        currentTetromino = tetrominoes[random][currentRotation]; 
        currentPosition = 4;
        draw();
        addScore();
        gameOver();
    }
}

function addScore() {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
        
        if (row.every(index => board.children[index].classList.contains('taken'))) {
            score += 10; 
            scoreDisplay.textContent = score;

            row.forEach(index => {
                board.children[index].classList.remove('taken', 'tetromino');
            });

            for (let j = i - 1; j >= 0; j--) {
                if (board.children[j].classList.contains('taken')) {
                    board.children[j].classList.remove('taken', 'tetromino');
                    board.children[j + width].classList.add('taken', 'tetromino');
                }
            }
        }
    }
}

function gameOver() {
    if (currentTetromino.some(index => board.children[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.textContent = 'Game Over';
        clearInterval(timerId);
    }
}

document.addEventListener('keydown', control);

function control(e) {
    if (e.keyCode === 37) moveLeft();
    if (e.keyCode === 16) rotate();
    if (e.keyCode === 39) moveRight();
    if (e.keyCode === 40) moveDown();
}

timerId = setInterval(moveDown, 1000); 

draw();