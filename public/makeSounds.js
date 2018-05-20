import './library/jscolor.js'
import { getRandom, changeScale, createShape, MAJORSCALE } from './settings.js'

const sketch1 = new p5(function (p) {
  p.setup = function () {

    let cnv = p.createCanvas(p.windowWidth, (p.windowHeight - document.querySelector('.navbar').offsetHeight))
    cnv.mouseClicked(p.drawShape)
    cnv.touchEnded(p.draw)

    p.reverbSlider = document.querySelector('#reverb')
    p.shapeSizeSlider = document.querySelector('#shape-size')
    p.shapeColor = document.querySelector('.jscolor')

    p.selOscType = document.querySelector('#select-osc-draw')
    p.selShapeType = document.querySelector('#select-shape')
    p.selectScale = document.querySelector('#select-scale')

    p.isMobileDevice = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);

    console.log(p.isMobileDevice)
    if (!p.isMobileDevice) {
      p.recordButton = document.createElement('button')
      p.recordButton.textContent = 'START RECORDING'
      p.recordButton.style.width = '240px'
      p.recIsVisible = false
    }

    p.objects = []

    p.reverb = new p5.Reverb()
    p.reverb.set(6, 2)

    p.isRecording = false

    p.scale = MAJORSCALE
    p.selectScale.addEventListener('change', changeScale.bind(this))

    p.socket = io.connect('http://192.168.0.2:3000/')
    p.socket.on('drawing', p.drawNew)

    p.recorder = new p5.SoundRecorder()
    p.recorder.setInput()
    p.soundFile = new p5.SoundFile()
  }

  p.draw = function () {
    p.background(getRandom(245, 256), 10)
    p.reverb.amp(p.reverbSlider.valueAsNumber)

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
    if (!p.recIsVisible && !p.isMobileDevice) {
      document.querySelector('#nav-container').insertBefore(p.recordButton, document.querySelector('.navbar-toggler'))
      p.recordButton.addEventListener('click', p.recordingHandler)
      p.recIsVisible = true
    }
    let noteLenght = p.map(p.mouseX, 0, p.width, 1, 4)
    let size = p.shapeSizeSlider.valueAsNumber

    let color = {
      r: p.shapeColor.jscolor.rgb[0],
      g: p.shapeColor.jscolor.rgb[1],
      b: p.shapeColor.jscolor.rgb[2],
      alpha: getRandom(0, 256)
    }

    let shapeType = p.selShapeType.value
    let oscillatorType = p.selOscType.value

    let shape = createShape.call(p, shapeType, p.mouseX, p.mouseY, size, p.color(color.r, color.g, color.b, color.alpha), noteLenght)

    let socketData = {
      width: p.width,
      height: p.height,
      x: p.mouseX,
      y: p.mouseY,
      osc: oscillatorType,
      color: color,
      noteLenght: noteLenght,
      shapeType: shapeType,
      size: size,
      scale: p.scale
    }
    p.objects.push(shape)
    p.socket.emit('drawing', socketData)

    p.makeSound(p.mouseY, p.mouseX, noteLenght, oscillatorType, p.scale)
  }

  // Incoming socket.
  p.drawNew = function (data) {
    if (p.getAudioContext().state === 'suspended') {
      p.getAudioContext().resume()
    }

    let x = p.map(data.x, 0, data.width, 0, p.width)
    let y = p.map(data.y, 0, data.height, 0, p.height)

    let shape = createShape.call(p, data.shapeType, x, y, data.size, p.color(data.color.r, data.color.g, data.color.b, data.color.alpha), data.noteLenght)
    p.objects.push(shape)

    p.makeSound(data.y, data.x, data.noteLenght, data.osc, data.scale)
  }

  p.makeSound = function (yPosition, xPosition, noteLenght, oscillatorType, scale) {
    let env = new p5.Env()
    let osc = new p5.Oscillator(oscillatorType)

    env.setADSR(0.008, 0, 0.1, noteLenght)
    env.setRange(0.2, 0.0)

    let freqIndex = p.floor(p.map(yPosition, p.height, 0, 0, scale.length))

    osc.amp(env)
    osc.start()

    p.reverb.process(osc)

    osc.freq(scale[freqIndex])
    env.play()
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
      p.saveSound(p.soundFile, 'Sketch Song')
      p.recordButton.textContent = 'START RECORDING'
      p.recordButton.style.color = null
      return p.isRecording = false
    }
  }
})