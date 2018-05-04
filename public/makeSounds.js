import './jscolor.js'
import { changeScale, createShapeObj, pentScale, majorScale, minScale } from './settings.js'

const sketch1 = new p5(function (p) {
  p.setup = function () {

    p.objects = []

    p.reverb = new p5.Reverb()
    p.reverb.set(8, 1)
    p.cnv = p.createCanvas(p.windowWidth, 700)
    p.cnv.mousePressed(p.drawShape)

    p.button = p.select('#button-save')
    p.button.mousePressed(p.saveFile)

    p.shapeColor = p.select('#shape-color')

    p.selOsc = p.select('#select-osc-draw')
    p.chosenOsc = p.selOsc.value()
    p.selOsc.changed(() => p.chosenOsc = p.selOsc.value())


    p.selShape = p.select('#select-shape')
    p.chosenShape = p.selShape.value()
    p.selShape.changed(() => p.chosenShape = p.selShape.value())

    p.scale = majorScale
    p.sel = p.select('#select-scale')

    p.sel.changed(changeScale.bind(this))

    p.socket = io.connect('http://localhost:3000/')
    p.socket.on('drawing', p.drawNew)

    p.recorder = new p5.SoundRecorder()
    p.recorder.setInput()
    p.soundFile = new p5.SoundFile()
    p.recorder.record(p.soundFile)
  }

  p.draw = function () {
    p.background(p.random(5, 15), 10)

    for (let object of p.objects) {
      if (object.value > 0.1) {
        object.show()
        object.move()
      }
    }
  }

  p.drawShape = function () {
    if (p.getAudioContext().state === 'suspended') {
      p.getAudioContext().resume()
    }

    let noteLenght = p.map(p.mouseX, 0, p.width, 1, 4)

    let shape = createShapeObj.call(p, p.chosenShape, p.mouseX, p.mouseY, '#' + p.shapeColor.value(), noteLenght)

    let socketData = {
      x: p.mouseX,
      y: p.mouseY,
      osc: p.chosenOsc,
      color: '#' + p.shapeColor.value(),
      noteLenght: noteLenght,
      chosenShape: p.chosenShape
    }

    p.socket.emit('drawing', socketData)
    p.objects.push(shape)

    p.makeSound(p.mouseY, p.mouseX, noteLenght)

  }

  // Incoming socket.
  p.drawNew = function (data) {
    if (p.getAudioContext().state === 'suspended') {
      p.getAudioContext().resume()
    }

    let shape = createShapeObj(data.chosenShape, data.x, data.y, data.color, data.noteLenght)
    p.objects.push(shape)

    let osc

    if (data.osc == p.chosenOsc) {
      osc = p.chosenOsc
    } else {
      osc = data.osc
    }

    p.makeSound(data.y, data.x, data.noteLenght, osc)
  }

  p.makeSound = function (yPosition, xPosition, noteLenght, chosenOsc = p.chosenOsc) {
    p.env = new p5.Env()
    p.env.setADSR(0.008, 0.2, 0.25, noteLenght)
    p.env.setRange(0.4, 0.0)
    p.osc = new p5.Oscillator(chosenOsc)
    p.freqInd = p.floor(p.map(yPosition, p.height, 0, 0, p.scale.length))
    p.osc.amp(p.env)
    p.osc.start()
    //p.reverb.process(p.osc)
    //p.reverb.amp(1)
    p.osc.freq(p.scale[p.freqInd])
    p.env.play()
  }

  p.saveFile = function () {
    p.recorder.stop()
    p.saveSound(p.soundFile, 'Our Song')
  }
}, 'sketch-holder-draw')

