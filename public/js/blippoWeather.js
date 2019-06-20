// Visit https://p5js.org/ for more info about the P5-library

import { getRandom, getWeatherScale, getOscillatorType, createShape, SHAPE_TYPES, changeBGColor, makeSound } from './settings.js'
import { config } from './config.js'

/**
 * Sketch2 for weather-sketch (P5 instance mode - https://github.com/processing/p5.js/wiki/Global-and-instance-mode)
 * 
 * @param {any} p - Sketch object witch attached p5-properties.
 * 
 */
const sketch2 = new p5(function (p) {
    p.setup = function () {
        p.cnv = p.createCanvas(p.windowWidth, (p.windowHeight - document.querySelector('.navbar').offsetHeight))
        p.frameRate(60)

        p.socket = io.connect(config.BASE_URL)

        p.reverb = new p5.Reverb()
        p.reverb.set(6, 2)

        p.objects = []
        p.synth = []
        p.voice = 0


        // Create 32 voices.
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

        p.activeColor = parseInt(document.querySelector('.btn-group .active .bg-color').value, 10)
        document.querySelectorAll('input[type=radio]').forEach(btn => {
            btn.onchange = changeBGColor.bind(this)
        })

        p.cities = document.querySelector('#city-weather')
        p.cities.addEventListener('selected', e => {
            p.socket.emit('new-city', e.detail.id)
        })

        p.socket.on('weather-data', p.startDrawing)
    }

    p.draw = function () {
        p.background(getRandom(p.activeColor, p.activeColor + 5), 24)

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

        let weatherInfo = []
        p.objects = []
        clearInterval(p.interval)
        let clearColor = p.activeColor == 6 ? 0 : 255
        p.background(clearColor)

        // Map weather-data to different variables used for creating shapes and playing music.
        let scale = getWeatherScale(data.weather[0].id)
        let oscillatorType = getOscillatorType(data.main.temp)
        let speed = p.map(data.wind.speed, 0, 10, 900, 250)
        let size = p.map(data.main.humidity, 1, 100, 20, 150)
        let revLevel = p.map(data.main.humidity, 0, 100, 0, 4)
        p.reverb.amp(revLevel)

        weatherInfo = [
            `${data.weather[0].main.toUpperCase()}`,
            `WIND SPEED: ${data.wind.speed} METER/SEC`,
            `TEMP: ${data.main.temp} °C`,
            `HUMIDITY: ${data.main.humidity}%`
        ]
        // Display weather-data on screen before music starts. 
        weatherInfo.forEach(text => {
            p.textSize((getRandom(0.025, 0.05)) * p.width)
            p.fill(getRandom(0, 256), getRandom(0, 256), getRandom(0, 256))
            p.text(text, getRandom(0, 0.5 * p.width), getRandom(0, 0.9 * p.height))
        })

        p.interval = setInterval(() => {
            if (p.objects.length > 100) { p.objects = [] }
            let x = getRandom(0, p.width)
            let y = getRandom(0, p.height)
            let noteLenght = p.map(p.mouseX, 0, p.width, 1, 4)
            let randomShape = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)]
            let color = p.color(getRandom(0, 256), getRandom(0, 256), getRandom(0, 256))
            let shape = createShape.call(p, randomShape, x, y, size, color, noteLenght)

            p.objects.push(shape)

            makeSound.call(p, x, y, noteLenght, oscillatorType, scale)
        }, speed)
    }
}, 'blippo-weather-container')