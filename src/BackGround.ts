import DrawnableObject, { drawProperties } from "./DrawnableObject.js";

class Background implements DrawnableObject {

    constructor(private backgroundImage: HTMLImageElement){}

    public draw({context}: drawProperties){
        context.drawImage(this.backgroundImage, 0, 0);
    }
}

export default Background;