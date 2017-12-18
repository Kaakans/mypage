import { h, Component } from 'preact';

export class Coordinate {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public Equals(cord: Coordinate) {
        return cord.x === this.x && cord.y === this.y;
    }
}

export enum Direction {
    Left, Up, Right, Down
}

export enum GameState {
    Won, Lost, Playing, Paused
}

export default class Snake extends Component<any, any> {

    private cvs: HTMLCanvasElement;
    private readonly boxSize: number;
    private readonly heart_img: HTMLImageElement;

    private readonly columns = 23;
    private readonly rows = 23;

    private direction: Direction = Direction.Left;
    private gameState: GameState = GameState.Playing;
    private snake: Array<Coordinate>;
    private heart: Coordinate;

    private get ctx() {
        return this.cvs ? this.cvs.getContext("2d") : null;
    }

    private get score() {
        return this.snake ? this.snake.length - 1 : 0;
    }

    constructor() {
        super();

        this.boxSize = 32;
        
        this.heart_img = new Image();
        this.heart_img.className = "heart";
        this.heart_img.src = "../src/images/heart.png";
        
        this.initiateSnake();
        this.generateHeart();
    }

    private generateHeart() {
        let heart: Coordinate = null;

        do {
            heart = new Coordinate(
                Math.floor(Math.random()*(this.columns-3) + 1) * this.boxSize, 
                Math.floor(Math.random()*(this.rows-4) + 3) * this.boxSize
            );
        } while (this.snake.some(part => heart.Equals(part)))

        this.heart = heart;
    }

    private initiateSnake() {
        let snake = [];
        snake[0] = new Coordinate(11 * this.boxSize, 11 * this.boxSize);

        this.snake = snake;
    }

// ----------------- Update -----------------

    private update() {
        if (this.gameState != GameState.Playing) return;

        this.updateSnake();
        this.updateHeart();
    }

    private updateSnake() {
        let snake = this.snake;

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        let tail = snake.pop();

        snakeX -= this.direction === Direction.Left ? 1*this.boxSize : 0;
        snakeY -= this.direction === Direction.Up ? 1*this.boxSize : 0;
        snakeX += this.direction === Direction.Right ? 1*this.boxSize : 0;
        snakeY += this.direction === Direction.Down ? 1*this.boxSize : 0;

        let newHeadPosition = new Coordinate(snakeX, snakeY);
        snake.unshift(newHeadPosition);

        if (newHeadPosition.Equals(this.heart))
            snake.push(tail);
        
        this.snake = snake;
    }

    private updateHeart() {
        if (this.snake[0].Equals(this.heart))
            this.generateHeart();
    }

// ------------------ Draw ------------------

    private draw() {
        if (!this.ctx) return;

        if (this.gameState === GameState.Playing) {
            this.drawGround();
            this.drawHeart();
            this.drawSnake();
            this.drawScore();
        }

        if (this.gameState === GameState.Won)
            this.drawWinScreen();
            
        if (this.gameState === GameState.Lost)
            this.drawGameover();

        if (this.gameState === GameState.Paused)
            this.drawPauseScreen();
    }

    private drawGround() {
        this.ctx.fillStyle = "#232323";
        this.ctx.fillRect(0, 0, this.boxSize*this.columns, this.boxSize*this.rows);

        for (let x = 1; x < this.columns-1; x++) {
            for (let y = 3; y < this.rows-1; y++) {
                let xy = (x + y) % 2;
                this.ctx.fillStyle = xy === 1 ? "black" : "white";
                this.ctx.fillRect(x*this.boxSize, y*this.boxSize, this.boxSize, this.boxSize);
            }
        }
    }

    private drawHeart() {
        this.ctx.drawImage(this.heart_img, this.heart.x, this.heart.y, this.boxSize, this.boxSize);
    }

    private drawSnake() {
        if (this.snake.length === 2)
            console.log(`Snake p1: (${ this.snake[0].x }, ${ this.snake[0].y }), p2: (${ this.snake[1].x }, ${ this.snake[1].y })`);

        for(let i = 0; i < this.snake.length; i++) {
            this.ctx.fillStyle = i === 0 ? "purple" : "#eac67a";
            // this.ctx.fillStyle = "#eac67a";
            this.ctx.fillRect(this.snake[i].x, this.snake[i].y, this.boxSize, this.boxSize);
            
            this.ctx.strokeStyle = "#eac67a";
            this.ctx.strokeRect(this.snake[i].x, this.snake[i].y, this.boxSize, this.boxSize);
        }
    }

    private drawScore() {
        this.ctx.drawImage(this.heart_img, 1*this.boxSize, 1*this.boxSize, this.boxSize, this.boxSize);

        this.ctx.fillStyle = "white";
        this.ctx.font = "32px Oswald, monospace"
        this.ctx.textAlign = "start";
        this.ctx.fillText(`${ this.score }`, 2*this.boxSize, 1.9*this.boxSize);
    }
    
    private drawWinScreen() {
        this.drawScreen("You beat snake!");
    }

    private drawGameover() {
        this.drawScreen("Game over");
    }
    
    private drawScreen(message: string) {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        this.ctx.fillRect(0, 0, this.columns*this.boxSize, this.rows*this.boxSize);

        this.ctx.fillStyle = "white";
        this.ctx.font = "32px Oswald, monospace"
        this.ctx.textAlign = "center";

        let boardCenterX = this.columns/2 ;
        let boardCenterY = this.rows/2;

        this.ctx.fillText(message, boardCenterX * this.boxSize, boardCenterY * this.boxSize);
        this.ctx.fillText(`Final score: ${ this.score }`, boardCenterX * this.boxSize, (1 + boardCenterY) * this.boxSize);
        this.ctx.fillText("Press R to play again", boardCenterX * this.boxSize, (3 + boardCenterY) * this.boxSize);
    }

    private drawPauseScreen() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        this.ctx.fillRect(0, 0, this.columns*this.boxSize, this.rows*this.boxSize);

        this.ctx.fillStyle = "white";
        this.ctx.font = "32px Oswald, monospace"
        this.ctx.textAlign = "center";

        let boardCenterX = this.columns/2 ;
        let boardCenterY = this.rows/2;

        this.ctx.fillText("Paused", boardCenterX * this.boxSize, boardCenterY * this.boxSize);
        this.ctx.fillText("Press C to continue", boardCenterX * this.boxSize, (2 + boardCenterY) * this.boxSize);
    }

// ---------------- Conditions ----------------

    private checkEndConditions() {

        let snakeMaxLength = this.columns * this.rows;
        if (this.snake.length === snakeMaxLength)
            this.gameState = GameState.Won;

        let snakeCrash = this.snake
            .filter((val, i , snake) => i !== 0)
            .some(val => val.Equals(this.snake[0]));
        if (snakeCrash)
            this.gameState = GameState.Lost;

        let snakeOffBoard = 
            this.snake[0].x < 1*this.boxSize || this.snake[0].x > (this.columns - 2)*this.boxSize ||
            this.snake[0].y < 3*this.boxSize || this.snake[0].y > (this.rows - 2)*this.boxSize;
        if (snakeOffBoard)
            this.gameState = GameState.Lost;
    }

// ---------------- Game loop ----------------

    private gameLoop() {
        this.update();
        this.checkEndConditions();
        this.draw();
    }

    private runSnake() {
        let self = this;

        document.addEventListener("keydown", (event: KeyboardEvent) => { self.handleKeypress(event) })
        let game = setInterval(() => { self.gameLoop() }, 100);
    }

    private handleKeypress(event: KeyboardEvent) {
        
        if (this.gameState === GameState.Playing) {
            if (event.keyCode == 37) {
                this.direction = Direction.Left;
            } else if (event.keyCode == 38) {
                this.direction = Direction.Up;
            } else if (event.keyCode == 39) {
                this.direction = Direction.Right;
            } else if (event.keyCode == 40) {
                this.direction = Direction.Down;
            } else if (event.keyCode == 80) {
                this.gameState = GameState.Paused;
            }
        }

        if (this.gameState === GameState.Lost || this.gameState === GameState.Won) {
            if (event.keyCode == 82) {
                this.initiateSnake();
                this.generateHeart();
                this.direction = Direction.Left;
                this.gameState = GameState.Playing;
            }
        }

        if (this.gameState === GameState.Paused) {
            if (event.keyCode == 67) {
                this.gameState = GameState.Playing;
            }
        }
    }

    render() {
        return <div className="game-container">
            <div className="snake-container">
                <h1>Snake is currently only available for desktop</h1>
                <canvas id="snake-canvas" width="736" height="736" ref={canvas => this.cvs = canvas as HTMLCanvasElement}>
                </canvas>
            </div>
        </div>
    }

    componentDidMount() {
        this.runSnake();
    }
}