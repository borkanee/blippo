/**
 * Starting point.
 *
 * @author Boris Grubesic
 * @version 1.1.0
 */

const express = require('express')
const app = express()
const path = require('path')
const fetch = require('node-fetch')
const exphbs = require('express-handlebars')

const port = 3000

// Create server.
let server = require('http').createServer(app)
let io = require('socket.io')(server)

app.engine('hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main'
}))
app.set('view engine', 'hbs')


// Serve static files.
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/drawRoutes'))
app.use('/api/', require('./api/routes/cityRoutes'))

// Error handler.
app.use((err, req, res, next) => {
    if (req.app.get('env') !== 'development') {
        return res.status(500).sendFile(path.join(__dirname, 'views', 'error', '500.html'))
    }
    console.log(err)
})

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
