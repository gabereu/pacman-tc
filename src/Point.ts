import { drawProperties } from "./DrawnableObject.js";
import GameObject, { GameObjectProperties } from "./GameObject.js";

type PointType = 'normal' | 'big';

interface PointProperties extends GameObjectProperties {
    pointType: PointType;
    sprite: HTMLImageElement;
}

class Point extends GameObject {
    private _pointType: PointType = 'normal'; 
    private sprite: HTMLImageElement;
    private sprite_size: number;

    constructor({pointType = 'normal', sprite, ...gameObjectProperties}: PointProperties){
        super(gameObjectProperties);
        this.sprite = sprite;
        this._pointType = pointType;
        this.sprite_size = pointType === 'normal' ? 8 : 14;
    }

    public draw({ context, tile_width, tile_height }: drawProperties){
        const half_size = this.sprite_size / 2;
        const x = (this.position_x*tile_width)+(tile_width/2)-half_size;
        const y = (this.position_y*tile_height)+(tile_height/2)-half_size;
        context.drawImage(this.sprite, x, y, this.sprite_size, this.sprite_size);
    }

    public eat(){
        window.game.removeGameObject(this);
        window.game.addPoints(this._pointType === 'normal' ? 1 : 2);
        if(this._pointType === 'big'){
            window.game.triggerAfraid();
        }
    }

    public get pointType(){
        return this._pointType;
    }

    public get type() {
        return 'Point';
    }

    public toString(){
        const data = {
            x: this.position_x,
            y: this.position_y,
            type: this._pointType,
        };
        return JSON.stringify(data);
    }

}

export default Point;