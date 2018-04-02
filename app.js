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
})

// Listen.
server.listen(port)
