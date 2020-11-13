let factoryControl = (canvas, weapon) => {
    let functionDictionary = null;
    let _oRotation = null;
    let _ballCollection = null;
    let _canvas = canvas;

    let _weapon = weapon;

    let weaponColorIndex = 0;

    class control {
        constructor() {
            _oRotation = factoryRotation();
            _ballCollection = [];

            functionDictionary = new Object();

            functionDictionary[39] = _oRotation.plus;
            functionDictionary[37] = _oRotation.less;
            functionDictionary[32] = createBall;
            functionDictionary[38] = nextWeaponColor;

            _weapon.oColor = colorArray[weaponColorIndex];
        }

        get rotation() { return _oRotation.value; }
        get ballCollection() { return [].concat(_ballCollection); }

        setKey(keyCode, callback) {
            let fn = functionDictionary[keyCode];
            
            if (fn != null)
                fn(callback);         
        }

        removeBall(index) {
            _ballCollection.splice(index, 1);
        }
    }

    function nextWeaponColor(callback) {
        weaponColorIndex = (1 + weaponColorIndex) % colorArray.length;

        _weapon.oColor = colorArray[weaponColorIndex];

        if (callback != null)
            callback();
    }

    function createBall(callback) {
        let area = _canvas.width * 2 + _canvas.height * 2;
        let centerX = _canvas.width / 2;
        let centerY = _canvas.height / 2;

        let angle = (_oRotation.value - 90) * Math.PI / 180;
        let radius = _weapon.radius * 1.3;

        let ballCenterX = centerX + Math.cos(angle) * radius;
        let ballCenterY = _canvas.height + Math.sin(angle) * radius;

        let oBall = factoryBall(_weapon.oColor);

        oBall.centerX = ballCenterX;
        oBall.centerY = ballCenterY;
        oBall.radius = area * 0.0008;
        oBall.rotation = _oRotation.value;

        _ballCollection.push(oBall);

        if (callback != null)
            callback();
    }

    return new control();
};
Object.freeze(factoryControl);

let factoryRotation = () => {
    let _value = 0;

    class rotation {
        constructor() {
        }

        get value() { return _value; } set value(value) { _value = value; }

        plus(callback) {
            if (_value < 90) {
                _value += 2;
                if (callback != null)
                    callback();
            }
        }

        less(callback) {
            if (_value > -90) {
                _value -= 2;
                if (callback != null)
                    callback();
            }
        }
    }

    return new rotation();
};
Object.freeze(factoryRotation);

const colors = {
    GREEN: { id: 1, value: '#8ceb81', point: 1000 }
    , RED: { id: 2, value: '#bc2f2f', point: 3000 }
    , BLUE: { id: 3, value: '#00BCD4', point: 4500}
    , YELLOW: { id: 4, value: '#FFEB3B', point: 500 }
};
Object.freeze(colors);

const colorArray = [colors.GREEN, colors.RED, colors.BLUE, colors.YELLOW];

const screenEnum = {
    START: 0
    , PLAYING: 1
    , GAME_OVER: 2
    , TRANSITION: 3
};
Object.freeze(screenEnum);

const directionTransitionEnum = {
    OPEN: 0
    , CLOSE: 1
};
Object.freeze(directionTransitionEnum);

    //let size = area * 0.05;

    //let radius = size / 2;

//context.beginPath();

    //context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    //context.fillStyle = '#cccccc';
    //context.fill();

    //context.closePath();

    //let newRadius = radius * 0.97;

    //let gradient = context.createLinearGradient(centerX - newRadius, centerY - newRadius, centerX + newRadius, centerY + newRadius);
    //gradient.addColorStop(0, '#999999');
    //gradient.addColorStop(1, '#333333');

    //context.beginPath();

    //context.arc(centerX, centerY, newRadius, 0, 2 * Math.PI);
    //context.fillStyle = gradient;
    //context.fill();

    //context.closePath();

    //newRadius = newRadius * 0.97;

    //gradient = context.createLinearGradient(centerX - newRadius, centerY - newRadius, centerX + newRadius, centerY + newRadius);
    //gradient.addColorStop(0, '#bbbbbb');
    //gradient.addColorStop(1, '#555555');

    //context.beginPath();

    //context.arc(centerX, centerY, newRadius, 0, 2 * Math.PI);
    //context.fillStyle = gradient;
    //context.fill();

    //context.closePath();

    //newRadius = newRadius * 0.7;

    //gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, newRadius);
    //gradient.addColorStop(0, '#777777');
    //gradient.addColorStop(1, '#333333');

    //let gradientB = context.createLinearGradient(centerX - newRadius, centerY - newRadius, centerX + newRadius, centerY + newRadius);
    //gradientB.addColorStop(0, '#555555');
    //gradientB.addColorStop(1, '#bbbbbb');

    //context.lineWidth = newRadius * 0.1;

    //context.beginPath();

    //context.arc(centerX, centerY, newRadius, 0, 2 * Math.PI);
    //context.fillStyle = gradient;
    //context.fill();

    //context.strokeStyle = gradientB;
    //context.stroke();

    //context.closePath();