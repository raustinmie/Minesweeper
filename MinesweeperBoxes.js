const width = 25;
const height = 25;
const board = [];
const heightInBoxes = 10;
const widthInBoxes = 10;
const mineCount = 10;
function roll(max) {
  return Math.floor(Math.random() * max);
}

class box {
  constructor(x, y, width, height) {
    this.xCoordinate = x + 1;
    this.yCoordinate = y + 1;
    this.xLocation = x * width;
    this.yLocation = y * height;
    this.width = width;
    this.height = height;
    this.mine = false;
  }

  draw(ctx) {
    ctx.strokeStyle = "black";
    ctx.strokeRect(this.yLocation, this.xLocation, this.width, this.height);
  }

  reveal() {}
}

function minesweeper(matrix) {
  var revealedMatrix = [];
  for (let i = 0; i < matrix.length; ++i) {
    revealedMatrix.push([]);
    for (let j = 0; j < matrix[i].length; ++j) {
      var value = 0;
      for (let iOffset = -1; iOffset < 2; ++iOffset) {
        for (let jOffset = -1; jOffset < 2; ++jOffset) {
          if (i + iOffset < 0) continue;
          if (j + jOffset < 0) continue;
          if (i + iOffset > matrix.length - 1) continue;
          if (j + jOffset > matrix[i].length - 1) continue;
          if (iOffset == 0 && jOffset == 0) continue;
          value = value + matrix[i + iOffset][j + jOffset];
        }
      }
      revealedMatrix[i].push(value);
    }
  }
  return revealedMatrix;
}

////////////////////////////CANVAS/////////////////////////////////

//document.addEventListener("DOMContentLoaded", onLoad);

function onLoad(event) {
  console.log("Document finished loading");

  const boardCanvas = document.getElementById("board");
  const ctx = boardCanvas.getContext("2d");

  for (let y = 0; y < heightInBoxes; ++y) {
    board.push([]);
    for (let x = 0; x < widthInBoxes; ++x) {
      board[y].push(new box(x, y, width, height));
      board[y][x].draw(ctx);
    }
  }
  scatterMines();

  // for (let y = 0; y < heightInBoxes; ++y) {
  //   for (let x = 0; x < widthInBoxes; ++x) {
  //     board[y][x].draw(ctx);
  //   }
  // }

  boardCanvas.addEventListener("click", event => {
    console.log(`board clicked ${event.clientX}, ${event.clientY}`);
    let rect = boardCanvas.getBoundingClientRect();
    const xPos = event.clientX - rect.left;
    const yPos = event.clientY - rect.top;
    const x = Math.floor(xPos / width);
    const y = Math.floor(yPos / height);
    console.log(`board clicked ${squareX},${squareY}`);

    board[y][x].reveal();
  });
}

function scatterMines() {
  let placedMines = 0;
  while (placedMines < mineCount) {
    let placeMine = board[roll(height)][roll(width)];
    if (placeMine == false) {
      placeMine = true;
      ++placedMines;
    }
  }
}

// let f1 = function(x, y) {
//   // do something with x and y
//   return x + y
// }

// let f4 = function f2(x, y) {
//   // do something with x and y
//   return x + y
// }

// const f3 = (x, y) => {
//   y = x + 3;
//   return x + y;
// }; // something with x and y

// let a = [1, 2, 3];
// a.map(x => x * 3);
