let sketch1 = function (p) {
  p.pentScale = [
    130.81, 146.83, 164.81, 196.00, 220.00,
    261.63, 293.66, 329.63, 392.00, 440.00, 523.25
  ]

  p.majorScale = [
    130.81, 146.83, 164.81, 174.61, 196.00, 220.00,
    246.94, 261.63, 293.66, 329.63, 349.23, 392.00,
    440.00, 493.88, 523.25
  ]

  p.minScale = [130.81, 146.83, 155.56, 174.61, 196.00, 207.65, 233.08, 261.63,
    293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25]


  // Setup for canvas
  p.setup = function () {
    p.createCanvas(700, 700)

    p.background("white")
    p.songNum = 1

    p.socket = io.connect('http://localhost:3000/')
    p.socket.on('drawing', p.drawNew)

    p.recorder = new p5.SoundRecorder()

    // Connect the sounds from sketch to the recorder.
    p.recorder.setInput()

    // This sound file will be used to save the recording.
    p.soundFile = new p5.SoundFile()
  }

  // When clicking, draw circle and play synth.
  p.mousePressed = function () {
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
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) {
      p.recorder.stop()
      let p5File = saveSound(p.soundFile, 'song')
      let blob = new Blob(p5File, {
        type: 'audio/wav'
      })
      p.socket.emit('newSound', blob)

    }
  }

  // Draw
  p.drawNew = function (data) {
    p.pnoStroke()
    p.fill(random(0, 256), random(0, 256), random(0, 256), 70)
    p.ellipse(data.x, data.y, 30, 30)
    p.makeSound(data.y, data.x)
  }

  p.makeSound = function (yPosition, xPosition) {
    //let reverb = new p5.Reverb()
    p.env = new p5.Env()
    p.noteLenght = p.floor(p.map(xPosition, 0, p.width, 1, 5))
    p.env.setRange(0.6, 0.0)
    p.env.setADSR(0.008, 0.2, 0.9, p.noteLenght)
    p.osc = new p5.SinOsc()
    p.freqInd = p.floor(p.map(yPosition, p.height, 0, 0, p.minScale.length))
    p.osc.freq(p.minScale[p.freqInd])
    p.osc.amp(p.env)
    p.osc.start()
    //reverb.process(osc, 10, 0.15)
    p.env.play()
  }

}

let drawP5 = new p5(sketch1, 'sketch-holder-draw')