import DrawnableObject, { drawProperties } from "./DrawnableObject.js";
import { objectTypes } from "./GameObject.js";
import MovingObject, { MovingObjectProperties } from "./MovingObject.js";
import Util from "./Util.js";

type DirectionSprites = {
    up: HTMLImageElement[];
    down: HTMLImageElement[];
    left: HTMLImageElement[];
    right: HTMLImageElement[];
}

class Pacman extends MovingObject implements DrawnableObject {

    private sprite_image = 0;
    private speed_timer?: number;

    constructor(private sprites: DirectionSprites, moving_object: MovingObjectProperties){
        super(moving_object);
    }

    public draw({ context, tile_width, tile_height }: drawProperties){
        const sprite = this.sprites[this.direction][this.sprite_image];
        const x = (this.position_x*tile_width)+(tile_width/2)-10;
        const y = (this.position_y*tile_height)+(tile_height/2)-10;
        context.drawImage(sprite, x, y, 20, 20);
    }

    public get type(): objectTypes {
        return 'Pacman';
    }

    public static async loadSpirites(){
        const sprites = await Promise.all([
            Util.loadAsyncImage(`/images/pac-man-up.png`),
            Util.loadAsyncImage(`/images/pac-man-down.png`),
            Util.loadAsyncImage(`/images/pac-man-left.png`),
            Util.loadAsyncImage(`/images/pac-man-right.png`),
        ]);

        return {
            up: [sprites[0]],
            down: [sprites[1]],
            left: [sprites[2]],
            right: [sprites[3]],
        };
    }

    public run(){
        clearTimeout(this.speed_timer);
        const speed = this.speed;
        this.speed = speed * 3;
        this.speed_timer = setTimeout(() => {
            this.speed = speed;
        }, 10000);
    }
}

export default Pacman;