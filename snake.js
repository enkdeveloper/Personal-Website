document.addEventListener("DOMContentLoaded", function () {
    const boardSize = 25;
    const gameBoard = document.getElementById("game-board");
    const gameTitle = document.getElementById("game-title");
    const startButton = document.getElementById("start-button");
    const scoreElement = document.getElementById("score");
    const gameOverContainer = document.querySelector(".game-over-container");

    let snake = [];
    let direction = "RIGHT";
    let food = generateFood();
    let score = 0;
    let isGameOver = true;
    let gameInterval;

    function generateFood() {
        const x = Math.floor(Math.random() * boardSize);
        const y = Math.floor(Math.random() * boardSize);
        return { x, y, color: getRandomColor() };
    }

    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function drawBoard() {
        gameBoard.innerHTML = "";
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                gameBoard.appendChild(cell);
            }
        }
    }

    function drawSnake() {
        snake.forEach((segment) => {
            const snakeCell = document.createElement("div");
            snakeCell.className = "snake-cell";
            snakeCell.style.gridColumn = segment.x + 1;
            snakeCell.style.gridRow = segment.y + 1;
            snakeCell.style.backgroundColor = segment.color;
            gameBoard.appendChild(snakeCell);
        });
    }

    function drawFood() {
        const foodCell = document.createElement("div");
        foodCell.className = "food-cell";
        foodCell.style.gridColumn = food.x + 1;
        foodCell.style.gridRow = food.y + 1;
        foodCell.style.backgroundColor = food.color;
        gameBoard.appendChild(foodCell);
    }

    function update() {
        const newHead = { ...snake[0] };

        switch (direction) {
            case "UP":
                newHead.y -= 1;
                break;
            case "DOWN":
                newHead.y += 1;
                break;
            case "LEFT":
                newHead.x -= 1;
                break;
            case "RIGHT":
                newHead.x += 1;
                break;
            default:
                break;
        }

        snake.unshift(newHead);

        if (newHead.x === food.x && newHead.y === food.y) {
            score++;
            scoreElement.textContent = `Score: ${score}`;
            food = generateFood();
        } else {
            snake.pop();
        }

        if (checkCollision()) {
            gameOver();
        }

        drawBoard();
        drawSnake();
        drawFood();
    }

    function checkCollision() {
        const head = snake[0];
        return (
            head.x >= boardSize ||
            head.x < 0 ||
            head.y >= boardSize ||
            head.y < 0 ||
            snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
        );
    }

    function startGame() {
        isGameOver = false;
        score = 0;
        scoreElement.textContent = `Score: ${score}`;
        snake = [{ x: 12, y: 12, color: getRandomColor() }];
        direction = "RIGHT";
        food = generateFood();
        gameTitle.textContent = "Snake Game";
        startButton.textContent = "Pause";
        gameInterval = setInterval(update, 250);
    }

    function gameOver() {
        isGameOver = true;
        gameTitle.textContent = "Game Over!";
        startButton.textContent = "Restart";
        clearInterval(gameInterval);
        showGameOverScreen();
    }

    function resetGame() {
        clearInterval(gameInterval);
        startGame();
        hideGameOverScreen();
    }

    function showGameOverScreen() {
        gameOverContainer.style.display = "block";
        gameOverContainer.innerHTML = `<p>Game Over!</p><p>Score: ${score}</p>`;
    }

    function hideGameOverScreen() {
        gameOverContainer.style.display = "none";
    }

    drawBoard();

    startButton.addEventListener("click", function () {
        if (isGameOver) {
            resetGame();
        } else {
            clearInterval(gameInterval);
            gameTitle.textContent = "Paused";
            startButton.textContent = "Resume";
            isGameOver = true;
        }
    });

    document.addEventListener("keydown", function (e) {
        if (!isGameOver) {
            switch (e.key) {
                case "ArrowUp":
                    if (direction !== "DOWN") direction = "UP";
                    break;
                case "ArrowDown":
                    if (direction !== "UP") direction = "DOWN";
                    break;
                case "ArrowLeft":
                    if (direction !== "RIGHT") direction = "LEFT";
                    break;
                case "ArrowRight":
                    if (direction !== "LEFT") direction = "RIGHT";
                    break;
                default:
                    break;
            }
        }
    });
});