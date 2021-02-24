// export default interface GameObject {
//     readonly x: number;
//     readonly y: number;
//     readonly type: string;
// }

import DrawnableObject, { drawProperties } from "./DrawnableObject.js";

export interface GameObjectProperties {
    position_x: number;
    position_y: number;
}

class GameObject implements DrawnableObject {
    protected position_x: number;
    protected position_y: number;

    constructor({position_x, position_y}: GameObjectProperties){
        this.position_x = position_x;
        this.position_y = position_y;
    }

    public draw(_: drawProperties){}

    public get x() {
        return this.position_x;
    }

    public get y() {
        return this.position_y;
    }

    public get type() {
        return 'GameObject';
    }
}

export default GameObject;