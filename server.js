/**
 *
 * @author Boris Grubesic
 * @version 1.1.0
 */

const express = require('express')
const app = express()
const path = require('path')
const fetch = require('node-fetch')
const exphbs = require('express-handlebars')
const helmet = require('helmet')
const cors = require('cors')

const port = 3000

// Create server.
let server = require('http').createServer(app)
let io = require('socket.io')(server)

app.use(helmet())

// Content Security Policy
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'", 'blob:'],
        scriptSrc: ["'self'", 'blob:',
            'https://code.jquery.com/jquery-3.3.1.slim.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js',
            'https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/p5.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/addons/p5.dom.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/addons/p5.sound.min.js',
            "'sha256-sjOT6r+ACDi5AMyj6GjkLRiUvHZjGCfShvEI/GQPiKY='"],
        styleSrc: ["'self'", 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css', "'sha256-F5naBEyqgjOmK7/p7nmihRZPF9n/f9XJshmPPOJeot4='"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", 'ws://192.168.0.2:3000/']
    }
}))

// Helpers load scripts necessary for each sketch.
app.engine('hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
}))

app.set('view engine', 'hbs')

// Allow PhoneGap-app to access API.
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://192.168.0.2:8000');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', false);

    next()
})

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

// Socket...
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
