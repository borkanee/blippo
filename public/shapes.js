class Circle {
    constructor(x, y, diameter, color, p) {
        this.x = x
        this.y = y
        this.diameter = diameter
        this.color = color
        this.p = p
        this.directionX = p.random(-4, 4)
        this.directionY = p.random(-4, 4)
    }

    move() {
        this.x = this.x + this.directionX
        this.y = this.y + this.directionY
    }

    show() {
        this.p.noStroke()
        this.p.fill('#' + this.color)
        this.p.ellipse(this.x, this.y, this.diameter)
    }
}

class Rectangle {
    constructor(x, y, w, l, color, p) {
        this.x = x
        this.y = y
        this.w = w
        this.l = l
        this.color = color
        this.p = p
        this.directionX = p.random(-4, 4)
        this.directionY = p.random(-4, 4)
    }

    move() {
        this.x = this.x + this.directionX
        this.y = this.y + this.directionY
    }

    show() {
        this.p.noStroke()
        this.p.fill('#' + this.color)
        this.p.rect(this.x, this.y, this.w, this.l)
    }
}

class Triangle {
    constructor(x1, y1, color, size, p) {
        this.size = size
        this.x1 = x1
        this.y1 = y1
        this.color = color
        this.p = p
        this.directionX = p.random(-4, 4)
        this.directionY = p.random(-4, 4)
        this.angle = 0
    }
    show() {
        this.p.noStroke()
        this.p.fill('#' + this.color)
        this.p.triangle(this.x1, this.y1, this.x1 + (this.size / 2), this.y1 - this.size, this.x1 + this.size, this.y1)
    }
    move() {
        this.x1 = this.x1 + this.directionX
        this.y1 = this.y1 + this.directionY
    }
}