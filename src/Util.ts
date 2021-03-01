class Util {
    public static loadAsyncImage (path: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            
            image.onload = () => resolve(image);
            image.onerror = reject
            image.src = path;
        });
    }

    public static createCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const container = document.querySelector('#canvas_container');

        if(!context || !container) {
            throw new Error('Can not get contex or container');
        }
        
        container.append(canvas);

        return [ canvas, context ]
    }

    public static createZeroGrid(lines: number, columns: number): number[][] {
        const grid = Array.from(Array(lines), () => new Array(columns).fill(0))
        return grid;
    }

    public static shuffleArray<T>(array: T[]): T[]{
        const arrayCopy = Array.from(array);
        const shuffledArray: T[] = [];

        const size = array.length;
        for(let i = 0; i < size; i++){
            const index = Math.floor(Math.random() * arrayCopy.length);
            shuffledArray.push(arrayCopy[index]);
            arrayCopy.splice(index, 1);
        }

        return shuffledArray;
    }
}

export default Util;