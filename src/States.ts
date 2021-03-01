import DrawnableObject, { drawProperties } from "./DrawnableObject.js";
import Ghost from "./Ghost.js";

class States implements DrawnableObject {
    constructor(private ghosts: Ghost[], private start_point_x: number){}

    public draw({ context }: drawProperties){
        for (const [index, ghost] of this.ghosts.entries()) {
            context.font = '25px Arial'
            context.textBaseline = 'middle';
            const ghost_sprite = ghost.sprite;
            const sprite_size = 25;
            const x = this.start_point_x;
            const y = (sprite_size + 15) * index + 15;
            context.drawImage(ghost_sprite, x, y, sprite_size, sprite_size);
            context.fillText(ghost.state, x + sprite_size + 5, y + sprite_size/2);
        }
    }
}

export default States;