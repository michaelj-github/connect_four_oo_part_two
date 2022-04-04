/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(height = 6, width = 7) {
    this.width = width;
    this.height = height;
    this.currPlayer = 1;
    this.board = [];
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
    this.playerColor = [];
    this.playerColor[0] = "#FFD700";
    this.playerColor[1] = '#0057B7';

}

/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

makeBoard() {
  for (let h = 0; h < this.height; h++) {
    this.board.push([]);
    for (let w = 0; w < this.width; w++) {
      this.board[h][w] = null // w * h;
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

makeHtmlBoard() {
  const board = document.getElementById('board');

  // make column tops (clickable area for adding a piece to that column)
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  this.handleThisClick = this.handleClick.bind(this);
  top.addEventListener("click", this.handleThisClick);

  for (let x = 0; x < this.width; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }
  board.append(top);

  // make main part of board
  for (let y = 0; y < this.height; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < this.width; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }
    board.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

findSpotForCol(x) {
  for (let y = this.height - 1; y >= 0; y--) {
    if (!this.board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${this.currPlayer}`);
  piece.style.top = -50 * (y + 2);
  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

/** endGame: announce game end */

// endGame(msg) {
//   alert(msg);
// }

endGame = msg => {
  document.getElementById("messages").classList.add("gameOver");
  document.getElementById("messages").textContent = `Game Over! ${msg}`;
  this.gameOver = true;
}

/** handleClick: handle click of column top to play piece */

handleClick(evt) {
  if (!this.gameOver) {
  // console.log(evt, evt.target);
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = this.findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  this.board[y][x] = this.currPlayer;
  this.placeInTable(y, x);

  // check for win
  if (this.checkForWin()) {
    return this.endGame(`Player ${this.currPlayer} won!`);
  }

  // check for tie
  if (this.board.every(row => row.every(cell => cell))) {
    return this.endGame('Tie!');
  }

  // switch players
  this.currPlayer = this.currPlayer === 1 ? 2 : 1;
}
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

checkForWin() {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    const _win = cells =>
    cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer
    );

  for (let y = 0; y < this.height; y++) {
    for (let x = 0; x < this.width; x++) {
      // get "check list" of 4 cells (starting here) for each of the different
      // ways to win
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

}
function reStartGame() {
const theBoard = document.getElementById("board");
  while (theBoard.firstChild) { // clear the board
    theBoard.removeChild(theBoard.firstChild);
  }
  document.getElementById("messages").classList.remove("gameOver");
  document.getElementById("messages").style.textAlign = "center";
  document.getElementById("messages").style.color = "black";
  document.getElementById("messages").textContent = "Click a square on the top row.";
  document.getElementById("button").textContent = "Restart The Game!";
  const game = new Game(6, 7);
}
// const game = new Game(6, 7);
