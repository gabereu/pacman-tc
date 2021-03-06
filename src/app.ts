import Layer from "./Layer.js";
import Pacman from "./Pacman.js";
import Util from "./Util.js";
// import Paths from "./Paths.js";
import existing_paths from './existing_paths.js';
import Ghost from "./Ghost.js";
import Game from "./Game.js";
import Background from "./BackGround.js";
import Point from "./Point.js";
import points from "./points.js";
import Score from "./Score.js";
import GameObject from "./GameObject.js";
import States from "./States.js";

window.onload = async () => {

    const all_images_promise = Promise.all([
        Util.loadAsyncImage('/images/map.png'),
        Pacman.loadSpirites(),
        Ghost.loadSprites('red'),
        Ghost.loadSprites('light_blue'),
        Ghost.loadSprites('pink'),
        Ghost.loadSprites('orange'),
        Util.loadAsyncImage('/images/ghost_afraid.png'),
        Util.loadAsyncImage('/images/ghost_afraid_2.png'),
    ]);

    const [
        backgroundImage,
        pacman_sprites,
        red_ghost_sprites,
        light_blue_ghost_sprites,
        pink_ghost_sprites,
        orange_ghost_sprites,
        ghost_afraid_sprite,
        ghost_afraid_2_sprite,
    ] = await all_images_promise;

    const ghost_afraid_sprites: [HTMLImageElement, HTMLImageElement] = [ghost_afraid_sprite, ghost_afraid_2_sprite];

    const background = new Background(backgroundImage);
    
    const lines = existing_paths.length;
    const columns = existing_paths[0].length;
    
    const tile_width = backgroundImage.width / columns;
    const tile_height = backgroundImage.height / lines;
    
    const [canvas, context] = Util.createCanvas();
    
    const layerSize = {
        width: backgroundImage.width + 300,
        height: backgroundImage.height + 100,
    };

    const layer = new Layer({
        canvas,
        context,
        size: layerSize,
        tile_width,
        tile_height,
    });
    layer.includeDrawnableObject(background);
    layer.startRender();
    
    // const paths = new Paths(lines, columns, tile_height, tile_width, existing_paths);
    // layer.includeDrawnableObject(paths);
    
    const score = new Score();
    const gameObjects: GameObject[] = []
    const game = new Game(layer, score);
    window.game = game;

    const pacman = new Pacman(
        pacman_sprites, 
        {
            paths: existing_paths,
            position_x: 22,
            position_y: 27,
        }
    );

    const red_ghost = new Ghost(
        {
            ...red_ghost_sprites,
            afraid: ghost_afraid_sprites,
        },
        {
            paths: existing_paths,
            position_x: 22,
            position_y: 23,
        },
    );

    const light_blue_ghost = new Ghost(
        {
            ...light_blue_ghost_sprites,
            afraid: ghost_afraid_sprites,
        },
        {
            paths: existing_paths,
            position_x: 23,
            position_y: 23,
        },
    );

    const pink_ghost = new Ghost(
        {
            ...pink_ghost_sprites,
            afraid: ghost_afraid_sprites,
        },
        {
            paths: existing_paths,
            position_x: 21,
            position_y: 23,
        },
    );

    const orange_ghost = new Ghost(
        {
            ...orange_ghost_sprites,
            afraid: ghost_afraid_sprites,
        },
        {
            paths: existing_paths,
            position_x: 20,
            position_y: 23,
        },
    );

    gameObjects.push(pacman);
    gameObjects.push(red_ghost);
    gameObjects.push(light_blue_ghost);
    gameObjects.push(pink_ghost);
    gameObjects.push(orange_ghost);

    const states = new States([red_ghost, light_blue_ghost, pink_ghost, orange_ghost], backgroundImage.width + 5);
    layer.includeDrawnableObject(states);

    const pointBigSprite = await Util.loadAsyncImage('/images/point_big.png');
    const poinSprite = await Util.loadAsyncImage('/images/point.png');

    points.forEach(pointInfo => {
        const point = new Point({
            pointType: pointInfo.type,
            position_x: pointInfo.x,
            position_y: pointInfo.y,
            sprite: pointInfo.type === 'normal'? poinSprite : pointBigSprite,
        });
        // game.includeGameObject(point);
        gameObjects.push(point);
    });

    // console.log(gameObjects)

    game.setInitalObjects(gameObjects);

    (window as any).pacman = pacman;
    (window as any).ghost = red_ghost;

    window.addEventListener('keydown', (keyboardEvent) => {
        const key = keyboardEvent.key;

        const move = (direction: any) => () => pacman.changeDirection(direction);
        // const changePointType = () => pointType = pointType === 'big' ? 'normal' : 'big';
        // const changeAction = () => action = action === includePoint ? removePoint : includePoint
        
        const moves = {
            ArrowUp: move('up'),
            ArrowDown: move('down'),
            ArrowRight: move('right'),
            ArrowLeft: move('left'),
            // a: () => type_wall = (type_wall + 1) % 2,
            // t: changePointType,
            // r: changeAction,
            // s: savePoints,
        } as any;
        
        try {
            moves[key]();
            keyboardEvent.preventDefault();
        } catch (error) {
        }

    });

    const canvasContainer = document.querySelector<HTMLDivElement>('#canvas_container')
    if(!canvasContainer){
        throw new Error('Can not find canvas_container');
    }
    canvasContainer.style.height = `${layerSize.height}px`;

    const start_stop_button = document.querySelector<HTMLButtonElement>('#start_stop_button');
    if(!start_stop_button){
        throw new Error('Can not find start_stop_button');
    }

    start_stop_button.innerHTML = 'Começar'
    start_stop_button.addEventListener('click', function () {
        if(this.innerHTML === 'Começar'){
            this.innerHTML = 'Voltar do inicio';
            game.start()
        } else {
            this.innerHTML = 'Começar';
            game.reset()
        }
    })


        // let mouse_using = false;
    // let newPoints: Point[] = [];
    // let pointType: 'big' | 'normal' = 'big';
    // let action = removePoint;

    // (window as any).points = newPoints;

    // function includePoint(x: number, y: number) {
    //     if(game.objectExists(x, y, 'Point'))
    //         return;
    //     const point = new Point({
    //         pointType,
    //         position_x: x,
    //         position_y: y,
    //         sprite: pointType === 'normal'? poinSprite : pointBigSprite,
    //     });

    //     newPoints.push(point);
    //     game.includeGameObject(point);
    // }

    // function removePoint(x: number, y: number){
    //     const point = game.objectExists(x, y, 'Point');
    //     if(point){
    //         newPoints = newPoints.filter(point_inside => point_inside !== point);
    //         (window as any).points = newPoints;
    //         game.removeGameObject(point);
    //     }
    // }

    // function savePoints(){
    //     localStorage.setItem('points', JSON.stringify(newPoints.map(point => point.toString())));
    // }

    // canvas.onmousedown = ({offsetX, offsetY}) => {
    //     const column = Math.floor(offsetX / tile_width);
    //     const line = Math.floor(offsetY / tile_height);
        
    //     action(column, line);

    //     mouse_using = true;
    // }
    // canvas.onmouseup = () => {
    //     mouse_using = false;
    // }
    // canvas.onmousemove = ({offsetX, offsetY}) => {
    //     if(mouse_using){
    //         const column = Math.floor(offsetX / tile_width);
    //         const line = Math.floor(offsetY / tile_height);
    //         action(column, line);
    //     }
    // }

}