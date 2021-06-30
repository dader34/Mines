var resp = ""
const cfetch = () => {
  fetch('https://test.danner.repl.co/message/')
  .then(response => response.json())
  .then(data => document.getElementById("post").innerHTML = data);
}
cfetch()
setInterval(cfetch,2000)
//main js file for logic
var playing = true
var status = "Start game"
var hack = false
//Raphael Canvas to draw on
var canv = document.getElementById("centerdiv")
var cnv = Raphael(centerdiv, centerdiv.width, centerdiv.height)
var custommines = false
var pagain = true
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
//array for empty spaces
var chk = []
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
          // console.log([ro, co])
          return ([ro, co])
        }
      }
    }
  }
}
//recursive function to bruteforce random coordinates
function trys() {
  try {
    var spl = recursion()
    var r = spl[0]
    var c = spl[1]
    if (board[r][c] == empty) {
      board[r][c] = full
    } else {
      trys()
    }
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

    // console.log(`${row}, ${col}, ${board[row][col]}`)
  }
}
for (var r = 0; r < board.length; r++) {
  for (var c = 0; c < board[r].length; c++) {
    var sqr = cnv.rect(400 - 55 * c, 275 - 55 * r, 50, 50)
      .attr({
        fill: "#232640",
        stroke: "black",
        "stroke-width": 2.5
      })
  }
}
//function cboard to clear board
function cboard() {
  for (var r = 0; r < board.length; r++) {
    for (var c = 0; c < board[r].length; c++) {
      board[r][c] = 0
    }
  }
}
//generate n number of mines on board using random logic
function draw() {
  status = "Game in progress"
  document.getElementById("status").innerText = "Status: " + status
  document.getElementById("status").setAttribute("style", "background:#a2b4c4dc;")
  document.getElementById("mply").innerText = "Playing"
  document.getElementById("mply").setAttribute("style","cursor:default;")
  playing = true
  cboard()
  minearr.length = 0
  checked.length = 0
  cnv.clear()
  marr.length = 0
  fill()
  var b2 = solve(board)
  rotate(b2)
  rotate(b2)
  rotate(b2)
  for(var r = 0;r<b2.length;r++){
    b2[r] = b2[r].reverse()
  }
  console.log(b2)
  for (var r = 0; r < board.length; r++) {
    for (var c = 0; c < board[r].length; c++) {
      if (board[r][c] == full) {
        var sqr = cnv.rect(400 - 55 * c, 275 - 55 * r, 50, 50)
          .click(function () {
            if (playing == true) {
              if (this.attr("fill") == "#232640" || "#cf5353") {
                this.attr({ fill: "#fa5233" })
                for (var i = 0; i < marr.length; i++) {
                  if (this.id == marr[i][0][0]) {
                    for (var x = 0; x < marr.length; x++) {
                      cnv.getById(marr[x][0][0]).attr({ fill: "red" })
                    }
                    playing = false
                    document.getElementById("mply").innerText = "Play again"
                    status = "You lost"
                    document.getElementById("status").innerText = "Status: " + status
                    document.getElementById("status").setAttribute("style", "background:#fa5233;")
                    pagain = true
                    document.getElementById("mply").setAttribute("style","cursor:pointer;")
                    // console.log("you lost")
                  }
                }
              }
            }
          })
          if(hack == true){
            sqr.attr({
            fill: "#cf5353",
            // fill: "red",
            stroke: "black",
            "stroke-width": 2.5
          })
          }else{
          sqr.attr({
            fill: "#232640",
            // fill: "red",
            stroke: "black",
            "stroke-width": 2.5
          })
          }

        marr[marr.length] = [
          [
            sqr.id
          ],
          `${r}, ${c}`
        ]
      } else {

        var sqr = cnv.rect(400 - 55 * c, 275 - 55 * r, 50, 50)
          .click(function () {
            if (playing == true) {
              if (this.attr("fill") == "#232640") {
                this.attr({ fill: "#ffeb3b" })

              }
              if (checked.length == 24 - mines) {
                pagain = true
                status = "You won!"
                document.getElementById("mply").setAttribute("style","cursor:pointer;")
                document.getElementById("status").innerText = "Status: " + status
                document.getElementById("status").setAttribute("style", "background:#ffeb3b;")
                document.getElementById("mply").innerText = "Play again"
                playing = false
                for (var i = 0; i < marr.length; i++) {
                  for (var x = 0; x < marr.length; x++) {
                    cnv.getById(marr[x][0][0]).attr({ fill: "#cf5353" })
                  }
                }
              }
              for (var x = 0; x < chk.length; x++) {
                if (chk[x][0][0] == this.id) {
                  for (var i = 0; i < checked.length + 1; i++) {
                    if (checked.includes(this.id)) {
                      // console.log("already clicked!")
                    } else {
                      checked[checked.length] = this.id
                    }
                  }
                }
              }
            }
          })
          .attr({
            fill: "#232640",
            stroke: "black",
            "stroke-width": 2.5
          })

        chk[chk.length] = [[sqr.id], `${r}, ${c}`]
      }
    }
  }
}
document.getElementById("fbtn").setAttribute("style", "background:#4b4c65;")
document.getElementById("status").innerText = "Status: " + status
document.getElementById("cubtn").onmousedown = function () {
  document.getElementById("obtn").setAttribute("style", "background:#2a2b48;")
  document.getElementById("tbtn").setAttribute("style", "background:#2a2b48;")
  document.getElementById("fbtn").setAttribute("style", "background:#2a2b48;")
  document.getElementById("tebtn").setAttribute("style", "background:#2a2b48;")

  this.type = "number"
  this.placeholder = "1"
  this.min = "1"
  this.max = "24"
  custommines = true
}
document.getElementById("obtn").onmousedown = function () {
  document.getElementById("cubtn").setAttribute("style", "background:#2a2b48;")
  document.getElementById("tbtn").setAttribute("style", "background:#2a2b48;")
  document.getElementById("fbtn").setAttribute("style", "background:#2a2b48;")
  document.getElementById("tebtn").setAttribute("style", "background:#2a2b48;")
  this.setAttribute("style", "background:#4b4c65;")
  document.getElementById("cubtn").type = "button"
  document.getElementById("cubtn").value = "Custom"
  custommines = false
  mines = 1

}
document.getElementById("tbtn").onmousedown = function () {
  document.getElementById("obtn").setAttribute("style", "background:#2a2b48;")
  document.getElementById("cubtn").setAttribute("style", "background:#2a2b48;")
  document.getElementById("fbtn").setAttribute("style", "background:#2a2b48;")
  document.getElementById("tebtn").setAttribute("style", "background:#2a2b48;")
  this.setAttribute("style", "background:#4b4c65;")
  document.getElementById("cubtn").type = "button"
  document.getElementById("cubtn").value = "Custom"
  custommines = false
  mines = 3
}
document.getElementById("fbtn").onmousedown = function () {
  document.getElementById("tbtn").setAttribute("style", "background:#2a2b48;")
  document.getElementById("obtn").setAttribute("style", "background:#2a2b48;")
  document.getElementById("cubtn").setAttribute("style", "background:#2a2b48;")
  document.getElementById("tebtn").setAttribute("style", "background:#2a2b48;")
  this.setAttribute("style", "background:#4b4c65;")
  document.getElementById("cubtn").type = "button"
  document.getElementById("cubtn").value = "Custom"
  custommines = false
  mines = 5
}
document.getElementById("tebtn").onmousedown = function () {
  document.getElementById("tbtn").setAttribute("style", "background:#2a2b48;")
  document.getElementById("obtn").setAttribute("style", "background:#2a2b48;")
  document.getElementById("cubtn").setAttribute("style", "background:#2a2b48;")
  document.getElementById("fbtn").setAttribute("style", "background:#2a2b48;")
  this.setAttribute("style", "background:#4b4c65;")
  document.getElementById("cubtn").type = "button"
  document.getElementById("cubtn").value = "Custom"
  custommines = false
  mines = 10
}

function start() {
  if (custommines == true) {
    mines = document.getElementById("cubtn").value
  }
  if(pagain == true){
    draw()
    pagain = false
  }
}
function solve(matrix) {
  let arr = [];
  for (let i = 0; i < matrix.length; i++) {
    arr.push([])
    for (let j = 0; j < matrix.length; j++) {
      arr[i].push(matrix[j][i])
    }
  }
  return arr
}
function rotate(matrix) {
  if (!matrix.length) return null;
  if (matrix.length === 1) return matrix;
  transpose(matrix);
  matrix.forEach((row) => {
    reverse(row, 0, row.length - 1);
  });
}

function transpose(matrix) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = i; j < matrix[0].length; j++) {
      const temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
  return matrix;
}

function reverse(row, start, end) {
  while (start < end) {
    const temp = row[start];
    row[start] = row[end];
    row[end] = temp;
    start++;
    end--;
  }
  return row;
}
onkeypress = function(key){
  if(key.keyCode == 32 || 13 && pagain == true){
    start()
  }
}
// console.log(board)