import Layer from "./Layer.js";
import Pacman from "./Pacman.js";
import Util from "./Util.js";
import Paths from "./Paths.js";
import existing_paths from './existing_paths.js';
import Ghost from "./Ghost.js";
import Game from "./Game.js";
import Background from "./BackGround.js";
import Point from "./Point.js";
import points from "./points.js";
import Score from "./Score.js";
import GameObject from "./GameObject.js";

window.onload = async () => {
    
    const backgroundImage = await Util.loadAsyncImage('/images/map.png');
    const background = new Background(backgroundImage);
    
    const lines = existing_paths.length;
    const columns = existing_paths[0].length;
    
    const tile_width = backgroundImage.width / columns;
    const tile_height = backgroundImage.height / lines;
    
    const [canvas, context] = Util.createCanvas();
    
    const layer = new Layer({
        canvas,
        context,
        size: {
            width: backgroundImage.width,
            height: backgroundImage.height + 100,
        },
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

    const spriteLeft = await Util.loadAsyncImage('/images/pac-man-left.png');
    const spriteRight = await Util.loadAsyncImage('/images/pac-man-right.png');
    const spriteUp = await Util.loadAsyncImage('/images/pac-man-up.png');
    const spriteDown = await Util.loadAsyncImage('/images/pac-man-down.png');

    const pacman = new Pacman(
        {
            left: [spriteLeft],
            right: [spriteRight],
            up: [spriteUp],
            down: [spriteDown],
        }, {
        paths: existing_paths,
        position_x: 22,
        position_y: 27,
    });

    const sprite_ghost_red_up = await Util.loadAsyncImage('/images/ghost_red_up.png');
    const sprite_ghost_red_down = await Util.loadAsyncImage('/images/ghost_red_down.png');
    const sprite_ghost_red_left = await Util.loadAsyncImage('/images/ghost_red_left.png');
    const sprite_ghost_red_right = await Util.loadAsyncImage('/images/ghost_red_right.png');

    const ghost = new Ghost(
        {
            left: [sprite_ghost_red_left],
            right: [sprite_ghost_red_right],
            up: [sprite_ghost_red_up],
            down: [sprite_ghost_red_down],
        }, {
            paths: existing_paths,
            position_x: 22,
            position_y: 23,
        }
    );

    gameObjects.push(pacman);
    gameObjects.push(ghost);

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
    (window as any).ghost = ghost;


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
        } catch (error) {
            
        }

    });

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