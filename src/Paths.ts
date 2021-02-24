import DrawnableObject, { drawProperties } from "./DrawnableObject.js";
import Util from "./Util.js";

class Paths implements DrawnableObject {
    private grid: number[][];
    readonly lines: number;
    readonly columns: number;
    readonly tile_width: number;
    readonly tile_height: number;

    constructor(lines: number, columns: number, tile_height: number, tile_width: number, grid?: number[][]){
        this.grid = grid || Util.createZeroGrid(lines, columns);
        this.lines = lines;
        this.columns = columns;
        this.tile_height = tile_height;
        this.tile_width = tile_width;
    }


    public draw({context}: drawProperties){
        const tile_width = this.tile_width;
        const tile_height = this.tile_height;

        const colors = [
            'rgba(0, 225, 0, .3)',
            'rgba(255, 0, 0, .3)'
        ]

        for (let line = 0; line < this.lines; line++) {
            for (let column = 0; column < this.columns; column++) {
                
                const color = colors[this.grid[line][column]];
                context.fillStyle = color;

                const x = tile_width * column;
                const y = tile_height * line;

                context.fillRect(x, y, tile_width, tile_height);

                // context.font = '50px Arial';
                // // context.fillText(`|${line}|`, x, y, tile_width);
                // context.fillText('Paths', 0, 0);

            }
        }
    }

    public setWall(line: number, column: number, type = 1) {
        this.grid[line][column] = type;
    }

    public getGrid() {
        return this.grid;
    }

}

export default Paths;