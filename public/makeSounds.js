import './jscolor.js'
import { changeScale, createShape, MAJORSCALE } from './settings.js'

const sketch1 = new p5(function (p) {
  p.setup = function () {

    $('[data-toggle="tooltip"]').tooltip()

    p.cnv = p.createCanvas(p.windowWidth, p.windowHeight - document.querySelector('.navbar').offsetHeight)
    p.cnv.mousePressed(p.drawShape)

    p.reverbSlider = p.select('#reverb')
    p.shapeSizeSlider = p.select('#shape-size')
    p.shapeColor = p.select('#shape-color')
    p.selOsc = p.select('#select-osc-draw')
    p.selShape = p.select('#select-shape')
    p.selectScale = p.select('#select-scale')

    p.recordButton = document.createElement('button')
    p.recordButton.textContent = 'START RECORDING'
    p.recButton = false

    p.objects = []

    p.reverb = new p5.Reverb()
    p.reverb.set(6, 2)

    p.isRecording = false

    p.chosenOsc = p.selOsc.value()
    p.selOsc.changed(() => p.chosenOsc = p.selOsc.value())

    p.chosenShape = p.selShape.value()
    p.selShape.changed(() => p.chosenShape = p.selShape.value())

    p.scale = MAJORSCALE

    p.selectScale.changed(changeScale.bind(this))

    p.socket = io.connect('http://localhost:3000/')
    p.socket.on('drawing', p.drawNew)

    p.recorder = new p5.SoundRecorder()
    p.recorder.setInput()
    p.soundFile = new p5.SoundFile()
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
    if (!p.recButton) {
      document.querySelector('#nav-container').insertBefore(p.recordButton, document.querySelector('.navbar-toggler'))
      p.recordButton.addEventListener('click', p.recordingHandler)
      p.recButton = true
    }

    let noteLenght = p.map(p.mouseX, 0, p.width, 1, 4)
    let size = p.shapeSizeSlider.value()
    let color = p.color('#' + p.shapeColor.value())

    let shape = createShape.call(p, p.chosenShape, p.mouseX, p.mouseY, size, color, noteLenght)

    let socketData = {
      x: p.mouseX,
      y: p.mouseY,
      osc: p.chosenOsc,
      color: color,
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

  p.recordingHandler = function () {
    if (!p.isRecording) {
      p.recorder.record(p.soundFile)
      p.recordButton.textContent = 'STOP RECORDING & SAVE'
      p.recordButton.style.color = 'red'
      return p.isRecording = true

    }

    if (p.isRecording) {
      p.recorder.stop()
      p.saveSound(p.soundFile, 'Our Song')
      p.recordButton.textContent = 'START RECORDING'
      p.recordButton.style.color = null
      return p.isRecording = false
    }
  }
}, 'sketch-holder-draw')

