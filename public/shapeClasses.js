// Module for shapes
export class Circle {
    constructor(x, y, diameter, color, noteLength, p) {
        console.log(this, p)
        this.value = 4
        this.decrement = this.value / (noteLength * p.frameRate())
        this.x = x
        this.y = y
        this.diameter = diameter
        this.color = color
        this.p = p
    }

    move() {
        this.x = this.x + this.p.random(-this.value, this.value)
        this.y = this.y + this.p.random(-this.value, this.value)
        this.value = this.value - this.decrement
    }

    show() {
        this.p.noStroke()
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
    }

    move() {
        this.x = this.x + this.p.random(-this.value, this.value)
        this.y = this.y + this.p.random(-this.value, this.value)
        this.value = this.value - this.decrement
    }

    show() {
        this.p.noStroke()
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
    }
    show() {
        this.p.noStroke()
        this.p.fill(this.color)
        this.p.triangle(this.x1, this.y1, this.x1 + (this.size / 2), this.y1 - this.size, this.x1 + this.size, this.y1)
    }
    move() {
        this.x1 = this.x1 + this.p.random(-this.value, this.value)
        this.y1 = this.y1 + this.p.random(-this.value, this.value)
        this.value = this.value - this.decrement

    }
}