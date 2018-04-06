let socket
let cnv
let brush

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
  cnv = createCanvas(700, 700)
  centerCanvas()
  background(0)


  socket = io.connect('http://localhost:3000')
  socket.on('drawing', drawNew)
}

// When clicking, draw circle and play synth.
function mousePressed() {
  // Play only if pressed inside canvas.
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    makeSound(mouseY)
  }
  let drawData = {
    x: mouseX,
    y: mouseY
  }
  socket.emit('drawing', drawData)
  noStroke()
  fill(255, 100, 100, 100)
  ellipse(mouseX, mouseY, 30, 30)
}

// Draw
function drawNew(data) {
  makeSound(data.y)
  noStroke()
  fill(255, 100, 100, 100)
  ellipse(data.x, data.y, 30, 30)
}

function makeSound(yPosition) {
  let env = new p5.Env()
  env.setADSR(0.1, 0.1, 0.5, 2)
  env.setRange(0.5, 0)
  let osc = new p5.TriOsc()
  osc.freq(map(yPosition, 500, 0, 300, 600))
  osc.amp(env)
  osc.start()
  env.play()
}
