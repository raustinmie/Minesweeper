const width = 25;
const height = 25;
let board = [];
let heightInBoxes = 10;
let widthInBoxes = 10;
let mineCount = 10;
const bombIcon = String.fromCodePoint(0x1f4a3);
const flagIcon = String.fromCodePoint(0x1f6a9);
const questionMarkIcon = String.fromCodePoint(0x2753);

function takeInputs() {
	const widthInput = document.getElementById("widthInput");
	const heightInput = document.getElementById("heightInput");
	const minesInput = document.getElementById("minesInput");
	widthInBoxes = parseInt(widthInput.value);
	heightInBoxes = parseInt(heightInput.value);
	mineCount = parseInt(minesInput.value);

	setupBoard();
}

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

class Box {
	constructor(x, y, width, height) {
		this._xCoordinate = x;
		this._yCoordinate = y;
		this._xLocation = x * width;
		this._yLocation = y * height;
		this._width = width;
		this._height = height;
		this._hasMine = false;
		this._neighborCount = 0;
		this._revealed = false;
		this._flagged = Box.EMPTY;
	}

	static get EMPTY() {
		return 0;
	}

	static get FLAG() {
		return 1;
	}

	static get QUESTION() {
		return 2;
	}

	get flagged() {
		return this._flagged;
	}

	set flagged(value) {
		this._flagged = value;
	}

	get x() {
		return this._xCoordinate;
	}
	get y() {
		return this._yCoordinate;
	}
	get revealed() {
		return this._revealed;
	}

	set revealed(value) {
		this._revealed = value;
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
		ctx.fillStyle = "black";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.font = `${width - 5}px`;

		if (!this._revealed) {
			ctx.fillStyle = "gray";
			ctx.fillRect(this._xLocation, this._yLocation, this._width, this._height);
			if (this.flagged == Box.FLAG) {
				ctx.fillText(
					flagIcon,
					this._xLocation + this._width / 2,
					this._yLocation + this._height / 2,
					this._width
				);
			} else if (this._flagged == Box.QUESTION) {
				ctx.fillText(
					questionMarkIcon,
					this._xLocation + this._width / 2,
					this._yLocation + this._height / 2,
					this._width
				);
			}
		} else {
			ctx.fillStyle = "white";
			ctx.fillRect(this._xLocation, this._yLocation, this._width, this._height);
			ctx.fillStyle = "black";
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
		ctx.strokeRect(this._xLocation, this._yLocation, this._width, this._height);
	}
}
// function rightClickDraw(ctx,box) {
// 	draw(ctx);
// 	ctx.strokeStyle = "black";
// 	ctx.fillStyle = "black";
// 	ctx.textBaseline = "middle";
// 	ctx.textAlign = "center";
// 	ctx.font = `${width - 5}px`;
// 	if ((box.flagged = 1)) {
// 	ctx.fillText(
// 		flagIcon,
// 		box.xLocation + box.width / 2,
// 		box.yLocation + box.height / 2,
// 		box.width
// 	);
// } else if ((box.flagged = 2)) {
// 	ctx.fillText(
// 		questionMarkIcon,
// 		box.xLocation + box.width / 2,
// 		box.yLocation + box.height / 2,
// 		box.width
// 	} else {
// 			ctx.fillStyle = "gray";
// 			ctx.fillRect(this._xLocation, this._yLocation, this._width, this._height);
//);
// }
// }

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

function setupBoard() {
	const boardCanvas = document.getElementById("board");
	const ctx = boardCanvas.getContext("2d");
	ctx.clearRect(0, 0, boardCanvas.width, boardCanvas.height);

	board = [];
	const flatArray = [];
	// setup
	for (let y = 0; y < heightInBoxes; ++y) {
		board.push([]);
		for (let x = 0; x < widthInBoxes; ++x) {
			const newBox = new Box(x, y, width, height);
			flatArray.push(newBox);
			board[y].push(newBox);
		}
	}
	scatterMines(flatArray);
	countNeighbors(board);

	// render
	for (let y = 0; y < heightInBoxes; ++y) {
		for (let x = 0; x < widthInBoxes; ++x) {
			board[y][x].draw(ctx);
		}
	}
}

function onLoad(event) {
	console.log("Document finished loading");

	document
		.getElementById("startButton")
		.addEventListener("click", event => takeInputs());

	const boardCanvas = document.getElementById("board");
	const ctx = boardCanvas.getContext("2d");

	boardCanvas.addEventListener(
		"contextmenu",
		event => {
			event.preventDefault();
			const rect = boardCanvas.getBoundingClientRect();
			const xPos = event.clientX - rect.left;
			const yPos = event.clientY - rect.top;
			const x = Math.floor(xPos / width);
			const y = Math.floor(yPos / height);
			if (board[y][x].flagged == Box.EMPTY) {
				board[y][x].flagged = Box.FLAG;
			} else if (board[y][x].flagged == Box.FLAG) {
				board[y][x].flagged = Box.QUESTION;
			} else {
				board[y][x].flagged = Box.EMPTY;
			}
			board[y][x].draw(ctx);
			//rightClickDraw(ctx,board[y])
		},
		false
	);

	boardCanvas.addEventListener("click", event => {
		console.log(`board clicked ${event.clientX}, ${event.clientY}`);
		let rect = boardCanvas.getBoundingClientRect();
		const xPos = event.clientX - rect.left;
		const yPos = event.clientY - rect.top;
		const x = Math.floor(xPos / width);
		const y = Math.floor(yPos / height);
		if (x < 0 || x >= widthInBoxes || y < 0 || y >= heightInBoxes) {
			return;
		}

		console.log(`board clicked ${x},${y}`);
		console.log(board[y][x].hasMine);
		if (board[y][x].flagged == Box.FLAG) {
			return;
		} else if (board[y][x].revealed) {
			return;
		}
		reveal(ctx, board[y][x]);
		board[y][x].draw(ctx);
		if (board[y][x].hasMine) {
			alert("Game Over!");
		} else if (board[y][x].neighborCount === 0) {
			forEachNeighbor(x, y, box => reveal(ctx, box));
		}
		for (let y = 0; y < heightInBoxes; ++y) {
			for (let x = 0; x < widthInBoxes; ++x) {
				if (!board[y][x].revealed && !board[y][x].hasMine) {
					return;
				}
			}
		}
		alert("You Win!");
	});

	takeInputs();
}

function reveal(ctx, box) {
	box.revealed = true;
	box.draw(ctx);
	if (box.neighborCount == 0) {
		forEachNeighbor(box.x, box.y, box => {
			if (!box.revealed) {
				reveal(ctx, box);
			}
		});
	}
}

function forEachNeighbor(x, y, action) {
	for (let yOffset = -1; yOffset < 2; ++yOffset) {
		for (let xOffset = -1; xOffset < 2; ++xOffset) {
			if (y + yOffset < 0) continue;
			if (x + xOffset < 0) continue;
			if (y + yOffset > board.length - 1) continue;
			if (x + xOffset > board[y].length - 1) continue;
			if (yOffset == 0 && xOffset == 0) continue;
			action(board[y + yOffset][x + xOffset]);
		}
	}
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
