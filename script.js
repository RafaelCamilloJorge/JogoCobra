const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d");

const score = document.querySelector('.score--value');
const finalScore = document.querySelector('.final-score > span')
const menu = document.querySelector('.menu-screen')
const button = document.querySelector('.btn-play')


let direction, loopId
const size = 30;

const snake = [
    {x: 300, y: 300},
]

const incrementScore = () => {
    score.innerHTML = parseInt(score.innerHTML) + 10;

}


const randomNumber = (max, min) => {
    return Math.round(Math.random() * (max - min) + min);
}


const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)

    return Math.round(number / 30) * 30;
}




const food = {
    x: randomPosition(),
    y: randomPosition(), 
    color: "yellow"
}


const drawFood = () => {

    const { x, y, color } = food 

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}


const drawSnake = () => {  
    ctx.fillStyle = "gray"; 
    snake.forEach((position, index) => {

        if(index == snake.length - 1){
            ctx.fillStyle = "white";
        }

        ctx.fillRect(position.x, position.y, size, size)
    });
}


const moveSnake = () => {
    if(!direction) return;

    const head = snake[snake.length - 1];

    if(direction == "right"){
        snake.push({x: head.x + size, y: head.y});
    }
    if(direction == "left"){
        snake.push({x: head.x - size, y: head.y});
    }
    if(direction == "down"){
        snake.push({x: head.x, y: head.y + size});
    }
    if(direction == "up"){
        snake.push({x: head.x, y: head.y - size});
    }

    snake.shift();  

}


const drawGrid = () => {
    ctx.lineWidth = 1;  
    ctx.strokeStyle = "#191919"

    for(let i = 30; i < canvas.width; i+=30){
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
    

}


const checkEat = () => {
    const head = snake[snake.length - 1]

    if(head.x == food.x && head.y == food.y){
        snake.push(head)
        incrementScore()

        let x = randomPosition()
        let y = randomPosition()

        while(snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition();
            y = randomPosition()
        
        }

        food.x = x;
        food.y = y;
        
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size; 
    const neckIndex = snake.length - 2;

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    const selfCollision = snake.find((position, index) => {
        return position.x === head.x && position.y === head.y && index < neckIndex;
    });

    if (wallCollision || selfCollision) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = 'flex';
    finalScore.innerHTML = score.innerHTML;
    canvas.style.filter = 'blur(4px)'

    button.addEventListener('click', () => {
        location.reload()
    })

}


const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600)
    
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop();
    }, 300 - (parseInt(score.innerHTML) * 2))
}

gameLoop();

document.addEventListener("keydown", ({ key }) => {
    if(key == "ArrowRight" && direction != "left"){
        direction = "right";
    }
    else if(key == "ArrowLeft" && direction != "right"){
        direction = "left";
    }
    else if(key == "ArrowUp" && direction != "down"){
        direction = "up";
    }
    else if(key == "ArrowDown" && direction != "up"){
        direction = "down";
    }
});




