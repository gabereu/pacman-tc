import GameObject from "./GameObject.js";
import Ghost from "./Ghost.js";
import Layer from "./Layer.js";

export type objectTypes = 'Pacman' | 'Ghost' | 'Point' | 'map';

export type GameEvent = 'start' | 'eatball' | 'was eaten';

class Game {
    private objects: GameObject[] = [];
    private points = 0; 

    constructor(private layer: Layer){}

    public includeGameObject(object: GameObject){
        this.layer.includeDrawnableObject(object);
        this.objects.push(object);
    }

    public removeGameObject(object: GameObject){
        const index = this.objects.findIndex(objectInArray => object === objectInArray);
        this.objects.splice(index, 1);
        this.layer.removeDrawnableObject(object);
    }

    public objectExists<T extends GameObject>(x: number, y: number, type: objectTypes): T | null {

        for (const object of this.objects) {
            if(object.type === type && object.x === x && object.y === y){
                return object as T;
            }
        }

        return null;
    }

    public positionOfPacman(){
        const pacman = this.objects.find(object => object.type === 'Pacman');
        if(pacman){
            return {
                x: pacman.x,
                y: pacman.y,
            }
        }

        return {
            x: 0,
            y: 0,
        };
    }

    public addPoints(points: number){
        this.points += points;
        // console.log(this.points);
    }

    public triggerAfraid(){
        for (const object of this.objects) {
            if(object.type === 'Ghost'){
                (object as Ghost).state = 'afraid';
            }
        }
    }


};

export default Game;
 