import './city-selector.js'
import { Circle, Rectangle, Triangle } from './shapeClasses.js'
import { getWeatherScale, getOscillatorType, createShape, OSCILLATOR_TYPE, SHAPE_TYPES } from './settings.js'

const sketch2 = new p5(function (p) {

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight)

        p.reverb = new p5.Reverb()
        p.reverb.set(6, 2)

        p.objects = []

        p.socket = io.connect('http://localhost:3000/')
        p.socket.on('weather-data', p.startDrawing)

        p.cities = document.querySelector('#city-weather')
        p.cities.addEventListener('selected', e => {
            p.socket.emit('new-city', e.detail.id)
        })
    }

    p.draw = function () {
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

        p.objects = []
        p.clear()
        clearInterval(p.interval)

        let scale = getWeatherScale(data.weather[0].id)
        let oscillatorType = getOscillatorType(data.main.temp)
        let speed = p.map(data.wind.speed, 0, 10, 900, 250)
        console.log(speed, data.wind.speed)
        let size = p.map(data.main.humidity, 1, 100, 20, 150)
        console.log(data)
        let revLevel = p.map(data.main.humidity, 0, 100, 0, 4)

        p.reverb.amp(revLevel)
        console.log(revLevel)

        p.interval = setInterval(() => {
            if (p.objects.length > 100) { p.objects = [] }
            let x = p.random(0, p.width)
            let y = p.random(0, p.height)
            let noteLenght = p.map(p.mouseX, 0, p.width, 1, 4)
            let randomShape = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)]
            let color = p.color(p.random(0, 256), p.random(0, 256), p.random(0, 256), p.random(0, 256))
            let shape = createShape.call(p, randomShape, x, y, size, color, noteLenght)

            p.objects.push(shape)

            p.makeSound(y, x, noteLenght, scale, oscillatorType)
        }, speed)
    }

    p.makeSound = function (yPosition, xPosition, noteLenght, scale, oscillatorType) {
        let env = new p5.Env()
        let osc = new p5.Oscillator(oscillatorType)

        env.setADSR(0.008, 0.2, 0.3, noteLenght)
        env.setRange(0.5, 0.0)

        let freqIndex = p.floor(p.map(yPosition, p.height, 0, 0, scale.length))

        osc.amp(env)
        osc.start()

        p.reverb.process(osc)

        osc.freq(scale[freqIndex])
        env.play()
    }
}, 'sketch-holder-data')