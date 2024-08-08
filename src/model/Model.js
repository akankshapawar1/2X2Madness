import { config_4x4, config_5x5, config_6x6 } from "./configs";

export class Board{
    constructor(config){
        if(config){
            this.squares = []
            this.size = parseInt(config.numColumns)
            for (let csq of config.baseSquares){
                //{ "color" : "green", "row": "0", "column" : "0" }
                let sq = new Square(parseInt(csq.row), parseInt(csq.column), csq.color)
                this.squares.push(sq)
            }
        }
    }
}

export default class Model{
    constructor(ind){
        this.configs = [config_4x4, config_5x5, config_6x6]
        this.numMoves = 0
        if(ind === undefined){
            this.currentConfig = 0;
        }
        else {
            this.currentConfig = ind;
        }
        this.board = new Board(this.configs[this.currentConfig])
    }

    updateMoveCount(delta){
        this.numMoves += delta; 
    }

    /* resetMoveCount(){
        this.numMoves = 0;
    } */

}

export class Square{
    constructor(row, col, color){
        this.row = row;
        this.column = col;
        this.color = color;
    }
}