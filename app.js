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
const fetch = require('node-fetch')

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

    socket.on('new-city', getWeather)

    async function getWeather(data) {
        let weather = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${data}&units=metric&APPID=80066155d35cbe90d3edf0ce056c6cfe`)
        let json = await weather.json()

        socket.emit('weather-data', json)
    }
})

function uploadSound(data) {
    let array = fs.readdirSync('./songs', (err, files) => {
        if (err) {
            console.log(error)
        }
        return files
    })

    fs.writeFile(`./songs/Sketch${array.length}.wav`, data, (err) => {
        if (err) throw err
        console.log('saved')
    })
}

// Listen.
server.listen(port)
