// import Layer from "./Layer.js";
// import MapLayer from "./MapLayer.js";
// import Pacman from "./Pacman.js";
// import Util from "./Util.js";
// import Paths from "./Paths.js";
// import existing_paths from './existing_paths.js';
// import Ghost from "./Ghost.js";
// import Game from "./Game.js";

// window.onload = async () => {
    
//     window.game = new Game();

//     const [mapCanvas, mapContext] = Util.createCanvas();

//     const background = await Util.loadAsyncImage('/images/map.png');

//     const lines = existing_paths.length;
//     const columns = existing_paths[0].length;

//     const tile_width = background.width / columns;
//     const tile_height = background.height / lines;

//     const mapLayer = new MapLayer({
//         canvas: mapCanvas,
//         context: mapContext,
//         backgroundImage: background,
//         tile_width,
//         tile_height,
//     });
    
//     const spriteLeft = await Util.loadAsyncImage('/images/pac-man-left.png');
//     const spriteRight = await Util.loadAsyncImage('/images/pac-man-right.png');
//     const spriteUp = await Util.loadAsyncImage('/images/pac-man-up.png');
//     const spriteDown = await Util.loadAsyncImage('/images/pac-man-down.png');

//     const pacman = new Pacman(
//         {
//             left: [spriteLeft],
//             right: [spriteRight],
//             up: [spriteUp],
//             down: [spriteDown],
//         }, {
//         paths: existing_paths,
//         position_x: 21,
//         position_y: 27,
//         // tile_height,
//         // tile_width,
//     });

//     const sprite_ghost_red_up = await Util.loadAsyncImage('/images/ghost_red_up.png');
//     const sprite_ghost_red_down = await Util.loadAsyncImage('/images/ghost_red_down.png');
//     const sprite_ghost_red_left = await Util.loadAsyncImage('/images/ghost_red_left.png');
//     const sprite_ghost_red_right = await Util.loadAsyncImage('/images/ghost_red_right.png');

//     const ghost = new Ghost(
//         {
//             left: [sprite_ghost_red_left],
//             right: [sprite_ghost_red_right],
//             up: [sprite_ghost_red_up],
//             down: [sprite_ghost_red_down],
//         }, {
//             paths: existing_paths,
//             position_x: 22,
//             position_y: 23,
//             // tile_height,
//             // tile_width,
//         }
//     );

//     const [gameCanvas, gameContext] = Util.createCanvas();
//     const gameLayer = new Layer({
//         canvas: gameCanvas,
//         context: gameContext,
//         size: {
//             width: background.width,
//             height: background.height,
//         },
//         tile_width,
//         tile_height,
//     });
//     gameLayer.includeDrawnableObject(pacman);
//     gameLayer.includeDrawnableObject(ghost);
    
//     // window.game.includeGameObject(pacman);
//     // window.game.includeGameObject(ghost);

//     mapLayer.startRender();
//     gameLayer.startRender();
    
//     const paths = new Paths(lines, columns, tile_height, tile_width, existing_paths);

//     gameLayer.includeDrawnableObject(paths);
    
//     // (window as any).layer = mapLayer;
//     // (window as any).game = gameLayer;
//     // (window as any).paths = paths;
//     (window as any).pacman = pacman;
//     (window as any).ghost = ghost;

//     let type_wall = 1;

//     window.addEventListener('keydown', (keyboardEvent) => {
        
//         const key = keyboardEvent.key;
        
//         const move = (direction: any) => () => pacman.changeDirection(direction);
        
//         const moves = {
//             ArrowUp: move('up'),
//             ArrowDown: move('down'),
//             ArrowRight: move('right'),
//             ArrowLeft: move('left'),
//             Escape: () => mapLayer.stopRender(),
//             a: () => type_wall = (type_wall + 1) % 2,
//         } as any;
        
//         moves[key]();
//         // console.log(key)

//     });

//     // gameCanvas.onmousedown = ({offsetX, offsetY}) => {
//     //     const column = Math.floor(offsetX / tile_width);
//     //     const line = Math.floor(offsetY / tile_height);
        
//     //     console.log(line, column, existing_paths[line][column])
        
//     //     // paths.setWall(line, column, type_wall);
//     //     // drawning = true;
//     // }
//     // gameCanvas.onmouseup = () => {
//     //     drawning = false;
//     // }
//     // gameCanvas.onmousemove = ({offsetX, offsetY}) => {
//     //     if(drawning){
//     //         const column = Math.floor(offsetX / tile_width);
//     //         const line = Math.floor(offsetY / tile_height);
            
//     //         paths.setWall(line, column, type_wall);
//     //     }
//     // }

    
// }