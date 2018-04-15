let sketch2 = function (p) {
    p.pentScale = [
        130.81, 146.83, 164.81, 196.00, 220.00,
        261.63, 293.66, 329.63, 392.00, 440.00, 523.25
    ]

    p.majorScale = [
        130.81, 146.83, 164.81, 174.61, 196.00, 220.00,
        246.94, 261.63, 293.66, 329.63, 349.23, 392.00,
        440.00, 493.88, 523.25
    ]

    p.minScale = [130.81, 146.83, 155.56, 174.61, 196.00, 207.65, 233.08, 261.63,
        293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25]


    // Setup for canvas
    p.setup = function () {

        p.createCanvas(700, 700)
        p.background("white")

        p.socket = io.connect('http://localhost:3000/')
        p.socket.on('weather-data', p.startDrawing)

        p.sel = p.select('#select-city')
        p.sel.changed(() => p.socket.emit('new-city', p.sel.value()))
    }

    p.startDrawing = function (data) {
        if (p.interval) {
            clearInterval(p.interval)
        }
        console.log(data)
        p.speed = data.wind.speed * 100
        p.interval = setInterval(() => {
            p.timer = true
            let x = p.random(0, p.width)
            let y = p.random(0, p.height)
            p.noStroke()
            p.fill(p.random(0, 256), p.random(0, 256), p.random(0, 256), 70)
            p.ellipse(x, y, data.coord.lon, data.coord.lat)
            p.makeSound(y, x)
        }, p.speed)
    }
    p.makeSound = function (yPosition, xPosition) {
        // let reverb = new p5.Reverb()
        p.env = new p5.Env()
        p.noteLenght = p.floor(p.map(xPosition, 0, p.width, 1, 5))
        p.env.setRange(0.5, 0.0)
        p.env.setADSR(0.008, 0.2, 0.9, p.noteLenght)
        p.osc = new p5.SinOsc()
        p.freqInd = p.floor(p.map(yPosition, p.height, 0, 0, p.pentScale.length))
        p.osc.freq(p.pentScale[p.freqInd])
        p.osc.amp(p.env)
        p.osc.start()
        // reverb.process(osc, 10, 0.15)
        p.env.play()
    }
}


let DataSketch = new p5(sketch2, 'sketch-holder-data')