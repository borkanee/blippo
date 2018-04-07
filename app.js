/**
 * Starting point.
 *
 * @author Boris Grubesic
 * @version 1.1.0
 */

const express = require('express')
const app = express()
const path = require('path')
const port = 3000
const fs = require("fs")
const WavEncoder = require("wav-encoder")

// Create server.
let server = require('http').createServer(app)
let io = require('socket.io')(server)

// Serve static files.
app.use(express.static(path.join(__dirname, 'public')))


io.on('connection', function (socket) {
    socket.on('drawing', drawMsg)

    function drawMsg(data) {
        socket.broadcast.emit('drawing', data)
    }

    socket.on('newSound', uploadSound)
})

function uploadSound(data) {
    console.log(typeof data.channel1)
    let whiteNoise1sec = {
        sampleRate: 44100,
        channelData: [
            data.channel1,
            data.channel2
        ]
    }
    WavEncoder.encode(whiteNoise1sec).then(buffer => {
        fs.writeFileSync("noise.wav", new Buffer(buffer));
    });
}

// Listen.
server.listen(port)
