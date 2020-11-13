let factoryRocket = (oColor) => {
    let _x = 0;
    let _y = 0;
    let _width = 0;
    let _height = 0;
    let _rotation = 0;
    let _oColor = oColor;

    class rocket {
        constructor() {
        }

        get x() { return _x; } set x(value) { _x = value; }
        get y() { return _y; } set y(value) { _y = value; }
        get width() { return _width; } set width(value) { _width = value; }
        get height() { return _height; } set height(value) { _height = value; }
        get rotation() { return _rotation; } set rotation(value) { _rotation = value; }

        get colorId() { return _oColor.id; }
        get colorPoint() { return _oColor.point; }
        get centerX() { return _x + _width / 2; }
        get centerY() { return _y + _height / 2; }
        get area() { return _width * 2 + _height * 2; }

        move(value) {
            this.y += value;
        }

        draw(context) {
            context.save();

            context.translate(this.centerX, this.centerY);
            context.rotate(this.rotation * Math.PI / 180);
            context.translate(-this.centerX, -this.centerY);

            context.shadowColor = _oColor.value;
            context.shadowBlur = 10;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;

            let lineW = this.area * 0.005;

            let newW = this.width - lineW;
            let newH = this.height - lineW;
            let newX = this.centerX - newW / 2;
            let newY = this.centerY - newH / 2;

            let points = [];

            let coord = { x: newX, y: newY + newH };
            points.push(coord);
            coord = { x: this.centerX - newW * 0.15, y: newY + newH * 0.6 };
            points.push(coord);
            coord = { x: coord.x, y: newY + newH * 0.15 };
            points.push(coord);
            coord = { x: this.centerX, y: newY };
            points.push(coord);
            coord = { x: this.centerX + newW * 0.15, y: newY + newH * 0.15 };
            points.push(coord);
            coord = { x: coord.x, y: newY + newH * 0.6 };
            points.push(coord);
            coord = { x: newX + newW, y: newY + newH};
            points.push(coord);
            coord = { x: this.centerX + newW * 0.2, y: coord.y };
            points.push(coord);
            coord = { x: coord.x, y: newY + newH * 0.9 };
            points.push(coord);
            coord = { x: this.centerX - newW * 0.2, y: coord.y };
            points.push(coord);
            coord = { x: coord.x, y: newY + newH };
            points.push(coord);

            context.lineWidth = lineW;

            context.beginPath();

            context.moveTo(points[0].x, points[0].y);

            points.forEach(item => {
                context.lineTo(item.x, item.y);
            });

            context.lineTo(points[0].x, points[0].y);

            let gradient = context.createLinearGradient(newX, newY, newX + newW, newY);
            gradient.addColorStop(0, '#444444');
            gradient.addColorStop(0.5, '#888888');
            gradient.addColorStop(1, '#444444');

            let gradientB = context.createLinearGradient(newX, newY, newX + newW, newY);
            gradientB.addColorStop(0.1, '#bbbbbb');
            gradientB.addColorStop(0.5, '#333333');
            gradientB.addColorStop(0.9, '#bbbbbb');

            context.fillStyle = gradient;
            context.fill();

            context.strokeStyle = gradientB;
            context.stroke();

            context.closePath();

            context.shadowColor = null;
            context.shadowBlur = null;
            context.shadowOffsetX = null;
            context.shadowOffsetY = null;

            let cabRadius = this.area * 0.025;
            let cabCenterX = this.centerX;
            let cabCenterY = newY + newH * 0.2;

            let gradientR = context.createRadialGradient(cabCenterX, cabCenterY, 0, cabCenterX, cabCenterY, cabRadius);
            gradientR.addColorStop(0.3, '#777777');
            gradientR.addColorStop(0.4, '#222222');

            context.beginPath();

            context.arc(cabCenterX, cabCenterY, cabRadius, 1 * Math.PI, 0);
            context.fillStyle = gradientR;
            context.fill();

            context.closePath();     

            context.restore();
        }
    }

    return new rocket();
};
Object.freeze(factoryRocket);