import Game from '../Game';

declare global {
    // let game: Game;
    interface Window { 
        game: Game;
    }
}
