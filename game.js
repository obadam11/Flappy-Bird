window.onload = function (){
    let cvs = document.getElementById("qwertyuiop");
    let ctx = cvs.getContext("2d");
    const width = cvs.width;
    const height = cvs.height;
    let playing = false;
    const random = (min, max) => Math.random() * (max - min) + min;
    const pipesSpeed = -5;

    let fBird = {
        x: 120,
        y: 250,
        width: 34,
        height: 24,
        gravity: 0.75,
        speed: 0,
        lift: 20
    }
    let xPos = random(fBird.x + 50, width - 30);
    let xPos2 = random(fBird.x + 50, width - 30);
    function Pipes(direction, x) {
        this.width = 30;
        this.height = 160;
        this.x = x;
        this.y = (direction == "D") ? 412 - this.height : 0;
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

    let pUp = new Image();
    pUp.src = "assets/img/PipeUp.png";

    let pDown = new Image();
    pDown.src = "assets/img/PipeDown.png";

    let loseSound = new Audio();
    loseSound.src = "assets/audio/hit.wav";

    document.addEventListener("keypress", (e) => {
        if (e.keyCode == 32) {
            fBird.speed -= fBird.lift;
            wingSound.play();
            playing = true;
        }
    });
    let p1Up = new Pipes("D", xPos);
    let p1Down = new Pipes("U", xPos);

    let p2Up = new Pipes("D", xPos2);
    let p2Down = new Pipes("U", xPos2);

    let allPipes = [p1Up, p1Down, p2Up, p2Down];

    function drawBird() {
        ctx.drawImage(birdImg, fBird.x, fBird.y, fBird.width, fBird.height);
    }
    function drawPipes() {
        ctx.drawImage(pUp, p1Up.x, p1Up.y, p1Up.width, p1Up.height);
        ctx.drawImage(pDown, p1Down.x, p1Down.y, p1Down.width, p1Down.height);

        if (p1Up.x < 30) {
            ctx.drawImage(pUp, p2Up.x, p2Up.y, p2Up.width, p2Up.height);
            ctx.drawImage(pDown, p2Down.x, p2Down.y, p2Down.width, p2Down.height);
        }
    }
    function drawBg() {
        ctx.fillStyle = "#57A5FC";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(land, 0, 412, width, 100);
        ctx.drawImage(sky, 0, 312, width, 100);
    }
    function draw() {
        ctx.clearRect(0, 0, width, height);
        drawBg();
        drawPipes();
        drawBird();
    };
    function movePipes() {
            for (let i = 0; i < allPipes.length; i++) {
                allPipes[i].x += pipesSpeed;
            }
    };
    function update() {
        if (playing) {
            fBird.speed += fBird.gravity;
            fBird.y += fBird.speed;
        }
        movePipes();

    }
    function ground() {
        if (fBird.y >= 412 - fBird.height / 2) {
            fBird.y = 412 - fBird.height / 2;
            fBird.speed = 0;
            // loseSound.play();
        }
        if (fBird.y <= 0 + fBird.height / 2) {
            fBird.y = fBird.height / 2;
        }
    }
    setInterval(function() {
        update();
        draw();
        ground();
}, 25);
}
