// Module for settings.

import { Circle, Rectangle, Triangle } from './shapeClasses.js'

/**
 * Function changes scale depending on select-value.
 * 
 * @export
 * @param {any} e - event
 */
export function changeScale(e) {
    if (e.target.value == 'major') {
        this.scale = MAJORSCALE
    }
    if (e.target.value == 'minor') {
        this.scale = MINORSCALE
    }
    if (e.target.value == 'pentatonic') {
        this.scale = PENTSCALE
    }
}

/**
 * Function creates different P5-shapes depending on str-value.
 * 
 * @export
 * @param {string} str - String representing shapetype.
 * @param {number} xPos - xPosition of mouse
 * @param {number} yPos - yPosition of mouse
 * @param {number} size - shape size
 * @param {object} color - P5-color object
 * @param {number} noteLenght 
 * @returns {object} - A new shape (Circle, Rectangle or Triangle)
 */
export function createShape(str, xPos, yPos, size, color, noteLenght) {
    switch (str) {
        case 'circle':
            return new Circle(xPos, yPos, size, color, noteLenght, this)
        case 'rectangle':
            return new Rectangle(xPos, yPos, size, size, color, noteLenght, this)
        case 'triangle':
            return new Triangle(xPos, yPos, size, color, noteLenght, this)
    }
}

// 2-octave Pentatonic scale
const PENTSCALE = [
    130.81, 146.83, 164.81, 196.00, 220.00,
    261.63, 293.66, 329.63, 392.00, 440.00, 523.25
]

// 2-octave Minor scale
const MINORSCALE = [130.81, 146.83, 155.56, 174.61, 196.00, 207.65, 233.08, 261.63,
    293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25
]

// Oscillator types
const OSCILLATOR_TYPE = Object.freeze({
    SINE: 'sine',
    TRIANGLE: 'triangle',
    SAWTOOTH: 'sawtooth',
    SQUARE: 'square'
})

// 2-octave Major scale (DEFAULT)
export const MAJORSCALE = [
    130.81, 146.83, 164.81, 174.61, 196.00, 220.00,
    246.94, 261.63, 293.66, 329.63, 349.23, 392.00,
    440.00, 493.88, 523.25
]

// Enum representing different shape types.
export const SHAPE_TYPES = Object.freeze([
    'circle',
    'rectangle',
    'triangle'
])



/**
 * Function returns oscillator type based on temperature in a city.
 * 
 * @export
 * @param {number} temp - Temperature
 * @returns {string} - String representing oscillator type.
 */
export function getOscillatorType(temp) {

    if (temp > 20) {
        return OSCILLATOR_TYPE.SINE
    }
    if (temp < 20 && temp > 0) {
        return OSCILLATOR_TYPE.TRIANGLE
    }
    if (temp < 0 && temp > -20) {
        return OSCILLATOR_TYPE.SAWTOOTH
    }
    if (temp < -20) {
        return OSCILLATOR_TYPE.SQUARE

    }
}

/**
 * Function changes background color.
 * 
 * @export
 * @param {ChangeEvent} e - event
 */
export function changeBGColor(e) {
    if (e.target.value == '6') {
        this.background(0)
    } if (e.target.value == '250') {
        this.background(255)
    }
    this.activeColor = parseInt(e.target.value, 10)
}


/**
 * Function 
 * 
 * @export
 * @param {number} weatherID - Weather condition code. (https://openweathermap.org/weather-conditions)
 * @returns {number[]} - Returns array with frequencies.
 */
export function getWeatherScale(weatherID) {
    switch (weatherID) {
        case 200:
        case 201:
        case 202:
        case 210:
        case 211:
        case 212:
        case 221:
        case 230:
        case 231:
        case 232:
        case 300:
        case 301:
        case 302:
        case 310:
        case 311:
        case 312:
        case 313:
        case 314:
        case 321:
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
        case 511:
        case 520:
        case 521:
        case 522:
        case 531:
        case 803:
        case 804:
        case 762:
        case 781:
            return MINORSCALE
            break
        case 600:
        case 601:
        case 602:
        case 611:
        case 612:
        case 620:
        case 621:
        case 622:
        case 701:
        case 711:
        case 721:
        case 731:
        case 741:
        case 751:
        case 761:
        case 771:
            return PENTSCALE
            break
        case 801:
        case 802:
        case 800:
            return MAJORSCALE
            break
        default:
            return PENTSCALE
            break
    }
}

/**
 * Function adjusts oscillator and envelope-settings.
 * 
 * @export
 * @param {number} xPosition 
 * @param {number} yPosition 
 * @param {number} noteLenght 
 * @param {string} oscillatorType 
 * @param {number[]} scale 
 */
export function makeSound(xPosition, yPosition, noteLenght, oscillatorType, scale) {
    if (this.voice > 31) {
        this.voice = 0
    }

    this.synth[this.voice].env.setRange(1, 0.0)
    this.synth[this.voice].env.setADSR(0.01, 0, 0.25, noteLenght)

    let freqIndex = this.floor(this.map(yPosition, this.height, 0, 0, scale.length))
    this.synth[this.voice].osc.setType(oscillatorType)
    this.synth[this.voice].osc.amp(this.synth[this.voice].env)
    this.synth[this.voice].osc.start()
    this.reverb.process(this.synth[this.voice].osc)
    this.synth[this.voice].osc.freq(scale[freqIndex])
    this.synth[this.voice].env.play()

    this.voice++
}


/**
 * Function returns random number between min and max.
 * 
 * @export
 * @param {number} min 
 * @param {number} max 
 * @returns {number} 
 */
export function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
