let factoryWeapon = () => {
    let _centerX = 0;
    let _centerY = 0;
    let _radius = 0;
    let _rotation = 0;
    let _oColor = null;

    class weapon {
        constructor() {
        }

        get oColor() { return _oColor; } set oColor(value) { _oColor = value; }
        get centerX() { return _centerX; } set centerX(value) { _centerX = value; }
        get centerY() { return _centerY; } set centerY(value) { _centerY = value; }
        get radius() { return _radius; } set radius(value) { _radius = value; }
        get rotation() { return _rotation; } set rotation(value) { _rotation = value; }

        draw(context) {
            context.save();

            context.shadowColor = _oColor.value;
            context.shadowBlur = 5;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = -1;

            context.beginPath();

            context.lineWidth = this.radius * 0.03;

            let gradient = context.createLinearGradient(this.centerX - this.radius, this.centerY - this.radius, this.centerX + this.radius, this.centerY + this.radius);
            gradient.addColorStop(0, '#aaaaaa');
            gradient.addColorStop(1, '#333333');

            context.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
            context.fillStyle = gradient;
            context.fill();

            context.strokeStyle = '#333333';
            context.stroke();

            context.closePath();

            context.shadowColor = null;
            context.shadowBlur = null;
            context.shadowOffsetX = null;
            context.shadowOffsetY = null;

            let newRadius = this.radius * 0.8;

            context.beginPath();

            gradient = context.createLinearGradient(this.centerX + newRadius, this.centerY + newRadius, this.centerX - newRadius, this.centerY - newRadius);
            gradient.addColorStop(0, '#aaaaaa');
            gradient.addColorStop(1, '#333333');

            context.arc(this.centerX, this.centerY, newRadius, 0, 2 * Math.PI);
            context.fillStyle = gradient;
            context.fill();

            context.closePath();

            context.save();

            context.translate(this.centerX, this.centerY);
            context.rotate(this.rotation * Math.PI / 180);
            context.translate(-this.centerX, -this.centerY);

            let cannonW = this.radius * 0.2;
            let cannonH = this.radius * 1.18;
            let cannonX = this.centerX - cannonW / 2;
            let cannonY = this.centerY - cannonH;

            gradient = context.createLinearGradient(cannonX, cannonY, cannonX + cannonW, cannonY);
            gradient.addColorStop(0, '#333333');
            gradient.addColorStop(0.1, '#555555');
            gradient.addColorStop(0.5, '#bbbbbb');
            gradient.addColorStop(0.9, '#555555');
            gradient.addColorStop(1, '#333333');

            context.fillStyle = gradient;
            context.fillRect(cannonX, cannonY, cannonW, cannonH);

            cannonW = cannonW * 1.3;
            cannonH = cannonH * 0.23;
            cannonX = this.centerX - cannonW / 2;
            cannonY = cannonY - cannonH;

            gradient = context.createLinearGradient(cannonX, cannonY, cannonX + cannonW, cannonY);
            gradient.addColorStop(0, '#333333');
            gradient.addColorStop(0.1, '#555555');
            gradient.addColorStop(0.5, '#bbbbbb');
            gradient.addColorStop(0.9, '#555555');
            gradient.addColorStop(1, '#333333');

            context.fillStyle = gradient;
            context.fillRect(cannonX, cannonY, cannonW, cannonH);

            context.restore();

            newRadius = this.radius * 0.4;

            context.beginPath();

            context.lineWidth = this.radius * 0.01;

            gradient = context.createLinearGradient(this.centerX - newRadius, this.centerY - newRadius, this.centerX + newRadius, this.centerY + newRadius);
            gradient.addColorStop(0, '#999999');
            gradient.addColorStop(1, '#555555');

            context.arc(this.centerX, this.centerY, newRadius, 0, 2 * Math.PI);
            context.fillStyle = gradient;
            context.fill();

            context.strokeStyle = '#222222';
            context.stroke();

            context.closePath();

            context.restore();
        }
    }

    return new weapon();
};
Object.freeze(factoryWeapon);