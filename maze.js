// Kruskal algorith gives every square a value from 0 to 719. When loaded they have a different cell set then becomes the same at the end
//down = false
//right = false
const mazeWidth = 36, mazeHeight = 20, wallWidth = 6;
let maze, mazeDone = false, squareSize = 0;
// A collection of variables to store the details of the maze

let w = 0, h = 0;
let lastTimestamp = 0;

let myX = 0;
let myY = 0;
const pressedKeys = {};
// Information about the player

function fixSize() {
    w = window.innerWidth;
    h = window.innerHeight;
    const canvas = document.getElementById('mazeCanvas');
    canvas.width = w;
    canvas.height = h;
    squareSize = h / (mazeHeight + 1); // The squareSize variable is calculated every time the windows size is changed
}

function pageLoad() {

    window.addEventListener("resize", fixSize);
    fixSize();

    window.addEventListener("keydown", event => pressedKeys[event.key] = true);
    window.addEventListener("keyup", event => pressedKeys[event.key] = false);

    resetMaze(); // Needs to be called at page load

    window.requestAnimationFrame(gameFrame);

}


function resetMaze() {
    maze = []; // reset maze to an empty array
    let n = 0; // every cell of the maze stats with a different value, provided by n
    for (let i = 0; i < mazeWidth; i++) {
        let column = [];
        for (let j = 0; j < mazeHeight; j++) {
            column.push({down: false, right: false, set: n, colour: 'white'}); // Initially, each cell has a down and rightset to false, set set to n and colour set to grey
            n++;
        }
        maze.push(column);
    }
    mazeDone = false;
}

function gameFrame(timestamp) {

    if (lastTimestamp === 0) lastTimestamp = timestamp;
    const frameLength = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    inputs();
    processes(frameLength);
    outputs();

    window.requestAnimationFrame(gameFrame);

}

function outputs() {

    const canvas = document.getElementById('mazeCanvas');
    const context = canvas.getContext('2d');

    context.fillStyle = 'pink';
    context.fillRect(0,0,w,h);
    // Fills the canvas background

    for (let i = 0; i < mazeWidth; i++) {
      for (let j = 0; j < mazeHeight; j++) {
        // Loop through every cell ysing i and j as index variables

        let x = w/2 - (mazeWidth*squareSize)/2 + i*squareSize;
        let y = h/2 - (mazeHeight*squareSize)/2 + j*squareSize;
        // Prepare the x and y coordinates

        context.fillStyle = maze[i][j].colour;
        context.fillRect(x + wallWidth, y + wallWidth,
						squareSize - 2*wallWidth, squareSize - 2*wallWidth);
            // set the fill colour and draw the middle of the cell

            if (maze[i][j].down) {
context.fillRect(x + wallWidth, y + squareSize - wallWidth - 1,
squareSize - 2*wallWidth, wallWidth * 2 + 2);
}

if (maze[i][j].right) {
context.fillRect(x + squareSize - wallWidth - 1, y + wallWidth,
wallWidth * 2 + 2, squareSize - 2*wallWidth);
}

if (!mazeDone) {
    context.fillStyle = 'black';
    context.font = '15px Arial';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillText(maze[i][j].set, x + wallWidth + 2, y + wallWidth + 2);
}
// Draws numbers on cells while the page is loading (optional)

if (myX == i && myY == j) {
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(x + squareSize/2, y + squareSize/2, squareSize/3, 0, 2*Math.PI);
    context.fill();
}
// Draw the player (a red circle) if thery are at the current cell)

}
}
}

function processes(frameLength){
  if (!mazeDone){
    mazeDone = kruskalStep();
  }
}

function kruskalStep() {

    let oneSet = true;
    for (let i = 0; i < mazeWidth; i++) {
        for (let j = 0; j < mazeHeight; j++) {
            if (maze[i][j].set != maze[0][0].set) {
                oneSet = false;
                break;
            }
        }
    }
    if (oneSet) return true;
    // Works out if the maze generating process is finished by each cell having the same set


    let x, y, horizontal = 0, vertical = 0, a, b;
    // For the randomly chosen cell
    //  Randomly choose if doing right most or down most wallWidth
    // a and b for the sets of the cell and the adjacent cell

    while (true) {

        x = Math.floor(Math.random() * mazeWidth);
        y = Math.floor(Math.random() * mazeHeight);
// Repeatedly pick a random cell


        if (Math.random() < 0.5) {
            horizontal = 1;
            vertical = 0;
        } else {
            horizontal = 0;
            vertical = 1;
        }
// Pick either a vvertically or horizontally adjacent cell (50% probability of each)

        if (horizontal > 0 && (maze[x][y].right || x == mazeWidth - 1)) continue;
        if (vertical > 0 && (maze[x][y].down || y == mazeHeight - 1)) continue;
// reject the choice and restart the loop if the cell is already joined or is right on the maze edge

        a = maze[x][y].set;
        b = maze[x + horizontal][y + vertical].set;
        // Sore the set number of the cell and its adjacent in a and b


        if (a == b) continue;
        // Reject the choice and restart the loop if the cell and its adjacent are already in the same set

        if (vertical > 0) {
            maze[x][y].down = true;
        } else {
            maze[x][y].right = true;
        }
        // set either down or right to be ture (this joins the cells)

        for (let i = 0; i < mazeWidth; i++) {
            for (let j = 0; j < mazeHeight; j++) {
                if (maze[i][j].set == b) {
                    maze[i][j].set = a;
                }
                if (maze[i][j].set == a) { //optional to change colour
                    maze[i][j].colour = 'black'; //optional to change colour
                } //optional to change colour
            }
        }
        // loop through all the cells in the mae and set them to be in set a if they are currently in set b
        //Also change the colours of all set a cells to be white to show they've been joined up

        return false;
        // assuming it is not finished. return false. The chack for completion is at the staat of each iteration
    }
}


function inputs() {

    if (pressedKeys["ArrowUp"]) {
        if (!keyDown && myY > 0 && maze[myX][myY-1].down) { //One key preseed for each movement // also allows you not to go off the side // Only move if cells are joined
            myY--;
            keyDown = true;
        }
    } else if (pressedKeys["ArrowDown"]) {
        if (!keyDown && myY < mazeHeight-1 && maze[myX][myY].down) { //One key preseed for each movement // also allows you not to go off the side // Only move if cells are joined
            myY++;
            keyDown = true;
        }
    } else if (pressedKeys["ArrowLeft"]) {
        if (!keyDown && myX > 0 && maze[myX-1][myY].right) { //One key preseed for each movement // also allows you not to go off the side // Only move if cells are joined
            myX--;
            keyDown = true;
        }
    } else if (pressedKeys["ArrowRight"]) {
        if (!keyDown && myX < mazeWidth-1 && maze[myX][myY].right) { //One key preseed for each movement // also allows you not to go off the side // Only move if cells are joined
            myX++;
            keyDown = true;
    } else if (pressedKeys["g"]) {
        if (!keyDown) {
            resetMaze(); // When pressed, the G key will reset the maze and start regernation
            keyDown = true;
        }
    } else if (pressedKeys["f"]) {
        if (!keyDown) {
            while (!mazeDone) { // when pressed, the F key will fast forward the maze to completion
                mazeDone = kruskalStep(); // when pressed, the F key will fast forward the maze to completion
            }
            keyDown = true;
        }
    } else {
        keyDown = false; // no keys are pressed we can reset the keyDown variable
    }

}


        }
