const pentScale = [
  130.81, 146.83, 164.81, 196.00, 220.00,
  261.63, 293.66, 329.63, 392.00, 440.00, 523.25
]

const majorScale = [
  130.81, 146.83, 164.81, 174.61, 196.00, 220.00,
  246.94, 261.63, 293.66, 329.63, 349.23, 392.00,
  440.00, 493.88, 523.25
]

const minScale = [130.81, 146.83, 155.56, 174.61, 196.00, 207.65, 233.08, 261.63,
  293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25]


let socket, cnv, brush, noteLenght, freqInd, recorder, soundFIle, test

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
  background("white")
  frameRate(30)

  socket = io.connect('http://localhost:3000/')
  socket.on('drawing', drawNew)

  recorder = new p5.SoundRecorder()

  // Connect the sounds from sketch to the recorder.
  recorder.setInput()

  // This sound file will be used to save the recording.
  soundFile = new p5.SoundFile()
}

// When clicking, draw circle and play synth.
function mousePressed() {
  recorder.record(soundFile)
  let drawData = {
    x: mouseX,
    y: mouseY
  }

  socket.emit('drawing', drawData)
  noStroke()
  fill(random(0, 256), random(0, 256), random(0, 256), 70)
  ellipse(mouseX, mouseY, 30, 30)

  // Play only if pressed inside canvas.
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    makeSound(mouseY, mouseX)
  }
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    recorder.stop()
    let p5File = saveSound(soundFile, 'testfile')
    let blob = new Blob(p5File, {
      type: 'audio/wav'
    });
    socket.emit('newSound', blob)

  }
}

// Draw
function drawNew(data) {
  noStroke()
  fill(random(0, 256), random(0, 256), random(0, 256), 70)
  ellipse(data.x, data.y, 30, 30)
  makeSound(data.y, data.x)
}

function makeSound(yPosition, xPosition) {
  //let reverb = new p5.Reverb()
  let env = new p5.Env()
  noteLenght = floor(map(xPosition, 0, width, 1, 5))
  env.setADSR(0.01, 1, 0.2, noteLenght)
  env.setRange(0.5, 0)
  let osc = new p5.SinOsc()
  freqInd = floor(map(yPosition, height, 0, 0, minScale.length))
  osc.freq(minScale[freqInd])
  osc.amp(env)
  osc.start()
  //reverb.process(osc, 10, 0.15)
  env.play()
}

function blobToFile(theBlob, fileName) {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}