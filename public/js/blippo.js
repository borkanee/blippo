// Visit https://p5js.org/ for more info about the P5-library

import './jscolor.js'
import { getRandom, changeScale, createShape, MAJORSCALE, changeBGColor, makeSound } from './settings.js'

/**
 * Sketch1 for playing. (P5 instance mode - https://github.com/processing/p5.js/wiki/Global-and-instance-mode)
 * 
 * @param {any} p - Sketch object witch attached p5-properties.
 */
const sketch1 = new p5(function (p) {
  p.setup = function () {
    //Frames per second
    p.frameRate(60)

    p.cnv = p.createCanvas(p.windowWidth, (p.windowHeight - document.querySelector('.navbar').offsetHeight))
    p.cnv.mouseClicked(p.drawShape)

    p.reverbSlider = document.querySelector('#reverb')
    p.shapeSizeSlider = document.querySelector('#shape-size')
    p.shapeColor = document.querySelector('.jscolor')
    p.selOscType = document.querySelector('#select-osc-draw')
    p.selShapeType = document.querySelector('#select-shape')
    p.selectScale = document.querySelector('#select-scale')
    p.activeColor = parseInt(document.querySelector('.btn-group .active .bg-color').value, 10)
    document.querySelectorAll('input[type=radio]').forEach(btn => {
      btn.onchange = changeBGColor.bind(this)
    })

    p.isMobileDevice = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);

    // Recording is only possible if NOT a mobile device.
    if (!p.isMobileDevice) {
      p.recorder = new p5.SoundRecorder()
      p.recorder.setInput()
      p.soundFile = new p5.SoundFile()
      p.recordButton = document.createElement('button')
      p.recordButton.textContent = 'START RECORDING'
      p.recIsVisible = false
    }

    p.objects = []
    p.synth = []
    p.voice = 0
    p.bgAlpha = 3


    // 32 voices (Emulating 4 players where each has one 8-voice polyphonic synth)
    for (let i = 0; i < 32; i++) {
      p.synth.push({
        env: new p5.Env(),
        osc: new p5.Oscillator()
      })
    }

    // Start oscillators
    p.synth.forEach(voice => {
      voice.osc.amp(0)
      voice.osc.start()
    })

    p.reverb = new p5.Reverb()
    p.reverb.set(6, 2)

    p.showingInfo = true
    p.isRecording = false

    p.scale = MAJORSCALE
    p.selectScale.addEventListener('change', changeScale.bind(this))

    p.socket = io.connect('http://192.168.0.2:3000/')
    p.socket.on('drawing', p.drawNew)

    p.showInfoText()
  }

  // Draw runs number of times set by framerate each second.
  p.draw = function () {
    p.reverb.amp(p.reverbSlider.valueAsNumber)
    p.background(getRandom(p.activeColor, p.activeColor + 5), p.bgAlpha)

    p.objects.forEach(shape => {
      if (shape.isPlaying) {
        shape.show()
        shape.move()
      }
    })
  }

  p.drawShape = function () {
    // Some browsers require to resume audiocontext before enabling audio.
    if (p.getAudioContext().state === 'suspended') {
      p.getAudioContext().resume()
    }
    // Add recording-button and listener if NOT already visible and if NOT a mobile device.
    if (!p.recIsVisible && !p.isMobileDevice) {
      document.querySelector('#record-container').appendChild(p.recordButton)
      p.recordButton.addEventListener('click', p.recordingHandler)
      p.recIsVisible = true
    }
    // Reset background and remove infotext.
    if (p.showingInfo) {
      let clearColor = p.activeColor == 6 ? 0 : 255
      p.background(clearColor)
      p.bgAlpha = 24
      p.showingInfo = false
    }

    // Function 'map' re-maps a number from one range to another. 
    let noteLenght = p.map(p.mouseX, 0, p.width, 1, 4)
    let size = p.shapeSizeSlider.valueAsNumber

    let color = {
      r: p.shapeColor.jscolor.rgb[0],
      g: p.shapeColor.jscolor.rgb[1],
      b: p.shapeColor.jscolor.rgb[2]
    }

    let shapeType = p.selShapeType.value
    let oscillatorType = p.selOscType.value

    let shape = createShape.call(p, shapeType, p.mouseX, p.mouseY, size, p.color(color.r, color.g, color.b), noteLenght)

    // Socket-data to send to other players.
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
    p.socket.emit('drawing', socketData)


    // Add shape to objects-array for animation and play sound.
    p.objects.push(shape)
    makeSound.call(p, p.mouseX, p.mouseY, noteLenght, oscillatorType, p.scale)
  }

  // Incoming socket.
  p.drawNew = function (data) {
    // Return if player hasn't started playing.
    if (p.getAudioContext().state === 'suspended' || p.showingInfo) {
      return
    }

    let x = p.map(data.x, 0, data.width, 0, p.width)
    let y = p.map(data.y, 0, data.height, 0, p.height)

    let shape = createShape.call(p, data.shapeType, x, y, data.size, p.color(data.color.r, data.color.g, data.color.b), data.noteLenght)
    p.objects.push(shape)

    makeSound.call(p, x, y, data.noteLenght, data.osc, data.scale)
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
      p.saveSound(p.soundFile, 'Blippo Song')
      p.recordButton.textContent = 'START RECORDING'
      p.recordButton.style.color = null
      return p.isRecording = false
    }
  }

  p.showInfoText = function () {
    let fontSize = 0.047 * p.width
    p.fill(getRandom(0, 256), getRandom(0, 256), getRandom(0, 256)).textSize(fontSize)
    p.textAlign(p.CENTER)
    p.text('PRESS ANYWHERE ON SCREEN TO START', (p.width / 2), (p.height / 2))
  }
}, 'blippo-container')