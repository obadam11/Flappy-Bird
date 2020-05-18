window.onload = function (){
    let cvs = document.getElementById("qwertyuiop");
    let ctx = cvs.getContext("2d");
    const width = cvs.width;
    const height = cvs.height;
    let playing = false;
    const random = (min, max) => Math.random() * (max - min) + min;
    let pipesSpeed = -2.5;
    const gap = 90;
    let score = 0;
    
    
    let fBird = {
        x: 70,
        y: height / 2,
        width: 34,
        height: 24,
        gravity: 0.75,
        speed: 0,
        lift: 20,
        airResistance : 0.9
    }
    function Pipes(direction) {
        this.width = 30;
        this.height = 160;
        this.x = width;
        if (direction == "U") {
            // this.y = 0;
            this.y = (Math.random() + 1) * -50;
        }
    }

    // Images
    let birdImg = new Image();
    birdImg.src = "assets/img/birdImg.png"

    let land = new Image();
    land.src = "assets/img/land.png";

    let sky = new Image();
    sky.src = "assets/img/sky.png";

    let wingSound = new Audio();
    wingSound.src = "assets/audio/wing.wav";

    let pUpImg = new Image();
    pUpImg.src = "assets/img/PipeUp.png";

    let pDownImg = new Image();
    pDownImg.src = "assets/img/PipeDown.png";

    let loseSound = new Audio();
    loseSound.src = "assets/audio/hit.wav";

    let passSound = new Audio();
    passSound.src = "assets/audio/point.wav";

    document.addEventListener("keypress", (e) => {
        if (e.keyCode == 32) {
            fBird.speed -= fBird.lift;
            wingSound.play();
            playing = true;
        }
    });
   
    let pDown = new Pipes("D");
    let pUp = new Pipes("U");
    pDown.y = pUp.y + 160 + gap;
    console.log("pUp", pUp.y, "pDown", pDown.y);

    let allPipes = [pDown, pUp];
    let yUp = pUp.y;
    let yDown = pDown.y;
    function drawBird() {
        ctx.drawImage(birdImg, fBird.x, fBird.y, fBird.width, fBird.height);
    }
    function drawPipes(yUp, yDown) {
        ctx.drawImage(pUpImg, pDown.x, yDown, pDown.width, pDown.height);
        ctx.drawImage(pDownImg, pUp.x, yUp, pUp.width, pUp.height);
    }
    function drawBg() {
        ctx.fillStyle = "#57A5FC";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(sky, 0, height - 200, width, 100);
        if (pDown.x <= 0) {
            yUp  = (Math.random() + 1) * -50;
            yDown =  yUp + 160 + gap;
        }
        drawPipes(yUp, yDown);
        ctx.drawImage(land, 0, height - 100, width, 100);
    }
    function draw() {
        ctx.clearRect(0, 0, width, height);
        drawBg();
        drawBird();
    };
    function respawnPipes() {
        if (pDown.x  < 0) {
            pDown.x = width;
            pUp.x = width;
            passSound.play();
            score ++;
        }
    }
    function movePipes() {
            for (let i = 0; i < allPipes.length; i++) {
                allPipes[i].x += pipesSpeed;
            }
    };
    function update() {
        if (playing) {
            fBird.speed += fBird.gravity;
            fBird.speed *= fBird.airResistance;
            fBird.y += fBird.speed;
            movePipes();
        }
    }
    function ground() {
        if (fBird.y >= height - 100 - fBird.height / 2) {
            fBird.y = height - 100 - fBird.height / 2;
            fBird.speed = 0;
            pipesSpeed = 0;
            // loseSound.play();
        }
        if (fBird.y <= 0 + fBird.height / 2) {
            fBird.y = fBird.height / 2;
        }
    }
    setInterval(function() {
        update();
        draw();
        respawnPipes();
        ground();
    console.log("pUp", yUp, "pDown", yDown);
}, 25);
}
