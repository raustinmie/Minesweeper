const width = 25;
const height = 25;
const board = [];
const heightInBoxes = 10;
const widthInBoxes = 10;
const mineCount = 50;
const bombIcon = String.fromCodePoint(0x1f4a3);

function roll(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.floor(Math.random() * (max - min) + min);
}

function shuffle(array, cap) {
  if (cap === undefined) {
    cap = array.length;
  }

  for (let i = 0; i < array.length - 2 && i < cap; ++i) {
    const rand = roll(i, array.length);
    // swap
    const tmp = array[rand];
    array[rand] = array[i];
    array[i] = tmp;
  }

  return array;
}

class box {
  constructor(x, y, width, height) {
    this._xCoordinate = x + 1;
    this._yCoordinate = y + 1;
    this._xLocation = x * width;
    this._yLocation = y * height;
    this._width = width;
    this._height = height;
    this._hasMine = false;
    this._neighborCount = 0;
  }
  get neighborCount() {
    return this._neighborCount;
  }
  set neighborCount(value) {
    this._neighborCount = value;
  }
  get hasMine() {
    return this._hasMine;
  }

  set hasMine(value) {
    this._hasMine = value;
  }

  draw(ctx) {
    ctx.strokeStyle = "black";
    ctx.strokeRect(this._xLocation, this._yLocation, this._width, this._height);
    ctx.fillStyle = "black";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = `${width - 5}px`;
    if (this._hasMine) {
      ctx.fillText(
        bombIcon,
        this._xLocation + this._width / 2,
        this._yLocation + this._height / 2,
        this._width
      );
    } else if (this._neighborCount !== 0) {
      ctx.fillText(
        this._neighborCount,
        this._xLocation + this._width / 2,
        this._yLocation + this._height / 2,
        this._width
      );
    }
  }

  reveal() {}
}

function countNeighbors(board) {
  for (let i = 0; i < board.length; ++i) {
    for (let j = 0; j < board[i].length; ++j) {
      let neighborCount = 0;
      for (let iOffset = -1; iOffset < 2; ++iOffset) {
        for (let jOffset = -1; jOffset < 2; ++jOffset) {
          if (i + iOffset < 0) continue;
          if (j + jOffset < 0) continue;
          if (i + iOffset > board.length - 1) continue;
          if (j + jOffset > board[i].length - 1) continue;
          if (iOffset == 0 && jOffset == 0) continue;

          if (board[i + iOffset][j + jOffset].hasMine) {
            ++neighborCount;
          }
        }
      }
      board[i][j].neighborCount = neighborCount;
    }
  }
}

////////////////////////////CANVAS/////////////////////////////////

//document.addEventListener("DOMContentLoaded", onLoad);

function onLoad(event) {
  console.log("Document finished loading");

  const boardCanvas = document.getElementById("board");
  const ctx = boardCanvas.getContext("2d");
  const flatArray = [];

  // setup
  for (let y = 0; y < heightInBoxes; ++y) {
    board.push([]);
    for (let x = 0; x < widthInBoxes; ++x) {
      const newBox = new box(x, y, width, height);
      flatArray.push(newBox);
      board[y].push(newBox);
    }
  }
  scatterMines(flatArray);
  countNeighbors(board);

  // render
  for (let y = 0; y < heightInBoxes; ++y) {
    board.push([]);
    for (let x = 0; x < widthInBoxes; ++x) {
      board[y][x].draw(ctx);
    }
  }

  boardCanvas.addEventListener("click", event => {
    console.log(`board clicked ${event.clientX}, ${event.clientY}`);
    let rect = boardCanvas.getBoundingClientRect();
    const xPos = event.clientX - rect.left;
    const yPos = event.clientY - rect.top;
    const x = Math.floor(xPos / width);
    const y = Math.floor(yPos / height);
    console.log(`board clicked ${x},${y}`);
    console.log(board[y][x].hasMine);
    board[y][x].reveal();
    if (board[y][x].hasMine == true) {
      //   alert("Game Over!");
      for (let i = 0; i < heightInBoxes; ++i) {
        for (let j = 0; j < widthInBoxes; ++j) {}
      }
    }
  });
}

function scatterMines(flatArray) {
  shuffle(flatArray, mineCount);
  for (let i = 0; i < mineCount; ++i) {
    flatArray[i].hasMine = true;
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
