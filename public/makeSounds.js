let sketch1 = function (p) {

  // Setup for canvas
  p.setup = function () {
    // p.reverb = new p5.Reverb()

    p.cnv = p.createCanvas(700, 700)
    p.cnv.mousePressed(p.drawCircle)
    p.background('white')

    p.button = p.select('#button-save')
    p.button.mousePressed(p.saveFile)

    p.selOsc = p.select('#select-osc-draw')
    p.chosenOsc = p.selOsc.value()
    p.selOsc.changed(() => p.chosenOsc = p.selOsc.value())

    p.scale = majorScale
    p.sel = p.select('#select-scale')
    p.sel.changed(p.changeScale)

    p.socket = io.connect('http://3f3f34ae.ngrok.io/')
    p.socket.on('drawing', p.drawNew)

    p.recorder = new p5.SoundRecorder()
    // Connect the sounds from sketch to the recorder.
    p.recorder.setInput()

    // This sound file will be used to save the recording.
    p.soundFile = new p5.SoundFile()
  }

  // When clicking, draw circle and play synth.
  p.drawCircle = function () {
    p.recorder.record(p.soundFile)
    let drawData = {
      x: p.mouseX,
      y: p.mouseY
    }

    p.socket.emit('drawing', drawData)
    p.noStroke()
    p.fill(p.random(0, 256), p.random(0, 256), p.random(0, 256), 70)
    p.ellipse(p.mouseX, p.mouseY, 30, 30)

    // Play only if pressed inside canvas.
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
      p.makeSound(p.mouseY, p.mouseX)
    }
  }

  // Draw
  p.drawNew = function (data) {
    p.noStroke()
    p.fill(p.random(0, 256), p.random(0, 256), p.random(0, 256), 70)
    p.ellipse(data.x, data.y, 30, 30)
    p.makeSound(data.y, data.x)
  }

  p.changeScale = function () {
    if (p.sel.value() == "major") {
      p.scale = majorScale
    }
    if (p.sel.value() == "minor") {
      p.scale = minScale
    }
    if (p.sel.value() == "pentatonic") {
      p.scale = pentScale
    }
  }

  p.makeSound = function (yPosition, xPosition) {
    p.env = new p5.Env()
    p.noteLenght = p.floor(p.map(xPosition, 0, p.width, 1, 5))
    p.env.setADSR(0.008, 0.2, 0.3, p.noteLenght)
    p.env.setRange(0.5, 0.0)
    p.osc = new p5.Oscillator(p.chosenOsc)
    p.freqInd = p.floor(p.map(yPosition, p.height, 0, 0, p.scale.length))
    p.osc.amp(p.env)
    p.osc.start()
    p.osc.freq(p.scale[p.freqInd])
    //p.reverb.process(p.osc, 10, 0.15)
    // p.reverb.amp(0.01)
    p.env.play()
  }

  p.saveFile = function () {
    p.recorder.stop()
    p.saveSound(p.soundFile, 'Our Song')
  }
}

let SoundSketch = new p5(sketch1, 'sketch-holder-draw')