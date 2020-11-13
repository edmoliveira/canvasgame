let oCanvas = null;
let context = null;

let rocketCollection = [];
let weapon = null;

let oControl = null;

let lastTime = null;

let rocketLastTime = null;
let weaponColorLastTime = null;

let score = 0;
let rocketQuantity = 0;

let screen = screenEnum.START;
let newScreen = null;

let screenControl = null;

let rotateTransitionS = 0;
let rotateTransitionE = 0;
let directionTransition = directionTransitionEnum.OPEN;

window.onload = () => {
    oCanvas = document.querySelector('canvas');
    context = oCanvas.getContext('2d');

    context.font = "bold 12px fontG";
    context.fillStyle = "red";
    context.fillText('LOADING', 0, 0);
    
    weapon = factoryWeapon();

    oControl = factoryControl(oCanvas, weapon);
    resize();

    lastTime = Date.now();
    rocketLastTime = Date.now();

    screenControl = {
        get area() { return oCanvas.width * 2 + oCanvas.height * 2; }
        , startButton: {
            parent: null
            , get x() { return oCanvas.width / 2 - this.width / 2; }
            , get y() { return oCanvas.height / 2 - this.height / 2; }
            , get width() { return this.parent.area * 0.08; }
            , get height() { return this.width * 0.3; }
        }
    }

    screenControl.startButton.parent = screenControl;

    animation();
};

window.onresize = () => {
    resize();
    draw();
};

window.onkeydown = (e) => {
    e.preventDefault();

    if (screen === screenEnum.PLAYING) {
        oControl.setKey(e.keyCode, () => {
            //draw();
        });
    }
};

window.onmouseup = (e) => {
    let mouseX = e.offsetX;
    let mouseY = e.offsetY;

    if (mouseX >= screenControl.startButton.x
        && mouseX <= screenControl.startButton.x + screenControl.startButton.width
        && mouseY >= screenControl.startButton.y
        && mouseY <= screenControl.startButton.y + screenControl.startButton.height
    ) {
        rotateTransitionS = 0;
        rotateTransitionE = 0;
        score = 0;
        rocketQuantity = 0;

        newScreen = screenEnum.PLAYING;
        screen = screenEnum.TRANSITION;
    }
};

function createRocket() {
    let area = oCanvas.width * 2 + oCanvas.height * 2;
    let rocketH = area * 0.02;

    let colorIndex = Math.floor(Math.random() * 4);

    var rocket = factoryRocket(colorArray[colorIndex]);

    rocket.x = Math.floor((Math.random() * (oCanvas.width * 0.9)) + 10);
    rocket.y = -rocketH;
    rocket.rotation = 180;

    return rocket;
}

function animation() {
    context.clearRect(0, 0, oCanvas.width, oCanvas.height);

    var rightNow = Date.now();
    var elapsedTime = (rightNow - lastTime) / 1000;
    lastTime = rightNow;

    if (screen === screenEnum.START) {
        drawBack();
        drawStart();
    }
    else if (screen === screenEnum.GAME_OVER) {
        drawBack();
        drawGameOver();
    }
    else if (screen === screenEnum.PLAYING) {
        let diff = (rightNow - rocketLastTime) / 1000;

        if (rocketQuantity < 3 && (diff >= 2 || rocketCollection.length === 0)) {
            rocketLastTime = rightNow;

            rocketCollection.push(createRocket());

            rocketQuantity++;
        }

        oControl.ballCollection.forEach((item, index) => {
            item.move(150 * elapsedTime);

            if (item.centerX < 0 || item.centerX > oCanvas.width ||
                item.centerY < 0 || item.centerY > oCanvas.height) {
                oControl.removeBall(index);
            }
            else {
                for (let indexR = rocketCollection.length - 1; indexR >= 0; indexR--) {
                    let rocket = rocketCollection[indexR];

                    if ((item.x + item.width >= rocket.x && item.x <= rocket.x + rocket.width)
                        && (item.y + item.height >= rocket.y && item.y <= rocket.y + rocket.height)
                    ) {
                        oControl.removeBall(index);

                        if (rocket.colorId === item.colorId) {
                            score += rocket.colorPoint;
                            rocketCollection.splice(indexR, 1);
                        }
                        else {
                            score -= 20;

                            if (score < 0) {
                                score = 0;
                            }
                        }
                    }
                }
            }
        });

        for (let index = rocketCollection.length - 1; index >= 0; index--) {
            let item = rocketCollection[index];

            item.move(82 * elapsedTime);

            if (item.y > oCanvas.height) {
                rocketCollection.splice(index, 1);
            }
        }

        //oCanvas.width = oCanvas.width;

        drawBack();
        draw();

        if (rocketQuantity >= 50 && rocketCollection.length === 0) {
            rotateTransitionS = 0;
            rotateTransitionE = 0;

            oControl.ballCollection = [];
            newScreen = screenEnum.GAME_OVER;
            screen = screenEnum.TRANSITION;
        }
    }
    else {
        //TRANSITION

        if (directionTransition === directionTransitionEnum.OPEN) {
            let value = rotateTransitionE + 2 * elapsedTime;

            if (value < 2) {
                rotateTransitionE = value;
            }
            else {
                rotateTransitionE = 2;
                directionTransition = directionTransitionEnum.CLOSE;
            }

            drawBack();

            if (newScreen === screenEnum.PLAYING) {
                drawStart();
            }
            else if (newScreen === screenEnum.GAME_OVER) {
                draw();
            }
        }
        else if (directionTransition === directionTransitionEnum.CLOSE) {
            let value = rotateTransitionS + 2 * elapsedTime;

            if (value < 2) {
                rotateTransitionS = value;
            }
            else {
                rotateTransitionS = 2;
                directionTransition = directionTransitionEnum.OPEN;
                
                screen = newScreen;
            }

            drawBack();

            if (newScreen === screenEnum.PLAYING) {
                draw();
            }
            else if (newScreen === screenEnum.GAME_OVER) {
                drawGameOver();
            }
        }

        drawTransition();
    }

    requestAnimationFrame(animation);
}

function resize() {
    let w = window.innerWidth;
    let h = window.innerHeight;

    oCanvas.width = w;
    oCanvas.height = h;

    oCanvas.style.width = w + 'px';
    oCanvas.style.height = h + 'px';
}

function drawBack() {
    let background = context.createLinearGradient(0, 0, 0, oCanvas.height);
    background.addColorStop(0, '#000000');
    background.addColorStop(0.5, '#2e0934');
    background.addColorStop(1, '#000000');

    context.fillStyle = background;
    context.fillRect(0, 0, oCanvas.width, oCanvas.height);
}

function drawStart() {
    let area = oCanvas.width * 2 + oCanvas.height * 2;

    let centerX = oCanvas.width / 2;
    let centerY = oCanvas.height / 2;

    let startButton = screenControl.startButton;

    //context.strokeStyle = 'green';
    //context.strokeRect(startButton.x, startButton.y, startButton.width, startButton.height);

    createButton(startButton.x, startButton.y, startButton.width, startButton.height)
}

function draw() {
    let area = oCanvas.width * 2 + oCanvas.height * 2;

    let centerX = oCanvas.width / 2;

    context.save();

    context.shadowColor = '#FFD700';
    context.shadowBlur = 20;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    let fontSize = area * 0.02;

    context.font = fontSize + "px fontG";

    let textW = context.measureText(score).width;
    let textX = oCanvas.width * 0.98 - textW;
    let textY = fontSize * 1.2;

    let gradientText = context.createLinearGradient(textX, textY, textX + textW, textY);
    gradientText.addColorStop(0.1, '#c1921c');
    gradientText.addColorStop(0.5, '#FFDF00');
    gradientText.addColorStop(0.9, '#c1921c');

    context.fillStyle = gradientText;
    context.fillText(score, textX, textY);

    context.restore();

    rocketCollection.forEach(item => {
        item.height = area * 0.02;
        item.width = item.height * 0.8;

        item.draw(context);
    });

    oControl.ballCollection.forEach(item => {
        item.draw(context);
    });

    weapon.radius = area * 0.015;
    weapon.centerX = centerX;
    weapon.centerY = oCanvas.height;
    weapon.rotation = oControl.rotation;

    weapon.draw(context);
}

function drawGameOver() {
    let area = oCanvas.width * 2 + oCanvas.height * 2;

    context.save();

    context.shadowColor = '#FFD700';
    context.shadowBlur = 20;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    let fontSize = area * 0.02;

    context.font = fontSize + "px fontG";

    let textW = context.measureText(score).width;
    let textX = oCanvas.width / 2 - textW / 2;
    let textY = oCanvas.height / 2 + fontSize / 2;

    let gradientText = context.createLinearGradient(textX, textY, textX + textW, textY);
    gradientText.addColorStop(0.1, '#c1921c');
    gradientText.addColorStop(0.5, '#FFDF00');
    gradientText.addColorStop(0.9, '#c1921c');

    context.fillStyle = gradientText;
    context.fillText(score, textX, textY);

    context.shadowColor = '#FFFFFF';
    context.shadowBlur = 20;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    fontSize = area * 0.03;

    context.font = fontSize + "px fontG";

    textW = context.measureText("GAME OVER").width;
    textX = oCanvas.width / 2 - textW / 2;
    textY = fontSize * 1.3;

    gradientText = context.createLinearGradient(textX, textY, textX + textW, textY);
    gradientText.addColorStop(0.1, '#CCCCCC');
    gradientText.addColorStop(0.5, '#999999');
    gradientText.addColorStop(0.9, '#CCCCCC');

    context.fillStyle = gradientText;
    context.fillText("GAME OVER", textX, textY);

    context.restore();
}

function drawTransition() {
    context.save();

    let radius = oCanvas.width / 1.5;
    let centerX = oCanvas.width / 2;
    let centerY = oCanvas.height / 2;

    
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, radius, rotateTransitionS * Math.PI, rotateTransitionE * Math.PI);
    context.clip();
    context.closePath();

    let colorAr = [
        '#2196f3'
        , '#03a9f4'
        , '#00bcd4'
        , '#009688'
        , '#4caf50'
        , '#8bc34a'
        , '#cddc39'
        , '#ffeb3b'
    ]

    let startAngle = 0;
    let endAngle = 0.25;

    for (var index = 0; index < 8; index++) {
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, radius, startAngle * Math.PI, endAngle * Math.PI);
        context.fillStyle = colorAr[index];
        context.fill();
        context.closePath();

        startAngle = endAngle - 0.05;
        endAngle += 0.25;
    }

    context.restore();
}

function createButton(x, y, width, height) {
    context.save();

    let area = width * 2 + height * 2;

    let curveRadius = area * 0.025;

    let x1 = x;
    let y1 = y + curveRadius;

    let x2 = x1;
    let y2 = y;

    let x3 = x + curveRadius;
    let y3 = y2;

    let x4 = x + width - curveRadius;
    let y4 = y3;

    let x5 = x + width;
    let y5 = y4;

    let x6 = x5;
    let y6 = y + curveRadius;

    let x7 = x6;
    let y7 = y + height - curveRadius;

    let x8 = x7;
    let y8 = y + height;

    let x9 = x + width - curveRadius;
    let y9 = y8;

    let x10 = x + curveRadius;
    let y10 = y8;

    let x11 = x;
    let y11 = y10;

    let x12 = x11;
    let y12 = y + height - curveRadius;

    context.lineWidth = area * 0.002;

    context.shadowColor = '#999999';
    context.shadowBlur = 5;
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;

    let gradient = context.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, '#15588d');
    gradient.addColorStop(1, '#062d4b');

    context.beginPath();
    context.moveTo(x1, y1);
    context.arcTo(x2, y2, x3, y3, curveRadius);
    context.lineTo(x4, y4);
    context.arcTo(x5, y5, x6, y6, curveRadius);
    context.lineTo(x7, y7);
    context.arcTo(x8, y8, x9, y9, curveRadius);
    context.lineTo(x10, y10);
    context.arcTo(x11, y11, x12, y12, curveRadius);
    context.lineTo(x1, y1);
    context.fillStyle = gradient;
    context.fill();
    context.strokeStyle = '#222222';
    context.stroke();
    context.closePath();

    context.shadowColor = '#000000';
    context.shadowBlur = 5;
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;

    let text = "START";

    let fontSize = area * 0.1;

    context.font = "bold " + fontSize + "px Consolas";

    let textW = context.measureText(text).width;
    let textX = x + width / 2 - textW / 2;
    let textY = y + fontSize * 0.92;

    context.fillStyle = "#FFFFFF";
    context.fillText(text, textX, textY);

    context.restore();
}