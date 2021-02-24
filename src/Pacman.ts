import DrawnableObject, { drawProperties } from "./DrawnableObject.js";
import MovingObject, { MovingObjectProperties } from "./MovingObject.js";
import Point from "./Point.js";

type DirectionSprites = {
    up: HTMLImageElement[];
    down: HTMLImageElement[];
    left: HTMLImageElement[];
    right: HTMLImageElement[];
}

class Pacman extends MovingObject implements DrawnableObject {

    private sprite_image = 0;

    constructor(private sprites: DirectionSprites, moving_object: MovingObjectProperties){
        super(moving_object);
        this.onMove = () => {
            const point = window.game.objectExists<Point>(this.x, this.y, 'Point');
            point?.eat();
        }
    }

    public draw({ context, tile_width, tile_height }: drawProperties){
        const sprite = this.sprites[this.direction][this.sprite_image];
        const x = (this.position_x*tile_width)+(tile_width/2)-10;
        const y = (this.position_y*tile_height)+(tile_height/2)-10;
        context.drawImage(sprite, x, y, 20, 20);
    }

    public get type() {
        return 'Pacman';
    }
}

export default Pacman;