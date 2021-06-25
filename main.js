//main js file for logic
console.log("updated?")
//Raphael Canvas to draw on
var canv = document.getElementById("canv")
var cnv = Raphael(canv, innerWidth, innerHeight)
//var for empty so i dont have to use 0 or 1
var empty = 0
//var for number of mines on board(subject to change)
var mines = 5
//array for mines during spawn
var minearr = []
//array for mines during game
var marr = []
//array for empty spaces
var checked = []
//same thing as empty but full
var full = 1
//rows that could fit on my screen
//31
var rs = 5
//columns that could fit
//64
var cls = 5
//game board is an array of [rs][cls]
var board = new Array(rs)
//fill array with arrays to make 2d matrix
//temp var to count bombs in array
var count = 0
//Functions
for (var r = 0; r < board.length; r++) {
  board[r] = new Array(cls)
  //set array to be full of 0s
  for (var c = 0; c < board[r].length; c++) {
    board[r][c] = empty
  }
}
//function for generating random numbers so the main.js code doesnt look sloppy
//@param max : Integer
function random(max) {
  //Math.floor the random function because it only returns vals <= 0
  return Math.floor(Math.random() * max)
}
function recursion() {
  for (var i = 0; i < minearr.length; i++) {
    var ro = random(board.length)
    var co = random(board[0].length)
    if (minearr[i].includes(ro)) {
      if (minearr[i].includes(co)) {
        recursion()
      }
    } else {
      if (minearr[i].includes(co) == false) {
        if (typeof ([ro, co]) == "undefined") {
          recursion()
        } else {
          console.log([ro, co])
          return ([ro, co])
        }
      }
    }
  }
}
function trys() {
  try {
    var spl = recursion()
    var r = spl[0]
    var c = spl[1]
    board[r][c] = full
    count++
  } catch (e) {
    trys()
  }
}
//function to fill board with random mines
//@param none : void
function fill() {
  for (var rep = 0; rep < mines; rep++) {
    var row = random(board.length)
    var col = random(board[0].length)
    if (board[row][col] == full) {
      trys()
    }
    if (board[row][col] == empty) {
      board[row][col] = full
      count++
      minearr[minearr.length] = [row, col]
    }

    console.log(`${row}, ${col}, ${board[row][col]}`)
  }
}
//generate n number of mines on board using random logic
fill()
function draw() {
  for (var r = 0; r < board.length; r++) {
    for (var c = 0; c < board[r].length; c++) {
      if (board[r][c] == full) {
        var sqr = cnv.rect(innerWidth / 2 - 55 * c, innerHeight / 2 - 55 * r, 50, 50)
          .click(function () {
            if (this.attr("fill") == "#232640") {
              this.attr({ fill: "#deb446" })
              for (var i = 0; i < marr.length; i++) {
                if(this.id == marr[i][0][0]){
                  console.log("this should console log")
                }
              }
            } else {
              this.attr({ fill: "#232640" })
            }
          })
          .attr({
            fill: "#232640",
            stroke: "black",
            "stroke-width": 2.5
          })
        marr[marr.length] = [
          [
            sqr.id
          ],
          `${r}, ${c}`
        ]
      } else {

      }
    }
  }
}
draw()
console.log(board)
console.log(`count should be 5 and is ` + count)