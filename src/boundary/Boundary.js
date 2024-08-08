export default function redrawCanvas(model, canvasObj, appObj){
    const ctx = canvasObj.getContext('2d');
    ctx.clearRect(0,0, canvasObj.width, canvasObj.height);
    ctx.beginPath();
    let i = 0;
    while (i < model.board.squares.length){
        let sq = model.board.squares[i];
        ctx.fillStyle = sq.color;
        ctx.fillRect(100+sq.column * 80, 100+sq.row * 80, 80, 80);
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2
        ctx.rect(100+sq.column * 80, 100+sq.row * 80, 80, 80)
        ctx.stroke()
        if(sq.column !== 0 && sq.row !== 0){
            ctx.beginPath();
            ctx.arc(100+sq.column * 80, 100+sq.row * 80, 8, 0, 2 * Math.PI);
            ctx.fillStyle = 'white'
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
        i++;
    }
}