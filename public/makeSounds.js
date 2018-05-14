import './jscolor.js'
import { changeScale, createShape, PENTSCALE, MAJORSCALE, MINORSCALE } from './settings.js'

const sketch1 = new p5(function (p) {
  p.setup = function () {

    p.reverbSlider = p.select('#reverb')

    p.objects = []

    p.reverb = new p5.Reverb()
    p.reverb.set(6, 2)
    p.cnv = p.createCanvas(p.windowWidth, 700)
    p.cnv.mousePressed(p.drawShape)

    p.saveButton = p.select('#button-save')
    p.saveButton.mousePressed(p.saveFile)

    p.shapeColor = p.select('#shape-color')

    p.selOsc = p.select('#select-osc-draw')
    p.chosenOsc = p.selOsc.value()
    p.selOsc.changed(() => p.chosenOsc = p.selOsc.value())

    p.selShape = p.select('#select-shape')
    p.chosenShape = p.selShape.value()
    p.selShape.changed(() => p.chosenShape = p.selShape.value())

    p.scale = MAJORSCALE
    p.selectScale = p.select('#select-scale')
    p.selectScale.changed(changeScale.bind(this))

    p.socket = io.connect('http://localhost:3000/')
    p.socket.on('drawing', p.drawNew)

    p.recorder = new p5.SoundRecorder()
    p.recorder.setInput()
    p.soundFile = new p5.SoundFile()
    p.recorder.record(p.soundFile)
  }

  p.draw = function () {
    p.reverb.amp(p.reverbSlider.value())
    p.background(p.random(5, 15), 10)

    p.objects.forEach(shape => {
      if (shape.isPlaying) {
        shape.show()
        shape.move()
      }
    })
  }

  p.drawShape = function () {
    if (p.getAudioContext().state === 'suspended') {
      p.getAudioContext().resume()
    }

    let noteLenght = p.map(p.mouseX, 0, p.width, 1, 4)
    let size = 50

    let shape = createShape.call(p, p.chosenShape, p.mouseX, p.mouseY, size, '#' + p.shapeColor.value(), noteLenght)

    let socketData = {
      x: p.mouseX,
      y: p.mouseY,
      osc: p.chosenOsc,
      color: '#' + p.shapeColor.value(),
      noteLenght: noteLenght,
      chosenShape: p.chosenShape,
      size: size,
      scale: p.scale

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

    let shape = createShape.call(p, data.chosenShape, data.x, data.y, data.size, data.color, data.noteLenght)
    p.objects.push(shape)

    let osc = (data.osc == p.chosenOsc) ? p.chosenOsc : data.osc
    let scale = (data.scale == p.scale) ? p.scale : data.scale

    p.makeSound(data.y, data.x, data.noteLenght, osc, scale)
  }

  p.makeSound = function (yPosition, xPosition, noteLenght, chosenOsc = p.chosenOsc, scale = p.scale) {
    p.env = new p5.Env()
    p.env.setADSR(0.008, 0., 0.1875, noteLenght)
    p.env.setRange(0.3, 0.0)
    p.osc = new p5.Oscillator(chosenOsc)
    p.freqInd = p.floor(p.map(yPosition, p.height, 0, 0, scale.length))
    p.osc.amp(p.env)
    p.osc.start()
    p.reverb.process(p.osc)
    p.osc.freq(scale[p.freqInd])
    p.env.play()
  }

  p.saveFile = function () {
    p.recorder.stop()
    p.saveSound(p.soundFile, 'Our Song')
  }
}, 'sketch-holder-draw')

