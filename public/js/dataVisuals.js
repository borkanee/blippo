import { getRandom, getWeatherScale, getOscillatorType, createShape, OSCILLATOR_TYPE, SHAPE_TYPES } from './settings.js'

const sketch2 = new p5(function (p) {

    p.setup = function () {
        p.cnv = p.createCanvas(p.windowWidth, (p.windowHeight - document.querySelector('.navbar').offsetHeight))
        p.frameRate(30)

        p.reverb = new p5.Reverb()
        p.reverb.set(6, 2)

        p.objects = []

        p.frameRate(30)

        p.socket = io.connect('http://192.168.0.2:3000/')
        p.socket.on('weather-data', p.startDrawing)

        p.cities = document.querySelector('#city-weather')
        p.cities.addEventListener('selected', e => {
            p.socket.emit('new-city', e.detail.id)
        })
    }

    p.draw = function () {
        p.background(getRandom(245, 256), 10)

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
        p.clear()
        clearInterval(p.interval)

        let scale = getWeatherScale(data.weather[0].id)
        let oscillatorType = getOscillatorType(data.main.temp)
        let speed = p.map(data.wind.speed, 0, 10, 900, 250)
        let size = p.map(data.main.humidity, 1, 100, 20, 150)
        let revLevel = p.map(data.main.humidity, 0, 100, 0, 0)
        p.reverb.amp(revLevel)

        weatherInfo = [
            `${data.weather[0].main}`,
            `Wind Speed: ${data.wind.speed} meter/sec`,
            `Temp: ${data.main.temp} °C`,
            `Humidity: ${data.main.humidity}%`
        ]

        weatherInfo.forEach(element => {
            p.textSize(getRandom(30, 60))
            p.fill(getRandom(0, 256), getRandom(0, 256), getRandom(0, 256))
            p.text(element, getRandom(0, (p.width - 100)), getRandom(0, (p.height - 100)))
        })

        p.interval = setInterval(() => {
            if (p.objects.length > 50) { p.objects = [] }
            let x = getRandom(0, p.width)
            let y = getRandom(0, p.height)
            let noteLenght = p.map(p.mouseX, 0, p.width, 1, 4)
            let randomShape = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)]
            let color = p.color(getRandom(0, 256), getRandom(0, 256), getRandom(0, 256))
            let shape = createShape.call(p, randomShape, x, y, size, color, noteLenght)

            p.objects.push(shape)

            p.makeSound(x, y, noteLenght, scale, oscillatorType)
        }, speed)
    }

    p.makeSound = function (xPosition, yPosition, noteLenght, scale, oscillatorType) {
        let env = new p5.Env()
        let osc = new p5.Oscillator(oscillatorType)

        env.setADSR(0.008, 0.1, 0.1875, noteLenght)
        env.setRange(0.3, 0.0)

        let freqIndex = p.floor(p.map(yPosition, p.height, 0, 0, scale.length))

        osc.amp(env)
        osc.start()

        p.reverb.process(osc)

        osc.freq(scale[freqIndex])
        env.play()
    }
})