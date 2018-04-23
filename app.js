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
const exphbs = require('express-handlebars')

// Create server.
let server = require('http').createServer(app)
let io = require('socket.io')(server)

// Serve static files.
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
    return res.sendFile(path.join(__dirname, 'views', 'sketches', 'sketch1.html'))
})

app.get('/weather-music', function (req, res) {
    return res.sendFile(path.join(__dirname, 'views', 'sketches', 'sketch2.html'))
})

app.use('/api/cities', require('./api/routes/cityRoutes'))

io.on('connection', function (socket) {
    socket.on('drawing', drawMsg)

    function drawMsg(data) {
        socket.broadcast.emit('drawing', data)
    }

    socket.on('new-city', getWeather)

    async function getWeather(id) {
        let selectedCity = await fetch(`http://api.openweathermap.org/data/2.5/weather?id=${id}&units=metric&APPID=80066155d35cbe90d3edf0ce056c6cfe`)
        selectedCity = await selectedCity.json()

        socket.emit('weather-data', selectedCity)
    }
})

// Listen.
server.listen(port)
