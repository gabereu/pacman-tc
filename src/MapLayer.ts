import DrawnableObject from "./DrawnableObject.js";
import Layer, { LayerProperties } from "./Layer.js";

interface MapLayerProperties extends LayerProperties {
    backgroundImage: HTMLImageElement;
}

class MapLayer extends Layer{
    protected backgroundImage: HTMLImageElement;

    constructor({backgroundImage, ...superProperties}: Omit<MapLayerProperties, 'size'>){

        const size = {
            width: Number(backgroundImage.width),
            height: Number(backgroundImage.height),
        }

        super({size, ...superProperties});
        this.backgroundImage = backgroundImage;

        const backGroundObject: DrawnableObject = {
            draw({ context }){
                context.drawImage(backgroundImage, 0, 0)
            }
        }

        this.includeDrawnableObject(backGroundObject);
    }
}

export default MapLayer;