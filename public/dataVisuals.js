import './city-selector.js'
import { Circle, Rectangle, Triangle } from './shapeClasses.js'
import { getWeatherScale, changeScale, createShape, PENTSCALE, MAJORSCALE, MINORSCALE } from './settings.js'

const sketch2 = new p5(function (p) {

    p.setup = function () {
        p.createCanvas(p.windowWidth, 700)

        p.reverbSlider = p.select('#reverb')

        p.reverb = new p5.Reverb()
        p.reverb.set(6, 2)

        p.objects = []
        p.shapes = ['circle', 'rectangle', 'triangle']


        p.socket = io.connect('http://localhost:3000/')
        p.socket.on('weather-data', p.startDrawing)

        p.selOsc = p.select('#select-osc-draw')
        p.chosenOsc = p.selOsc.value()
        p.selOsc.changed(() => p.chosenOsc = p.selOsc.value())

        p.cities = document.querySelector('#city-weather')
        p.cities.addEventListener('selected', e => {
            p.socket.emit('new-city', e.detail.id)
        })
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

    p.startDrawing = function (data) {
        if (p.getAudioContext().state === 'suspended') {
            p.getAudioContext().resume()
        }
        if (p.interval) {
            clearInterval(p.interval)
        }
        
        p.scale = getWeatherScale(data.weather[0].id)
        p.speed = data.wind.speed * 100
        p.interval = setInterval(() => {
            let x = p.random(0, p.width)
            let y = p.random(0, p.height)
            let size = 50
            let noteLenght = p.map(p.mouseX, 0, p.width, 1, 4)
            let randomShape = p.shapes[Math.floor(Math.random() * p.shapes.length)]
            let color = p.color(p.random(0, 256), p.random(0, 256), p.random(0, 256), p.random(0, 256))
            let shape = createShape.call(p, randomShape, x, y, size, color, noteLenght)
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
        p.osc.amp(p.env)
        p.osc.start()
        p.reverb.process(p.osc)
        p.osc.freq(p.scale[p.freqInd])
        p.env.play()
    }
}, 'sketch-holder-data')