import DrawnableObject, { drawProperties } from "./DrawnableObject.js";
import { GameEvent } from "./Game.js";
import { objectTypes } from "./GameObject.js";
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
    private afraid_timer?: number;

    constructor(private sprites: DirectionSprites, moving_object: MovingObjectProperties){
        super(moving_object);
    }

    public get sprite() {
        return this.sprites[this.direction][this.sprite_image];
    }

    public draw({ context, tile_width, tile_height }: drawProperties){
        const sprite = this.sprite;
        // sprite.style.opacity = this.state === 'returning' ? '0.5' : '1';
        context.globalAlpha = this.state === 'returning' ? 0.5 : 1;
        const x = (this.position_x*tile_width)+(tile_width/2)-10;
        const y = (this.position_y*tile_height)+(tile_height/2)-10;
        context.drawImage(sprite, x, y, 20, 20);
        context.globalAlpha = 1;
    }

    public move(){
        this.stop();
        this.chooseNewDirection();
        this.move_timer = setInterval(() => {
            if(this._canMove){
                const [position_x, position_y] = this.calculateNewPosition(this._state === 'returning');

                this.position_x = position_x;
                this.position_y = position_y;
                const hasCorners = this.checkCorners();
                
                if(hasCorners || this._state === 'returning'){
                    this.chooseNewDirection();
                }
            } else {
                this.chooseNewDirection();
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
        } else if (this._state === 'returning') {
            const x_difference = this.start_x - this.position_x;
            const y_difference = this.start_y - this.position_y;
            if(x_difference !== 0) {
                this.changeDirection(x_difference > 0 ? 'right' : 'left', true);
            } else if (y_difference != 0) {
                this.changeDirection(y_difference > 0 ? 'down' : 'up', true);
            } else {
                this.state = 'moving';
            }

            return;
        }

        const actual_direction = this.direction;
        const possible_directions = !this._canMove ? directions : directions.filter(direction => {
            if(
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

    }

    public set canMove(can: boolean){
        this._canMove = can;
        if(!can){
            this.chooseNewDirection();
        }
    }

    public get state() {
        return this._state;
    } 

    public set state(toState: GhostStates){
        if(this._state === 'returning' && toState === 'afraid'){
            return;
        }
        clearTimeout(this.afraid_timer);
        this._state = toState;
        switch (toState) {
            case 'moving':
            case 'returning':
                this.move();
                break;
            case 'stopped':
                this.stop();
                break;
            case 'afraid':
                this.move();
                this.afraid_timer = setTimeout(() => {
                    this.state = 'moving';
                }, 7000);
                break;
            case 'eaten':
                this.stop();
                this.state = 'returning';
                break;
            default:
                break;
        }

    }

    public get type(): objectTypes {
        return 'Ghost';
    }


    public listenEnvent(event: GameEvent){
        console.log(event);
    }

    public static async loadSpirites(ghost: string){
        const sprites = await Promise.all([
            Util.loadAsyncImage(`/images/ghost_${ghost}_up.png`),
            Util.loadAsyncImage(`/images/ghost_${ghost}_down.png`),
            Util.loadAsyncImage(`/images/ghost_${ghost}_left.png`),
            Util.loadAsyncImage(`/images/ghost_${ghost}_right.png`),
        ]);

        return {
            up: [sprites[0]],
            down: [sprites[1]],
            left: [sprites[2]],
            right: [sprites[3]],
        };
    }
}

export default Ghost;