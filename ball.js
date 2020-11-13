let factoryBall = (oColor) => {
    let _centerX = 0;
    let _centerY = 0;
    let _radius = 0;
    let _rotation = 0;
    let _oColor = oColor;

    class ball {
        constructor() {
        }

        get centerX() { return _centerX; } set centerX(value) { _centerX = value; }
        get centerY() { return _centerY; } set centerY(value) { _centerY = value; }
        get radius() { return _radius; } set radius(value) { _radius = value; }
        get rotation() { return _rotation; } set rotation(value) { _rotation = value; }

        get colorId() { return _oColor.id; }
        get x() { return _centerX - _radius; }
        get y() { return _centerY - _radius; }
        get width() { return _radius * 2; }
        get height() { return _radius * 2; }

        move(value) {
            let angle = (this.rotation - 90) * Math.PI / 180;

            this.centerX = Math.cos(angle) * value + this.centerX;
            this.centerY = Math.sin(angle) * value + this.centerY;
        }

        draw(context) {
            context.save();

            context.shadowColor = _oColor.value;
            context.shadowBlur = 15;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;

            context.beginPath();

            context.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
            context.fillStyle = '#333333';
            context.fill();

            context.strokeStyle = '#cccccc';
            context.stroke();

            context.restore();
        }
    }

    return new ball();
};
Object.freeze(factoryBall);