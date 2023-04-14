// creates a canvas element and sets the width and height
const canvas = document.querySelector('canvas');
canvas.width = 800;
canvas.height = 400;

// using the getContext() method to get the drawing context on the canvas
const content = canvas.getContext('2d');

// starting scores
let playerScore = 0;
let computerScore = 0;

// paddles width and height
const paddleWidth = 10;
const paddleHeight = 100;

// starting ball position
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let moveX;
let moveY;
const ballRadius = 7;

// position of the paddles
let playerPosition = canvas.height / 2;
let computerPosition = canvas.height / 2;

// finishing the game
const winningScore = 2;
let gameLoop;

let gameRunning = false;

// starting the game
content.fillStyle = '#253C78';
content.font = '20px Arial';
content.textAlign = 'center';
content.fillText('Press space to start the game', canvas.width / 2, canvas.height / 2);

function randomMovement() {
    moveX = Math.random() * 4 + 1;
    moveY = Math.random() * 4 + 1;

}

document.addEventListener('keydown', function handleKeyPressed(e) {
    switch (e.code) {
        case "Space": // space bar
            gameStart();
            break;
        case "ArrowUp": // up arrow
            if (playerPosition - paddleHeight / 2 <= 0) return;
            playerPosition -= 20;
            break;
        case "ArrowDown": // down arrow
            if (playerPosition + paddleHeight / 2 >= canvas.height) return;
            playerPosition += 20;
            break;
    }
});

// starting the game
function gameStart() {
    if (gameRunning) return;
    gameRunning = true;
    // starting the ball movement
    randomMovement();
    ballX = canvas.width / 2;
    playerScore = 0;
    computerScore = 0;
    clearInterval(gameLoop)
    gameLoop = setInterval(loop, 1000 / 60);
}

// creating the player paddle
function drawPlayerPaddle() {
    // fillRect(place x, place y, width, height)
    content.fillStyle = '#D36582'; // changes the color of the paddle
    content.fillRect( // creates the rectangle
        0, // x position
        playerPosition - paddleHeight / 2, // y position
        paddleWidth, // width
        paddleHeight // height  
    );
}

// creating the computer paddle
function drawComputerPaddle() {
    content.fillStyle = '#2B59C3';
    content.fillRect(
        canvas.width - paddleWidth,
        computerPosition - paddleHeight / 2,
        paddleWidth,
        paddleHeight
    );
}

// creating the ball
function drawBall() {
    content.beginPath(); // starts a new path
    content.fillStyle = '#253C78';
    // arc(x, y, radius, startAngle, endAngle, anticlockwise)
    content.arc(
        ballX, // x position
        ballY, // y position
        ballRadius, // radius
        0, // start angle (we started at zero to make a full turn and create a circle)
        Math.PI * 2, // end angle (we multiplied by 2 to make a full turn and create a circle -> have to be in radians)
        false // anticlockwise (false to make a full turn and create a circle)
    ); 
    content.fill(); // fills the circle
    // moves the ball
    ballX += moveX;
    ballY += moveY;
}

// writing the scores 
function addScores() {
    content.fillStyle = '#C9A690';
    content.font = '20px Arial';
    content.fillText( // fillText(text, x, y)
        playerScore, // text
        canvas.width / 4, // x position
        canvas.height / 10 // y position
    );
    content.fillStyle = '#C9A690';
    content.font = '20px Arial';
    content.fillText(
        computerScore, 
        canvas.width * 0.75, 
        canvas.height / 10
    );
}

function score(player) {
    if (player === 'player') {
        playerScore++;
    } else if (player === 'computer') {
        computerScore++;
    }
    if (computerScore === winningScore) {
        endGame('computer')
    } else if (playerScore === winningScore) {
        endGame('player')
    }
    // reset the ball position
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    // reverse the direction of the ball
    moveX = -moveX;
}

function endGame(winner) {
    gameRunning = false;
    clearInterval(gameLoop)
    content.clearRect(0, 0, canvas.width, canvas.height)
    addScores();
    if (winner === 'player') {
        content.fillStyle = '#D36582';

    } else if (winner === 'computer') {
        content.fillStyle = '#2B59C3';
    }
    content.textAlign = 'center';
    content.font = '30px Arial';
    content.fillText(`${winner} wins!`, canvas.width / 2, canvas.height / 2);
    content.fillStyle = '#253C78';
    content.font = '20px Arial';
    content.textAlign = 'center';
    content.fillText('Press space to start the game', canvas.width / 2, canvas.height / 2 + 30); 
}

// creating the dashed line
function drawCourt() {
    content.beginPath(); // starts a new path
    content.strokeStyle = '#C9A690'; // changes the color of the line
    content.setLineDash([10]); // sets the line dash (10 pixels on, 10 pixels off)
    content.moveTo(canvas.width / 2, 0); // moves the pen to the x and y coordinates
    content.lineTo(canvas.width / 2, canvas.height); // draws a line to the x and y coordinates
    content.stroke(); // draws the line

    // creating the circle in the court
    content.beginPath();
    content.strokeStyle = '#C9A690';
    content.arc(canvas.width / 2, canvas.height / 2, 60, 0, Math.PI * 2, false);
    content.setLineDash([10]);
    content.stroke();
};

// function for collision detection
function collide() {
    // if the ball hits the top or bottom of the canvas
    // if the y direction of the ball is greater than the height of the canvas minus the radius of the ball
    // or if the y direction of the ball minus the radius of the ball is less than 0
    if (ballY  > canvas.height -ballRadius|| ballY - ballRadius <= 0) { 
        moveY = -moveY; // reverse the direction of the ball
    }
    // check for score when the ball hits the left or right of the canvas
    if (ballX + ballRadius >= canvas.width) {
        // if the ball hits the right side of the canvas
        score('player')
    } else if (ballX <= ballRadius) {
        // if the ball hits the left side of the canvas
        score('computer')
    }
    // check for collision with the player paddle
    if (ballX <= ballRadius + paddleWidth &&
        Math.abs(ballY - playerPosition) < paddleHeight / 2 + ballRadius) {
        // reverse the direction of the ball
        moveX = -moveX + generateRandomBounce();
    }
    // check for collision with the computer paddle
    if (ballX + ballRadius >= canvas.width - paddleWidth &&
        Math.abs(ballY - computerPosition) <= paddleHeight / 2 + ballRadius) {
        // reverse the direction of the ball
        moveX = -moveX + generateRandomBounce();
    }   
}

// function for the computer paddle
function moveComputer() {
    // if the computer paddle is higher than the ball
    if (computerPosition > ballY) {
        computerPosition--;
    } else if (computerPosition < ballY) {
        computerPosition++;
    }
}

function generateRandomBounce() {
    const number = Math.floor(Math.random() * 2);
    const positiveOrNegative = number === 0 ? "-" : "+";
    return Number(positiveOrNegative + Math.random() / 2);
}

function loop() {
    content.clearRect(0, 0, canvas.width, canvas.height); // clears the canvas
    drawPlayerPaddle();
    drawComputerPaddle();
    addScores();
    drawBall();
    drawCourt();
    collide();
    moveComputer();
}
