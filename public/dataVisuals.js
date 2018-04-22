let sketch2 = function (p) {
    // Setup for canvas
    p.setup = function () {

        p.createCanvas(700, 700)
        p.background("white")

        p.socket = io.connect('http://localhost:3000/')
        p.socket.on('weather-data', p.startDrawing)

        p.scale = majorScale
        p.selScale = p.select('#select-scale-data')
        p.selScale.changed(p.changeScale)

        p.selCity = p.select('#select-city')
        p.selCity.changed(() => p.socket.emit('new-city', p.selCity.value()))
    }

    p.startDrawing = function (data) {
        if (p.interval) {
            clearInterval(p.interval)
        }
        p.speed = data.wind.speed * 200
        p.interval = setInterval(() => {
            let x = p.random(0, p.width)
            let y = p.random(0, p.height)
            p.noStroke()
            p.fill(p.random(0, 256), p.random(0, 256), p.random(0, 256), 70)
            p.ellipse(x, y, data.coord.lon, data.coord.lat)
            p.makeSound(y, x)
        }, p.speed)
    }

    p.changeScale = function () {
        if (p.selScale.value() == "major") {
            console.log('major')
            p.scale = majorScale
        }
        if (p.selScale.value() == "minor") {
            console.log('minor')
            p.scale = minScale
        }
        if (p.selScale.value() == "pentatonic") {
            console.log('penta')
            p.scale = pentScale
        }
    }
    p.makeSound = function (yPosition, xPosition) {
        // let reverb = new p5.Reverb()
        p.env = new p5.Env()
        p.noteLenght = p.floor(p.map(xPosition, 0, p.width, 1, 5))
        p.env.setRange(0.5, 0.0)
        p.env.setADSR(0.008, 0.2, 0.9, p.noteLenght)
        p.osc = new p5.SinOsc()
        p.freqInd = p.floor(p.map(yPosition, p.height, 0, 0, p.scale.length))
        p.osc.freq(p.scale[p.freqInd])
        p.osc.amp(p.env)
        p.osc.start()
        // reverb.process(osc, 10, 0.15)
        p.env.play()
    }
}


let DataSketch = new p5(sketch2, 'sketch-holder-data')