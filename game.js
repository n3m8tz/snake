const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');
const player1NameInput = document.getElementById('player1Name');
const player2NameInput = document.getElementById('player2Name');
const gameOverMessage = document.getElementById('gameOverMessage');
const box = 32;
let snake1, snake2;
let foods;
let score1, score2;
let collectedFood1, collectedFood2;
let d1, d2;
let game;
let speed = 100; // Initial speed
let blueAreas = [];
let sandDunes = [];
let goals = [
    { x: 5 * box, y: 5 * box },
    { x: 35 * box, y: 35 * box }
];

document.addEventListener('keydown', direction);
restartButton.addEventListener('click', () => init(canvas, ctx, player1NameInput, player2NameInput));

init(canvas, ctx, player1NameInput, player2NameInput);
displayTopScores(ctx);

function init(canvas, ctx, player1NameInput, player2NameInput) {
    blueAreas = [];
    sandDunes = [];
    gameOverMessage.style.display = 'none'; // Hide the game over message when initializing
    // Add 5 random blue areas
    for (let i = 0; i < 5; i++) {
        let width, height, x, y;
        do {
            width = Math.floor(Math.random() * 3 + 5) * box; // Random width between 5 and 15 boxes
            height = Math.floor(Math.random() * 4 + 3) * box; // Random height between 5 and 15 boxes
            x = Math.floor(Math.random() * (canvas.width / box - width / box)) * box;
            y = Math.floor(Math.random() * (canvas.height / box - height / box)) * box;
        } while (isOverlapping(x, y, width, height, sandDunes)); // Ensure no overlap with sand dunes
        blueAreas.push({ x: x, y: y, width: width, height: height });
    }

    // Add 5 random sand dunes
    for (let i = 0; i < 5; i++) {
        let width, height, x, y;
        do {
            width = Math.floor(Math.random() * 3 + 5) * box; // Random width between 5 and 15 boxes
            height = Math.floor(Math.random() * 4 + 3) * box; // Random height between 5 and 15 boxes
            x = Math.floor(Math.random() * (canvas.width / box - width / box)) * box;
            y = Math.floor(Math.random() * (canvas.height / box - height / box)) * box;
        } while (isOverlapping(x, y, width, height, blueAreas)); // Ensure no overlap with blue areas
        sandDunes.push({ x: x, y: y, width: width, height: height });
    }

    snake1 = [{ x: 19 * box, y: 20 * box }];
    snake2 = [{ x: 21 * box, y: 20 * box }];

    foods = [
        {
            x: Math.floor(Math.random() * 39 + 1) * box,
            y: Math.floor(Math.random() * 39 + 1) * box
        },
        {
            x: Math.floor(Math.random() * 39 + 1) * box,
            y: Math.floor(Math.random() * 39 + 1) * box
        }
    ];

    score1 = 0;
    score2 = 0;
    collectedFood1 = 0;
    collectedFood2 = 0;
    d1 = null;
    d2 = null;

    if (game) clearInterval(game);
    game = setInterval(() => draw(canvas, ctx, player1NameInput, player2NameInput), speed);
}

function draw(canvas, ctx, player1NameInput, player2NameInput) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw blue areas
    for (let i = 0; i < blueAreas.length; i++) {
        let area = blueAreas[i];
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(area.x, area.y, area.width, area.height);
    }

    // Draw sand dunes
    for (let i = 0; i < sandDunes.length; i++) {
        let dune = sandDunes[i];
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(dune.x, dune.y, dune.width, dune.height);
    }

    // Draw goals
    for (let i = 0; i < goals.length; i++) {
        ctx.fillStyle = '#800080';
        ctx.fillRect(goals[i].x, goals[i].y, box, box);
    }

    for (let i = 0; i < snake1.length; i++) {
        ctx.fillStyle = (i == 0) ? '#FFA500' : '#FFFFFF'; // Changed to yellow
        ctx.fillRect(snake1[i].x, snake1[i].y, box, box);

        ctx.strokeStyle = '#000';
        ctx.strokeRect(snake1[i].x, snake1[i].y, box, box);
    }

    for (let i = 0; i < snake2.length; i++) {
        ctx.fillStyle = (i == 0) ? '#00FF00' : '#FFFFFF';
        ctx.fillRect(snake2[i].x, snake2[i].y, box, box);

        ctx.strokeStyle = '#000';
        ctx.strokeRect(snake2[i].x, snake2[i].y, box, box);
    }

    for (let i = 0; i < foods.length; i++) {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(foods[i].x, foods[i].y, box, box);
    }

    let snake1X = snake1[0].x;
    let snake1Y = snake1[0].y;
    let snake2X = snake2[0].x;
    let snake2Y = snake2[0].y;

    if (d1 == 'LEFT') snake1X -= box;
    if (d1 == 'UP') snake1Y -= box;
    if (d1 == 'RIGHT') snake1X += box;
    if (d1 == 'DOWN') snake1Y += box;

    if (d2 == 'LEFT') snake2X -= box;
    if (d2 == 'UP') snake2Y -= box;
    if (d2 == 'RIGHT') snake2X += box;
    if (d2 == 'DOWN') snake2Y += box;

    let ateFood1 = false;
    let ateFood2 = false;

    for (let i = 0; i < foods.length; i++) {
        if (snake1X == foods[i].x && snake1Y == foods[i].y) {
            collectedFood1++;
            foods[i] = {
                x: Math.floor(Math.random() * 39 + 1) * box,
                y: Math.floor(Math.random() * 39 + 1) * box
            };
            ateFood1 = true;
        }

        if (snake2X == foods[i].x && snake2Y == foods[i].y) {
            collectedFood2++;
            foods[i] = {
                x: Math.floor(Math.random() * 39 + 1) * box,
                y: Math.floor(Math.random() * 39 + 1) * box
            };
            ateFood2 = true;
        }
    }

    if (!ateFood1) {
        snake1.pop();
    }
    
    if (!ateFood2) {
        snake2.pop();
    }

    let newHead1 = { x: snake1X, y: snake1Y };
    let newHead2 = { x: snake2X, y: snake2Y };
    let player1Lost = snake1X < 0 || snake1Y < 0 || snake1X >= canvas.width || snake1Y >= canvas.height || collision(newHead1, snake1) || collision(newHead1, snake2);
    let player2Lost = snake2X < 0 || snake2Y < 0 || snake2X >= canvas.width || snake2Y >= canvas.height || collision(newHead2, snake2) || collision(newHead2, snake1);
    
    if (player1Lost || player2Lost) {
        clearInterval(game);
        if (player1Lost && player2Lost) {
            gameOverMessage.textContent = 'Game Over! Both players lost.';
        } else if (player1Lost) {
            gameOverMessage.textContent = `${player1NameInput.value || "Player 1"} lost!`;
            saveTopScore(player1NameInput.value, score1);
        } else if (player2Lost) {
            gameOverMessage.textContent = `${player2NameInput.value || "Player 2"} lost!`;
            saveTopScore(player2NameInput.value, score2);
        }
        gameOverMessage.style.display = 'block'; // Show the game over message
        return;
    }

    // Check if snake1 reaches a goal
    if (isInGoal(snake1X, snake1Y)) {
        score1 += collectedFood1;
        collectedFood1 = 0;
        snake1 = [{ x: 19 * box, y: 20 * box }];
        d1 = null;
    } else {
        snake1.unshift(newHead1);
    }

    // Check if snake2 reaches a goal
    if (isInGoal(snake2X, snake2Y)) {
        score2 += collectedFood2;
        collectedFood2 = 0;
        snake2 = [{ x: 21 * box, y: 20 * box }];
        d2 = null;
    } else {
        snake2.unshift(newHead2);
    }

    ctx.fillStyle = '#FFF';
    ctx.font = '20px Changa one';
    const player1Name = player1NameInput?.value.trim() || "Player 1";
    const player2Name = player2NameInput?.value.trim() || "Player 2";
    ctx.fillText(player1Name + ": " + score1, 2 * box, 1.6 * box);
    ctx.fillStyle = '#orange';
    ctx.fillText(player2Name + ": " + score2, 2 * box, 3.6 * box);
    ctx.fillStyle = '#00FF00';

    // Adjust speed if snake is in blue area or sand dune
    if (isInBlueArea(snake1[0].x, snake1[0].y, blueAreas) || isInBlueArea(snake2[0].x, snake2[0].y, blueAreas)) {
        clearInterval(game);
        game = setInterval(() => draw(canvas, ctx, player1NameInput, player2NameInput), speed * 2); // Reduce speed by 50%
    } else if (isInSandDune(snake1[0].x, snake1[0].y, sandDunes) || isInSandDune(snake2[0].x, snake2[0].y, sandDunes)) {
        clearInterval(game);
        game = setInterval(() => draw(canvas, ctx, player1NameInput, player2NameInput), speed / 2); // Increase speed by 100%
    } else {
        clearInterval(game);
        game = setInterval(() => draw(canvas, ctx, player1NameInput, player2NameInput), speed);
    }
}

function direction(event) {
    // Player 1 controls (WASD)
    if (event.keyCode == 65 && d1 != 'RIGHT') {
        d1 = 'LEFT';
    } else if (event.keyCode == 87 && d1 != 'DOWN') {
        d1 = 'UP';
    } else if (event.keyCode == 68 && d1 != 'LEFT') {
        d1 = 'RIGHT';
    } else if (event.keyCode == 83 && d1 != 'UP') {
        d1 = 'DOWN';
    }

    // Player 2 controls (Arrow keys)
    if (event.keyCode == 37 && d2 != 'RIGHT') {
        d2 = 'LEFT';
    } else if (event.keyCode == 38 && d2 != 'DOWN') {
        d2 = 'UP';
    } else if (event.keyCode == 39 && d2 != 'LEFT') {
        d2 = 'RIGHT';
    } else if (event.keyCode == 40 && d2 != 'UP') {
        d2 = 'DOWN';
    }
}

function saveTopScore(playerName, score) {
    let topScores = JSON.parse(localStorage.getItem('topScores')) || [];
    topScores.push({ playerName, score });
    topScores.sort((a, b) => b.score - a.score);
    if (topScores.length > 10) topScores.pop(); // Keep only top 10 scores
    localStorage.setItem('topScores', JSON.stringify(topScores));
}

function displayTopScores(ctx) {
    let topScores = JSON.parse(localStorage.getItem('topScores')) || [];
    topScores.forEach((score, index) => {
        ctx.fillText(`${index + 1}. ${score.playerName}: ${score.score}`, 2 * box, (5 + index) * box);
    });
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function isInBlueArea(x, y, blueAreas) {
    for (let i = 0; i < blueAreas.length; i++) {
        let area = blueAreas[i];
        if (x >= area.x && x < area.x + area.width && y >= area.y && y < area.y + area.height) {
            return true;
        }
    }
    return false;
}

function isInSandDune(x, y, sandDunes) {
    for (let i = 0; i < sandDunes.length; i++) {
        let dune = sandDunes[i];
        if (x >= dune.x && x < dune.x + dune.width && y >= dune.y && y < dune.y + dune.height) {
            return true;
        }
    }
    return false;
}

function isOverlapping(x, y, width, height, areas) {
    for (let i = 0; i < areas.length; i++) {
        let area = areas[i];
        if (x < area.x + area.width && x + width > area.x && y < area.y + area.height && y + height > area.y) {
            return true;
        }
    }
    return false;
}

function isInGoal(x, y) {
    for (let i = 0; i < goals.length; i++) {
        if (x == goals[i].x && y == goals[i].y) {
            return true;
        }
    }
    return false;
}
