import DrawnableObject, { drawProperties } from "./DrawnableObject.js";

class Score implements DrawnableObject {
    private score = 0;

    public draw({context, canvas}: drawProperties){
        context.font = "30px Arial";
        const x = 0;
        const y = canvas.height - 50;
        context.fillText(`Pontos: ${this.score}`, x, y);
    }

    public changeScore(score: number){
        this.score = score;
    }
}

export default Score;