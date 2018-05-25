var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        let parentElement = document.getElementById(id);
        let sketch1 = parentElement.querySelector('#blippo-container')
        let sketch2 = parentElement.querySelector('#blippo-weather-container')

        parentElement.querySelector('#go-weather').addEventListener('click', () => {
            sketch1.style.display = 'none'
            sketch2.style.display = 'block'
        })

        parentElement.querySelector('#go-play').addEventListener('click', () => {
            sketch2.style.display = 'none'
            sketch1.style.display = 'block'
        })
    }
}

app.initialize()