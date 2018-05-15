// Module for settings.
import { Circle, Rectangle, Triangle } from './shapeClasses.js'

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

export const PENTSCALE = [
    130.81, 146.83, 164.81, 196.00, 220.00,
    261.63, 293.66, 329.63, 392.00, 440.00, 523.25
]

export const MAJORSCALE = [
    130.81, 146.83, 164.81, 174.61, 196.00, 220.00,
    246.94, 261.63, 293.66, 329.63, 349.23, 392.00,
    440.00, 493.88, 523.25
]

export const MINORSCALE = [130.81, 146.83, 155.56, 174.61, 196.00, 207.65, 233.08, 261.63,
    293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25]

export const SHAPE_TYPES = Object.freeze([
    'circle',
    'rectangle',
    'triangle'
])

export const OSCILLATOR_TYPE = Object.freeze({
    SINE: 'sine',
    TRIANGLE: 'triangle',
    SAWTOOTH: 'sawtooth',
    SQUARE: 'square'
})

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


