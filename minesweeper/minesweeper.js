let board = [];
let rows = 8;
let columns = 8;

let minesCount = 10;
let minesLocation = []; // "2-2", "3-4", "2-1"

let tilesClicked = 0; //goal to click all tiles except the ones containing mines
let flagEnabled = false;

let gameOver = false;
let timer = 0;


window.onload = function() {
    startGame();
}

function incrementSeconds() {
    timer += 1;
    document.getElementById("timer").innerText = timer;
}
var cancel = setInterval(incrementSeconds, 1000);



function setMines() {

    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}


function startGame() {
    document.getElementById("minesCount").innerText = minesCount;
    document.getElementById("flagButton").addEventListener("click", setFlag);
    setMines();
    
    // filling up the board
    for (let r = 0; r < rows; r++){
        let row = [];
        for (let c = 0; c < columns; c++){
            let tile = document.createElement("div")
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickedTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row)
    }

    console.log(board);
}

function setFlag(){
    if (flagEnabled){
        flagEnabled = false
        document.getElementById("flagButton").style.backgroundColor = "lightgrey";
    }
    else{
        flagEnabled = true
        document.getElementById("flagButton").style.backgroundColor = "darkgray";
    }
}

function clickedTile(){
    if (gameOver || this.classList.contains("tile-clicked")){
        return;
    }

    let tile = this;
    if (flagEnabled){
        if (tile.innerText == ""){
            tile.innerText = "🏳️‍🌈";
        }
        else if (tile.innerText == "🏳️‍🌈"){
            tile.innerText = "";
        }
        return;
    }

    if (minesLocation.includes(tile.id)){
        gameOver = true;
        revealMines();
        return;
    }


    let coordinates = tile.id.split("-");
    let r = parseInt(coordinates[0]);
    let c = parseInt(coordinates[1]);
    checkMine(r, c);


}

function revealMines(){
    for (let r = 0; r < rows; r++ ){
        for (let c = 0; c < columns; c++){
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)){
                tile.innerText = "💣";
                tile.style.backgroundColor = "red"
            }
        }
    }
}


function checkMine(r, c){
    if (r < 0 || r >= rows || c < 0 || c >= columns){
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")){
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1; 
    
    let minesFound = 0;

    //checking top 3
    minesFound += checkTile(r-1, c-1); //top left tile
    minesFound += checkTile(r-1, c);  //top tile
    minesFound += checkTile(r-1, c+1); //top right tile

    //checking left and right
    minesFound += checkTile(r, c-1);  //left
    minesFound += checkTile(r, c+1);  //right

    //checking bottom 3
    minesFound += checkTile(r+1, c-1); //bottom left tile
    minesFound += checkTile(r+1, c);  //bottom tile
    minesFound += checkTile(r+1, c+1); //bottom right tile

    if (minesFound > 0){
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else{
        //top 3
        checkMine(r-1, c-1); // top left
        checkMine(r-1, c); // top 
        checkMine(r-1, c+1); // top right

        // left and right
        checkMine(r, c -1); // left
        checkMine(r, c+1); // right

        //bottom 3
        checkMine(r+1, c-1); // bottom left
        checkMine(r+1, c); // bottom 
        checkMine(r+1, c+1); // bottom right
    }

    if (tilesClicked == rows * columns - minesCount){
        document.getElementById("minesCount").innerText = "CLEARED";
        gameOver = true;
    }

}

function checkTile(r , c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns){
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())){
        return 1;
    }
    return 0;
}

