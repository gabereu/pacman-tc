import DrawnableObject, { drawProperties } from "./DrawnableObject.js";
import { GameEvent } from "./Game.js";
import MovingObject, { MovingObjectProperties, directions, direction } from "./MovingObject.js";
import Util from "./Util.js";

type DirectionSprites = {
    up: HTMLImageElement[];
    down: HTMLImageElement[];
    left: HTMLImageElement[];
    right: HTMLImageElement[];
}

type GhostStates =  'stopped' | 'moving' | 'afraid' | 'eaten' | 'returning';

class Ghost extends MovingObject implements DrawnableObject {

    private sprite_image = 0;
    private _state: GhostStates = 'stopped';

    constructor(private sprites: DirectionSprites, moving_object: MovingObjectProperties){
        super(moving_object);
    }

    public draw({ context, tile_width, tile_height }: drawProperties){
        const sprite = this.sprites[this.direction][this.sprite_image];
        const x = (this.position_x*tile_width)+(tile_width/2)-10;
        const y = (this.position_y*tile_height)+(tile_height/2)-10;
        context.drawImage(sprite, x, y, 20, 20);
    }

    public move(){
        this.stop();
        this.chooseNewDirection();
        this.move_timer = setInterval(() => {
            if(this._canMove){
                const [position_x, position_y] = this.calculateNewPosition();

                this.position_x = position_x;
                this.position_y = position_y;
                const hasCorners = this.checkCorners();
                
                if(hasCorners){
                    this.chooseNewDirection();
                }
            }
        }, 1000 / this.speed);
    }

    public stop(){
        clearInterval(this.move_timer);
    }

    private checkCorners(): boolean{

        const direction = 
            this.direction === 'up' || this.direction === 'down' ?
                'vertical' : 'horizontal';

        const x = this.x;
        const y = this.y;

        if(direction === 'vertical'){
            const left = this.paths[y][x - 1];
            const right = this.paths[y][x + 1];

            if(left || right){
                return true;
            }

        }

        if(direction === 'horizontal'){
            const up = this.paths[y - 1][x];
            const down = this.paths[y + 1][x];

            if(up || down){
                return true;
            }
        }
        
        return false;
    }

    private chooseNewDirection() {
        let changedDirection: boolean;

        if(this._state === 'afraid'){
            const pacman = window.game.positionOfPacman();
            const horizontalDirection = pacman.x > this.x ? 'left' : 'right';
            const verticalDirection = pacman.y > this.y ? 'up' : 'down';

            const directions_to_change = [horizontalDirection, verticalDirection] as direction[];

            for (const direction of Util.shuffleArray(directions_to_change)) {
                changedDirection = this.changeDirection(direction);
                if(changedDirection) return;
            }
        }

        const actual_direction = this.direction;
        const possible_directions = directions.filter(direction => {
            if(
                this._canMove &&
                actual_direction === 'up' && direction === 'down' ||
                actual_direction === 'down' && direction === 'up' ||
                actual_direction === 'left' && direction === 'right' ||
                actual_direction === 'right' && direction === 'left'
            ){
                return false;
            }
            return true;
        });

        const shuffled_possible_directions = Util.shuffleArray(possible_directions);
        
        for (const possible_direction of shuffled_possible_directions) {
            changedDirection = this.changeDirection(possible_direction);
            if(changedDirection) return;
        }

        // do{
        //     const key = Math.floor(Math.random() * possible_directions.length);
        //     const new_direction = possible_directions[key];

        //     changedDirection = this.changeDirection(new_direction)
        // }while(!changedDirection);
        // console.log(changedDirection);
    }

    public set canMove(can: boolean){
        this._canMove = can;
        if(!can){
            this.chooseNewDirection();
        }
    }

    public set state(toState: GhostStates){
        this._state = toState;
        switch (toState) {
            case 'moving':
            case 'afraid':
                this.move();
                break;
            case 'stopped':
                this.stop();
                break;
            default:
                break;
        }

    }

    public get type() {
        return 'Ghost';
    }

    public listenEnvent(event: GameEvent){
        console.log(event);
    }
}

export default Ghost;