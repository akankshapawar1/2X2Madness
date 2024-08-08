/*
if we want to find the 4 squares around the circle
row and column = square is the bottom left
we need to find upper right, upper left, bottom right
how to do that?
upper right = row-1, column-1
upper left = row-1, column
bottom right = row, column-1
*/

let selectedCircle = null; // Track the currently selected circle
let groupArr = [];

const CIRCLE_RADIUS = 8;
const OFFSETS = [
    { dx: -1, dy: -1 },  // upper right
    { dx: -1, dy: 0 },   // upper left
    { dx: 0, dy: 0 },   // bottom left
    { dx: 0, dy: -1 },  // bottom right
];

//export function processClick(model, canvas, x, y, setSelectedGroups) {
export function processClick(model, canvas, x, y, forceRedraw, flag) {
    if(!flag){
    const ctx = canvas.getContext('2d');

    for (let sq of model.board.squares) {
        const circleX = 100 + sq.column * 80;
        const circleY = 100 + sq.row * 80;
        const distance = getDistance(x, y, circleX, circleY);

        if (distance < CIRCLE_RADIUS) {
            if (selectedCircle) {
                resetCircleAndGroup(selectedCircle, model, canvas);
            }

            selectedCircle = sq;

            groupArr = handleCircleClick(model, ctx, sq);
        
            if (!areAllSquresEmpty(groupArr)) {
                const newGrpArr = removeColor(groupArr, forceRedraw, model);
                return newGrpArr;
            }
            break;  // Exit loop if a circle has been processed.
        }
    }
    }
}

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function handleCircleClick(model, ctx, sq) {
    // Highlight the circle
    drawCircle(ctx, sq, 'red');

    // Highlight borders of the neighboring squares
    for (const offset of OFFSETS) {
        const neighbor = getNeighbor(model, sq, offset);
        if (neighbor) {
            groupArr.push(neighbor);
            drawRectangle(ctx, neighbor, 'red');
        }
    }
    return groupArr;
}

function drawCircle(ctx, sq, color) {
    ctx.beginPath();
    ctx.arc(100 + sq.column * 80, 100 + sq.row * 80, CIRCLE_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function getNeighbor(model, square, offset) {
    const neighborX = square.column + offset.dx;
    const neighborY = square.row + offset.dy;
    return model.board.squares.find(sq => sq.column === neighborX && sq.row === neighborY);
}

function drawRectangle(ctx, sq, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.rect(100 + sq.column * 80, 100 + sq.row * 80, 80, 80);
    ctx.stroke();
}

function resetCircleAndGroup(circle, model, canvas) {
    const ctx = canvas.getContext('2d');

    // Reset the border colors of the neighboring squares
    for (const offset of OFFSETS) {
        const neighbor = getNeighbor(model, circle, offset);

        if (neighbor) {
            drawRectangle(ctx, neighbor, 'black');
        }

        // if we only draw the selected circle again, the black borders are visible for the neighboring circles.
        //drawCircle(ctx, circle, 'white');
        // so draw all the circles again
        let i = 0;
        while (i < model.board.squares.length){
            let sq = model.board.squares[i];
            if(sq.column !== 0 && sq.row !== 0){
                drawCircle(ctx, sq, 'white');
            }
            i++;
        }
        
    }
    // Clear the selectedCircle variable and clear the group array
    selectedCircle = null;
    groupArr.length=0;
}

function removeColor(groupArr, forceRedraw, model) {
    const firstColor = groupArr[0].color;
    const allSameColor = groupArr.every(item => item.color === firstColor);
    if (allSameColor) {
        //groupArr.forEach(item => item.color = '');
        groupArr.forEach(item => item.color = 'white');
        model.updateMoveCount(+1);
        forceRedraw(+1);
    }
    return groupArr;
}


export function areAllSquresEmpty(groupArr) {
    for (let i = 0; i < groupArr.length; i++) {
        //if (groupArr[i].color !== '') {
        if (groupArr[i].color !== 'white') {
            return false;
        }
    }
    return true;
}
