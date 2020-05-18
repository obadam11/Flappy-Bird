window.onload = function (){
    let cvs = document.getElementById("qwertyuiop");
    let ctx = cvs.getContext("2d");
    const width = cvs.width;
    const height = cvs.height;
    let playing = false;
    const random = (min, max) => Math.random() * (max - min) + min;
    let pipesSpeed = -2.5;
    const gap = 80;
    let gameOver = false;
    let gameState = 0;



    let fBird = {
        x: 50,
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
            this.y = (Math.random() + 1) * -40;
        }
    }
    let score = {
        current: 0,
        high : localStorage.getItem("highScore"),
        draw() {
            write("white", "35", score.current, width / 2, 35, true);
        }
    }
    const emptyStorage = () => {
        console.warn("localStorage is empty");
        if (localStorage.length == 0) {
            score.high = score.current;
            localStorage.setItem("highScore", score.high);
        }
    }
    emptyStorage();
    console.log(score.high);

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

    let gameOverImg = new Image();
    gameOverImg.src = "assets/img/scoreboard.png";

    let loseSound = new Audio();
    loseSound.src = "assets/audio/hit.wav";

    let passSound = new Audio();
    passSound.src = "assets/audio/point.wav";

    let dieSound = new Audio();
    dieSound.src = "assets/audio/die.wav";


    document.addEventListener("keypress", (e) => {
        if (e.keyCode == 32) {
            if (!gameOver)
            {fBird.speed -= fBird.lift;
            wingSound.play();
            playing = true;
            gameState = 1;}
            else {
                playAgain();
                console.log("Play agin function");
            }
        }
    });

    let pDown = new Pipes("D");
    let pUp = new Pipes("U");
    pDown.y = pUp.y + 160 + gap;
    console.log("pUp", pUp.y, "pDown", pDown.y);

    let allPipes = [pDown, pUp];
    let yUp = pUp.y;
    let yDown = pDown.y;
    function write(color, fontSize, txt, x, y, bold) {
        ctx.fillStyle = color;
        ctx.strokeStyle = "#000";
        if (bold) ctx.font = `bold ${fontSize}px Teko`;
        ctx.font = `${fontSize}px Teko`;
        ctx.fillText(txt, x, y);
    };
    function endGame() {
        if (gameOver) {
            ctx.drawImage(gameOverImg, width/2 - gameOverImg.width / 2, height / 2 - gameOverImg.height / 2);
            write("white", "25", score.current, width / 2 + 65, height / 2  - 20);
            write("white", "25", score.high, width / 2 + 65, height / 2 + 25);
        }
    }
    function playAgain() {
        // gameOver = false;
        // score.current = 0;
        // score.high = localStorage.getItem("highScore");
        // gameState = 0;
        // playing = false;
        // let pipeSpeed = -2.5;
        // fBird.gravity = 0.75;
        // fBird.x = 50;
        // fBird.y = height / 2;
        location.reload();
    }
    function drawBird() {
        ctx.drawImage(birdImg, fBird.x, fBird.y, fBird.width, fBird.height);
    }
    function collision() {
        let bottomPipe = (fBird.y >= yDown) && (fBird.x + fBird.width >= pDown.x + pUp.width);
        let onGround = (fBird.y >= height - 100 - fBird.height / 2);
        let topPipe = (fBird.y <= yUp + pUp.height) && (fBird.x + fBird.width >= pUp.x); // Need to fix this

        if (bottomPipe || onGround || topPipe) return true;

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
            score.current ++;
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
        }
        if (fBird.y <= 0 + fBird.height / 2) {
            fBird.y = fBird.height / 2;
        }
    }
    let iteration = 0;
    let soundIteration = 0;
    setInterval(function() {
        update();
        draw();
        respawnPipes();
        ground();
        if (collision()) {
            soundIteration++;
            gameOver = true;
            pipesSpeed = 0;
            fBird.gravity = 10;
            if (soundIteration == 1) dieSound.play();
            gameState = 2;
        }
        if (!gameOver) score.draw();
        endGame();
        if (score.current > score.high && gameState == 2) {
            console.log("current", score.current, "high", score.high);
            iteration ++;
            if (iteration == 1) {
                localStorage.clear();
                score.high = score.current;
                localStorage.setItem("highScore", score.high);
                console.log("changed the high score");
            }
        }
}, 25);
}
