import { h, Component } from 'preact';

export class Coordinate {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export interface ISnakeState {
    score: number;
    snake: Array<Coordinate>;
    heart: Coordinate;
}

export default class Snake extends Component<any, ISnakeState> {

    private cvs: HTMLCanvasElement;
    private readonly boxSize: number;
    private readonly heart_img: HTMLImageElement;

    private readonly columns = 26;
    private readonly rows = 26;

    private get ctx() {
        return this.cvs ? this.cvs.getContext("2d") : null;
    }

    private get snake() {
        return this.state.snake;
    }

    private get heart() {
        return this.state.heart;
    }

    constructor() {
        super();

        this.boxSize = 32;
        
        this.heart_img = new Image();
        this.heart_img.className = "heart";
        this.heart_img.src = "../src/images/heart.png";
        
        this.setScore(0);
        this.initiateSnake();
        this.generateHeart();
    }

    private setScore(score: number) {
        this.setState({ score: score });
    }

    private setSnake(snake: Array<Coordinate>) {
        this.setState({ snake: snake });
    }

    private generateHeart() {
        let heart = new Coordinate(
            Math.floor(Math.random()*24 + 1) * this.boxSize, 
            Math.floor(Math.random()*22 + 3) * this.boxSize
        );

        this.setState({ heart: heart });
    }

    private initiateSnake() {
        let snake = [];
        snake[0] = new Coordinate(13 * this.boxSize, 13 * this.boxSize);
        snake[1] = new Coordinate(13 * this.boxSize, 14 * this.boxSize);

        this.setSnake(snake);
    }

    private draw() {
        if (!this.ctx) return;

        this.drawGround();
        this.drawHeart();
        this.drawSnake();
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
        for(let i = 0; i < this.state.snake.length; i++) {
            // this.ctx.fillStyle = i === 0 ? "white" : "#eac67a";
            this.ctx.fillStyle = "#eac67a";
            this.ctx.fillRect(this.state.snake[i].x, this.state.snake[i].y, this.boxSize, this.boxSize);
            
            this.ctx.strokeStyle = "#eac67a";
            this.ctx.strokeRect(this.state.snake[i].x, this.state.snake[i].y, this.boxSize, this.boxSize);
        }
    }

    private runSnake() {
        let self = this;
        let game = setInterval(() => { self.draw() }, 100);
    }

    render() {
        return <div className="game-container">
            <div className="snake-container">
                <h1>Snake is currently only available for desktop</h1>
                <canvas id="snake-canvas" width="832" height="832" ref={canvas => this.cvs = canvas as HTMLCanvasElement}>
                </canvas>
            </div>
        </div>
    }

    componentDidMount() {
        this.runSnake();
    }
}