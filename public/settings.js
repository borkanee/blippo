// Module for settings.
import { Circle, Rectangle, Triangle } from './shapeClasses.js'

export function changeScale(e) {
    if (e.target.value == 'major') {
        this.scale = majorScale
    }
    if (e.target.value == 'minor') {
        this.scale = minScale
    }
    if (e.target.value == 'pentatonic') {
        this.scale = pentScale
    }
}

export function createShapeObj(str, xPos, yPos, color, noteLenght) {
    switch (str) {
        case 'circle':
            return new Circle(xPos, yPos, 50, color, noteLenght, this)
        case 'rectangle':
            return new Rectangle(xPos, yPos, 50, 50, color, noteLenght, this)
        case 'triangle':
            return new Triangle(xPos, yPos, 50, color, noteLenght, this)
    }
}

export const pentScale = [
    130.81, 146.83, 164.81, 196.00, 220.00,
    261.63, 293.66, 329.63, 392.00, 440.00, 523.25
]

export const majorScale = [
    130.81, 146.83, 164.81, 174.61, 196.00, 220.00,
    246.94, 261.63, 293.66, 329.63, 349.23, 392.00,
    440.00, 493.88, 523.25
]

export const minScale = [130.81, 146.83, 155.56, 174.61, 196.00, 207.65, 233.08, 261.63,
    293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25]

