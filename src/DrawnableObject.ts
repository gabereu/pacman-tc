export interface drawProperties {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    tile_width: number;
    tile_height: number;
}
export default interface DrawnableObject {
    draw(properties: drawProperties): void
}