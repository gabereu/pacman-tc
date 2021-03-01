import DrawnableObject, { drawProperties } from "./DrawnableObject.js";

class Score implements DrawnableObject {
    private score = 0;

    public draw({context, canvas}: drawProperties){
        context.font = "30px Arial";
        const score = String(this.score);
        const text_size = context.measureText(score).width;
        const x = canvas.width/2 ;
        const y = canvas.height - 50;
        context.fillText(score, x - text_size/2, y);
    }

    public changeScore(score: number){
        this.score = score;
    }
}

export default Score;