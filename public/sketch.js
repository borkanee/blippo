let socket
let cnv

// Centers the sketch canvas
function centerCanvas() {
  let x = (windowWidth - width) / 2
  let y = (windowHeight - height) / 2
  cnv.position(x, y)
}

// Keeps centering while changing size of window.
function windowResized() {
  centerCanvas()
}

// Setup for canvas
function setup() {
  cnv = createCanvas(600, 400);
  centerCanvas()
  background(0)

  socket = io.connect('http://localhost:3000')
  socket.on('drawing', drawNew)
}

// While draging and clicking, draw circles.
function mouseDragged() {
  let drawData = {
    x: mouseX,
    y: mouseY
  }
  socket.emit('drawing', drawData)
  noStroke()
  fill(255, 100, 100, 125)
  ellipse(mouseX, mouseY, 20, 20)
}

// Draw
function drawNew(data) {
  
  noStroke()
  fill(255, 100, 100, 125)
  ellipse(data.x, data.y, 20, 20)
}
