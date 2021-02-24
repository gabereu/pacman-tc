import DrawnableObject from "./DrawnableObject.js";

export interface LayerProperties {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    size: {
        width: number;
        height: number;
    };
    tile_width: number;
    tile_height: number;
}

class Layer {
    protected canvas: HTMLCanvasElement;
    protected context: CanvasRenderingContext2D;

    protected objectPooling: DrawnableObject[] = []

    protected interval?: number;
    protected tile_width: number;
    protected tile_height: number;

    constructor({
        canvas,
        context,
        size,
        tile_width,
        tile_height,
    }: LayerProperties){
        this.canvas = canvas;
        this.context = context;
        this.tile_width = tile_width;
        this.tile_height = tile_height;

        canvas.width = size.width;
        canvas.height = size.height;
    }

    public includeDrawnableObject(object: DrawnableObject){
        this.objectPooling.push(object);
    }

    public removeDrawnableObject(object: DrawnableObject){
        const index = this.objectPooling.findIndex(objectInside => objectInside === object);
        this.objectPooling.splice(index, 1);
    }

    public render () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        for (const object of this.objectPooling) {
            object.draw({
                canvas: this.canvas,
                context: this.context,
                tile_width: this.tile_width,
                tile_height: this.tile_height,
            });
        }
    }

    public startRender(fps = 30): void {
        this.stopRender()
        const interval = setInterval(this.render.bind(this), 1000 / fps);

        this.interval = interval;
    }

    public stopRender(): void {
        clearInterval(this.interval);
    }

}

export default Layer;