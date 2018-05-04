import './city-selector.js'
import { Circle, Rectangle, Triangle } from './shapeClasses.js'
import { changeScale, createShapeObj, pentScale, majorScale, minScale } from './settings.js'

const sketch2 = new p5(function (p) {

    p.setup = function () {
        p.createCanvas(p.windowWidth, 700)

        p.objects = []

        p.socket = io.connect('http://localhost:3000/')
        p.socket.on('weather-data', p.startDrawing)

        p.selShape = p.select('#select-shape')
        p.chosenShape = p.selShape.value()
        p.selShape.changed(() => p.chosenShape = p.selShape.value())

        p.selOsc = p.select('#select-osc-draw')
        p.chosenOsc = p.selOsc.value()
        p.selOsc.changed(() => p.chosenOsc = p.selOsc.value())

        p.scale = majorScale
        p.selScale = p.select('#select-scale-data')
        p.selScale.changed(changeScale.bind(this))

        p.cities = document.querySelector('#city-weather')
        p.cities.addEventListener('selected', e => {
            p.socket.emit('new-city', e.detail.id)
        })
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

    p.startDrawing = function (data) {
        if (p.getAudioContext().state === 'suspended') {
            p.getAudioContext().resume()
        }
        if (p.interval) {
            clearInterval(p.interval)
        }
        p.speed = data.wind.speed * 100
        p.interval = setInterval(() => {
            let x = p.random(0, p.width)
            let y = p.random(0, p.height)
            let noteLenght = p.map(p.mouseX, 0, p.width, 1, 4)
            let color = p.color(p.random(0, 256), p.random(0, 256), p.random(0, 256))
            let shape = createShapeObj.call(p, p.chosenShape, x, y, color, noteLenght)
            p.objects.push(shape)
            p.makeSound(y, x, noteLenght)
        }, p.speed)
    }

    p.makeSound = function (yPosition, xPosition, noteLenght) {
        p.env = new p5.Env()
        p.env.setADSR(0.008, 0.2, 0.3, noteLenght)
        p.env.setRange(0.5, 0.0)
        p.osc = new p5.Oscillator(p.chosenOsc)
        p.freqInd = p.floor(p.map(yPosition, p.height, 0, 0, p.scale.length))
        p.osc.freq(p.scale[p.freqInd])
        p.osc.amp(p.env)
        p.osc.start()
        p.env.play()
    }
}, 'sketch-holder-data')