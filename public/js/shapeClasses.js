import { getRandom } from './settings.js'

/**
 * Module for all Shape-classes.
 * Exports Circle, Rectangle and Triangle.
 */

export class Circle {
    constructor(x, y, diameter, color, noteLength, p) {
        this.value = 4
        this.decrement = this.value / (noteLength * p.frameRate())
        this.x = x
        this.y = y
        this.diameter = diameter
        this.color = color
        this.p = p
        this.isPlaying = true
    }

    
    move() {
        this.x = this.x + getRandom(-this.value, this.value)
        this.y = this.y + getRandom(-this.value, this.value)
        this.value -= this.decrement
        if (this.value < 0.1) { this.isPlaying = false }
    }

    show() {
        this.p.noStroke()
        this.color.setAlpha(getRandom(0, 256))
        this.p.fill(this.color)
        this.p.ellipse(this.x, this.y, this.diameter)
    }
}

export class Rectangle {
    constructor(x, y, w, l, color, noteLength, p) {
        this.value = 4
        this.decrement = this.value / (noteLength * p.frameRate())
        this.x = x
        this.y = y
        this.w = w
        this.l = l
        this.color = color
        this.p = p
        this.CENTER = this.p.CENTER
        this.isPlaying = true
    }

    move() {
        this.x = this.x + getRandom(-this.value, this.value)
        this.y = this.y + getRandom(-this.value, this.value)
        this.value -= this.decrement
        if (this.value < 0.1) { this.isPlaying = false }
    }

    show() {
        this.p.noStroke()
        this.color.setAlpha(getRandom(0, 256))
        this.p.rectMode(this.CENTER)
        this.p.fill(this.color)
        this.p.rect(this.x, this.y, this.w, this.l)
    }
}

export class Triangle {
    constructor(x1, y1, size, color, noteLength, p) {
        this.value = 4
        this.decrement = this.value / (noteLength * p.frameRate())
        this.size = size
        this.x1 = x1
        this.y1 = y1
        this.color = color
        this.p = p
        this.angle = 0
        this.isPlaying = true
    }
    show() {
        this.p.noStroke()
        this.color.setAlpha(getRandom(0, 256))
        this.p.fill(this.color)
        this.p.triangle(this.x1, this.y1, this.x1 + (this.size / 2), this.y1 - this.size, this.x1 + this.size, this.y1)
    }
    move() {
        this.x1 = this.x1 + getRandom(-this.value, this.value)
        this.y1 = this.y1 + getRandom(-this.value, this.value)
        this.value -= this.decrement
        if (this.value < 0.1) { this.isPlaying = false }
    }
}