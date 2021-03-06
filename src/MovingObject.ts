import GameObject, { GameObjectProperties, objectTypes } from "./GameObject.js";

export interface MovingObjectProperties extends GameObjectProperties {
    paths: number[][];
    // tile_width: number;
    // tile_height: number;
}

export type direction = 'up' | 'down' | 'left' | 'right';

export const directions: direction[] = ['up', 'down', 'left', 'right'];

class MovingObject extends GameObject {
    // protected position_x: number;
    // protected position_y: number;
    protected direction: direction = 'left';
    protected _canMove = false;
    protected move_timer?: number;
    protected speed = 3;
    protected onMove?: () => void;
    protected paths: number[][];
    protected start_x: number;
    protected start_y: number;

    constructor({paths, position_x, position_y}: MovingObjectProperties) {
        super({
            position_x,
            position_y
        });
        this.start_x = position_x;
        this.start_y = position_y;
        this.paths = paths;
    }

    public move(){
        this.stop();
        this.move_timer = setInterval(() => {
            const [position_x, position_y] = this.calculateNewPosition();

            this.position_x = position_x;
            this.position_y = position_y;
            this.onMove?.call(this);
            this.checkUnderOff();
        }, 1000 / this.speed);
    }

    public stop(){
        clearInterval(this.move_timer);
    }

    protected calculateNewPosition(ignoreWalls = false): [number, number] {
        const position_x = this.position_x;
        const position_y = this.position_y;
        const direction = this.direction;

        let direction_signal = 1;
        if(direction === 'up' || direction === 'left'){
            direction_signal = -1;
        }
        switch (direction) {
            case 'up':
            case 'down':
            {
                const new_position_y = position_y + direction_signal;
                if(this.paths[new_position_y][position_x] || ignoreWalls){
                    this.canMove = true;
                    return [position_x, new_position_y]
                }
                this.canMove = false;
                return [position_x, position_y];
            }
            case 'left':
            case 'right':
            {
                const new_position_x = position_x + direction_signal;
                if(this.paths[position_y][new_position_x] || ignoreWalls){
                    this.canMove = true;
                    return [new_position_x, position_y]
                }
                this.canMove = false;
                return [position_x, position_y];
            }
        }

    }

    public changeDirection(direction: direction, ignoreWalls = false){
        const actual_path_x = this.position_x;
        const actual_path_y = this.position_y;

        let updated_path_x = actual_path_x;
        let updated_path_y = actual_path_y;

        switch (direction) {
            case 'up':
                updated_path_x = actual_path_x;
                updated_path_y = actual_path_y - 1;
                break;
            case 'down':
                updated_path_x = actual_path_x;
                updated_path_y = actual_path_y + 1;
                break;
            case 'left':
                updated_path_x = actual_path_x - 1;
                updated_path_y = actual_path_y;
                break;
            case 'right':
                updated_path_x = actual_path_x + 1;
                updated_path_y = actual_path_y;
                break;
        }

        if(this.paths[updated_path_y][updated_path_x] || ignoreWalls){
            this.canMove = true;
            this.direction = direction;
            return true;
        }

        return false;
    }

    protected checkUnderOff(){
        const objects = window.game.objectsInPosition(this.x, this.y);
        for (const object of objects) {
            if(this === object) continue;

            window.game.colisionOf(this, object);
        }
    }

    protected positonfree(x: number, y: number){
        return this.paths[y][x];
    }

    public changeSpeed(speed: number){
        this.speed = speed;
    }

    public set canMove(can: boolean){
        this._canMove = can;
    }

    public reloadStartPoint(){
        this.position_x = this.start_x;
        this.position_y = this.start_y;
    }
}

export default MovingObject;