import { h, Component } from 'preact';

export class Coordinate {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export enum Direction {
    Left, Up, Right, Down
}

export default class Snake extends Component<any, any> {

    private cvs: HTMLCanvasElement;
    private readonly boxSize: number;
    private readonly heart_img: HTMLImageElement;

    private readonly columns = 23;
    private readonly rows = 23;

    private direction: Direction = Direction.Left;
    private score: number;
    private snake: Array<Coordinate>;
    private heart: Coordinate;

    private get ctx() {
        return this.cvs ? this.cvs.getContext("2d") : null;
    }

    constructor() {
        super();

        this.boxSize = 32;
        
        this.heart_img = new Image();
        this.heart_img.className = "heart";
        this.heart_img.src = "../src/images/heart.png";
        
        this.score = 0;
        this.initiateSnake();
        this.generateHeart();
    }

    private generateHeart() {
        let heart = new Coordinate(
            Math.floor(Math.random()*(this.columns-3) + 1) * this.boxSize, 
            Math.floor(Math.random()*(this.rows-4) + 3) * this.boxSize
        );

        this.heart = heart;
    }

    private initiateSnake() {
        let snake = [];
        snake[0] = new Coordinate(11 * this.boxSize, 11 * this.boxSize);

        this.snake = snake;
    }

    private draw() {
        if (!this.ctx) return;

        this.drawGround();
        this.drawHeart();
        this.drawSnake();
        this.drawScore();

        this.updateSnake();
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
        this.ctx.fillText(this.score.toString(), 2*this.boxSize, 1.9*this.boxSize);
    }

    private updateSnake() {
        let snake = this.snake;

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        snake.pop();

        snakeX -= this.direction === Direction.Left ? 1*this.boxSize : 0;
        snakeY -= this.direction === Direction.Up ? 1*this.boxSize : 0;
        snakeX += this.direction === Direction.Right ? 1*this.boxSize : 0;
        snakeY += this.direction === Direction.Down ? 1*this.boxSize : 0;

        snake.unshift(new Coordinate(snakeX, snakeY));
        this.snake = snake;
    }

    private handleKeypress(event: KeyboardEvent) {
        if (event.keyCode == 37) {
            this.direction = Direction.Left;
        } else if (event.keyCode == 38) {
            this.direction = Direction.Up;
        } else if (event.keyCode == 39) {
            this.direction = Direction.Right;
        } else if (event.keyCode == 40) {
            this.direction = Direction.Down;
        }
    }

    private runSnake() {
        let self = this;

        document.addEventListener("keydown", (event: KeyboardEvent) => { self.handleKeypress(event) })
        let game = setInterval(() => { self.draw() }, 100);
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