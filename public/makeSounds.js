let sketch1 = function (p) {

  // Setup for canvas
  p.setup = function () {
    p.cnv = p.createCanvas(p.windowWidth, 700)
    p.cnv.mousePressed(p.drawCircle)
    // p.graphics = p.createGraphics(p.windowWidth, 700)

    p.background('white')

    p.button = p.select('#button-save')
    p.button.mousePressed(p.saveFile)

    p.backgroundColor = p.select('#bc-color')
    p.shapeColor = p.select('#shape-color')

    p.selOsc = p.select('#select-osc-draw')
    p.chosenOsc = p.selOsc.value()
    p.selOsc.changed(() => p.chosenOsc = p.selOsc.value())

    p.scale = majorScale
    p.sel = p.select('#select-scale')
    p.sel.changed(p.changeScale)

    p.socket = io.connect('http://localhost:3000/')
    p.socket.on('drawing', p.drawNew)

    p.recorder = new p5.SoundRecorder()
    p.recorder.setInput()
    p.soundFile = new p5.SoundFile()
  }

  p.draw = function () {
    p.background(p.random(5, 15), 10)
  }

  p.drawCircle = function () {
    p.recorder.record(p.soundFile)
    let drawData = {
      x: p.mouseX,
      y: p.mouseY,
      osc: p.chosenOsc,
      colors: p.shapeColor.value()
    }

    p.socket.emit('drawing', drawData)
    p.noStroke()
    p.fill('#' + p.shapeColor.value())
    p.ellipse(p.mouseX, p.mouseY, 30, 30)

    /*
    p.graphics.noStroke()
    p.graphics.fill('#' + p.shapeColor.value())
    p.graphics.ellipse(p.mouseX, p.mouseY, 30, 30)
    */

    // Play only if pressed inside canvas.
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
      p.makeSound(p.mouseY, p.mouseX)
    }
  }

  // Incoming socket.
  p.drawNew = function (data) {
    let osc

    p.noStroke()
    p.fill('#' + data.colors)
    p.ellipse(data.x, data.y, 30, 30)

    if (data.osc == p.chosenOsc) {
      osc = p.chosenOsc
    } else {
      osc = data.osc
    }

    p.makeSound(data.y, data.x, osc)

    /*
    p.graphics.noStroke()
    p.graphics.fill('#' + data.colors)
    p.graphics.ellipse(data.x, data.y, 30, 30)
    */ 
  }


  p.changeScale = function () {
    if (p.sel.value() == 'major') {
      p.scale = majorScale
    }
    if (p.sel.value() == 'minor') {
      p.scale = minScale
    }
    if (p.sel.value() == 'pentatonic') {
      p.scale = pentScale
    }
  }

  p.makeSound = function (yPosition, xPosition, chosenOsc = p.chosenOsc) {
    p.env = new p5.Env()
    p.noteLenght = p.floor(p.map(xPosition, 0, p.width, 1, 5))
    p.env.setADSR(0.008, 0.2, 0.3, p.noteLenght)
    p.env.setRange(0.5, 0.0)
    p.osc = new p5.Oscillator(chosenOsc)
    p.freqInd = p.floor(p.map(yPosition, p.height, 0, 0, p.scale.length))
    p.osc.amp(p.env)
    p.osc.start()
    p.osc.freq(p.scale[p.freqInd])
    p.env.play()
  }

  p.saveFile = function () {
    p.recorder.stop()
    p.saveSound(p.soundFile, 'Our Song')
  }
}



let SoundSketch = new p5(sketch1, 'sketch-holder-draw')