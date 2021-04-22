import GameObject, { objectTypes } from "./GameObject.js";
import Ghost from "./Ghost.js";
import Layer from "./Layer.js";
import Pacman from "./Pacman.js";
import Point from "./Point.js";
import Score from "./Score.js";

export type GameEvent = 'start' | 'eatball' | 'was eaten';

class Game {
    private objects: GameObject[] = [];
    private inital_objects: GameObject[] = [];
    private _points = 0; 

    constructor(private layer: Layer, private score: Score){
        layer.includeDrawnableObject(score);
    }

    public setInitalObjects(objects: GameObject[]){
        objects.forEach(this.includeGameObject.bind(this));
        this.inital_objects = Array.from(objects);
    }

    public includeGameObject(object: GameObject){
        this.layer.includeDrawnableObject(object);
        this.objects.push(object);
    }

    public removeGameObject(object: GameObject){
        const index = this.objects.findIndex(objectInArray => object === objectInArray);
        this.objects.splice(index, 1);
        this.layer.removeDrawnableObject(object);
    }

    public objectExists<T extends GameObject>(x: number, y: number, type: objectTypes, ignoreSelf?: GameObject): T | null {

        for (const object of this.objects) {
            if((object.type === type || type === 'Object') && object.x === x && object.y === y && object !== ignoreSelf){
                return object as T;
            }
        }

        return null;
    }

    public objectsInPosition(x: number, y: number){
        const objects: GameObject[] = [];
        for (const object of this.objects) {
            if(object.x === x && object.y === y ){
               objects.push(object);
            }
        }
        return objects;
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

    private set points(value: number){
        this._points = value;
        this.score.changeScore(value);
    }

    private get points(){
        return this._points;
    }

    public triggerAfraid(){
        for (const object of this.objects) {
            if(object.type === 'Ghost'){
                (object as Ghost).state = 'afraid';
            }else if(object.type === 'Pacman'){
                (object as Pacman).run();
            }
        }
    }

    public colisionOf(top_object: GameObject, bottom_object: GameObject){
        if(top_object.type === 'Pacman' && bottom_object.type === 'Point'){
            const point = bottom_object as Point;
            point.eat();
        } else {
            let pacman: Pacman | undefined = undefined;
            let ghost: Ghost | undefined = undefined;

            if(top_object.type === 'Pacman' && bottom_object.type === 'Ghost'){
                pacman = top_object as Pacman;
                ghost = bottom_object as Ghost;
            } else if (top_object.type === 'Ghost' && bottom_object.type === 'Pacman') {
                pacman = bottom_object as Pacman;
                ghost = top_object as Ghost;
            }

            if(!pacman || !ghost){
                return;
            }

            if(ghost.state === 'afraid'){
                ghost.state = 'eaten';
                this.addPoints(10);
            } else if (ghost.state !== 'eaten' && ghost.state !== 'returning'){
                this.reset(true);
            }
        }
    }

    public start() {
        for (const object of this.objects) {
            if(object instanceof Pacman){
                object.move();
            }else if(object instanceof Ghost) {
                object.state = 'moving';
            }
        }
    }

    public reset(startAfter = false){
        this.score.changeScore(0);
        const objects = Array.from(this.objects);
        objects.forEach(object => {
            const object_type = object.type;
            if(object_type === 'Pacman'){
                const pacman = object as Pacman;
                pacman.stop();
                pacman.reloadStartPoint();
            } else if(object_type === 'Ghost') {
                const ghost = object as Ghost;
                ghost.state = 'stopped';
                ghost.reloadStartPoint();
            }
            this.removeGameObject(object);
        });
        this.inital_objects.forEach(this.includeGameObject.bind(this));
        if(startAfter){
            setTimeout(() => {
                this.start();
            }, 1000);
        }
    }

};

export default Game;
 