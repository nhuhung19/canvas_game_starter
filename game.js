/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

let gameOver;
let canvas = document.getElementById("canvas")
let ctx;
let scores = 0;
let timeSurvive = 0;
let userName
let heroDead;
let btnSignIn = document.getElementById("submit-user")

btnSignIn.addEventListener('click', userSignIn)

function toggleElement() {
    let elementRule = document.getElementById('rule-of-game')
    if (elementRule.style.display === 'none') {
        elementRule.style.display = 'block'
    } else {
        elementRule.style.display = 'none'
    }
}

function userSignIn() {
    userName = document.getElementById("Username").value
    document.getElementById("user-name").innerHTML = `User Name: ${userName}`
    document.getElementById("Username").value = ""
    applicationState.currentUser = userName
}
// canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
// document.body.appendChild(canvas);
const applicationState = {
    isGameOver: false,
    currentUser: '',
    highScore: {
        user: '',
        score: null
    },
    gameHistory: []
};

let oldHighScore = localStorage.getItem('highScore')
if (oldHighScore) {
    document.getElementById('high-score').innerHTML = `High Scores: ${oldHighScore}`
}
if (scores > oldHighScore) {
    localStorage.setItem('highScore', scores)
    oldHighScore = scores
    document.getElementById('high-score').innerHTML = `High Scores: ${oldHighScore}`
}

let bgReady, heroReady, keyReady, tRexReady, gorillaReady, ghostReady, gameOverReady;
let bgImage, heroImage, keyImage, tRexImage, gorillaImage, ghostImage, gameOverImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 0;
let elapsedTime = 0;

function loadImages() {

    gorillaImage = new Image();
    gorillaImage.onload = function() {
        // show the background image
        gorillaReady = true;
    };
    gorillaImage.src = "images/rsz_1monkey.png";

    bgImage = new Image();
    bgImage.onload = function() {
        // show the background image
        bgReady = true;
    };
    bgImage.src = "images/castle-resize.gif";

    heroImage = new Image();
    heroImage.onload = function() {
        // show the hero image
        heroReady = true;
    };
    heroImage.src = "images/hero.png";

    keyImage = new Image();
    keyImage.onload = function() {
        // show the monster image
        keyReady = true;
    };
    keyImage.src = "images/rsz_key.png";

    tRexImage = new Image();
    tRexImage.onload = function() {
        tRexReady = true;
    }
    tRexImage.src = "images/T-Rex.png"

    ghostImage = new Image();
    ghostImage.onload = function() {
        // show the background image
        ghostReady = true;
    };
    ghostImage.src = "images/ghost.gif";

    gameOverImage = new Image();
    gameOverImage.onload = function() {
        // show the background image
        gameOverReady = true;
    };
    gameOverImage.src = "images/rsz_1game-over.png";

}

/** 
 * Setting up our characters.
 * 
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let keyX = 100;
let keyY = 100;

let tRexX = 32 + Math.ceil(Math.random() * (canvas.width - 64));
let tRexY = 32 + Math.ceil(Math.random() * (canvas.height - 64));

let gorillaX = 32 + Math.ceil(Math.random() * (canvas.width - 64));
let gorillaY = 32 + Math.ceil(Math.random() * (canvas.height - 64));

let ghostX = 200;
let ghostY = 250;

/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysDown = {};

function setupKeyboardListeners() {
    // Check for keys pressed where key represents the keycode captured
    // For now, do not worry too much about what's happening here. 
    addEventListener("keydown", function(key) {
        keysDown[key.keyCode] = true;
    }, false);

    addEventListener("keyup", function(key) {
        delete keysDown[key.keyCode];
    }, false);
}


/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */

let speedtRexX = 3
let speedtRexY = 3

let speedGorrilaX = 5
let speedGorrilaY = 5

let speedGhostX = 4
let speedGhostY = 4

function tRexFly() {
    tRexX += speedtRexX
    tRexY += speedtRexY

    if (tRexX > canvas.width - 32) {
        speedtRexX = -speedtRexX
    } else if (tRexY > canvas.height - 32) {
        speedtRexY = -speedtRexY
    } else if (tRexX < 0) {
        speedtRexX = -speedtRexX
    } else if (tRexY < 0) {
        speedtRexY = -speedtRexY
    }
}

function gorillaFly() {
    gorillaX += speedGorrilaX
    gorillaY += speedGorrilaY

    if (gorillaX > canvas.width - 32) {
        speedGorrilaX = -speedGorrilaX
    } else if (gorillaY > canvas.height - 32) {
        speedGorrilaY = -speedGorrilaY
    } else if (gorillaX <= 0) {
        speedGorrilaX = -speedGorrilaX
    } else if (gorillaY <= 0) {
        speedGorrilaY = -speedGorrilaY
    }
}

function ghostFly() {
    ghostX += speedGhostX
    ghostY += speedGhostY

    if (ghostX > canvas.width - 32) {
        speedGhostX = -speedGhostX
    } else if (ghostY > canvas.height - 32) {
        speedGhostY = -speedGhostY
    } else if (ghostX < 0) {
        speedGhostX = -speedGhostX
    } else if (ghostY < 0) {
        speedGhostY = -speedGhostY
    }
}



let update = function() {


    heroDead = heroX <= (ghostX + 20) && heroY <= (ghostY + 20) && ghostY <= (heroY + 20) && ghostX <= (heroX + 20)

    if (heroDead) {
        gameOver = true;
    }
    if (gameOver) {
        // applicationState.currentUser = userName
        // applicationState.highScore.user = userName
        applicationState.highScore.score = scores
        localStorage.setItem('highScore', applicationState.highScore.score)
        return
    }
    if (scores < 3) {
        gorillaReady = false
    } else {
        heroDead = heroX <= (gorillaX + 32) && heroY <= (gorillaY + 32) && gorillaY <= (heroY + 32) && gorillaX <= (heroX + 32)
        gorillaReady = true
        gorillaFly()
        if (heroDead) {
            gameOver = true;
        }
    }
    if (scores < 6) {
        tRexReady = false
    } else {
        heroDead = heroX <= (tRexX + 32) && heroY <= (tRexY + 32) && tRexY <= (heroY + 32) && tRexX <= (heroX + 32)
        tRexReady = true
        tRexFly()
        if (heroDead) {
            gameOver = true
        }
    }


    // Update the time.

    elapsedTime = Math.floor((Date.now() - startTime) / 1000);

    tRexFly()
    ghostFly()

    if (38 in keysDown) { // Player is holding up key
        heroY -= 5;
    }
    if (40 in keysDown) { // Player is holding down key
        heroY += 5;
    }
    if (37 in keysDown) { // Player is holding left key
        heroX -= 5;
    }
    if (39 in keysDown) { // Player is holding right key
        heroX += 5;
    }

    // Wrap HeroX in  srceen (width)
    if (heroX > canvas.width - 32) {
        heroX = 32
    }
    if (heroX < 32) {
        heroX = canvas.width - 32
    }
    // Wrap HeroX in  srceen (height)
    if (heroY < 32) {
        heroY = canvas.height - 32
    }
    if (heroY > canvas.height - 32) {
        heroY = 32
    }


    // Check if player and monster collided. Our images
    // are about 32 pixels big.
    if (
        heroX <= (keyX + 32) &&
        keyX <= (heroX + 32) &&
        heroY <= (keyY + 32) &&
        keyY <= (heroY + 32)
    ) {
        // Pick a new location for the monster.
        // Note: Change this to place the monster at a new, random location.
        keyX = 32 + Math.ceil(Math.random() * (canvas.width - 64))
        keyY = 32 + Math.ceil(Math.random() * (canvas.height - 64))
        scores++
    }

};



/**
 * This function, render, runs as often as possible.
 */
var render = function() {


    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    if (heroReady) {
        ctx.drawImage(heroImage, heroX, heroY);
    }
    if (keyReady) {
        ctx.drawImage(keyImage, keyX, keyY)
    }
    if (tRexReady) {
        ctx.drawImage(tRexImage, tRexX, tRexY)
    }
    if (ghostReady) {
        ctx.drawImage(ghostImage, ghostX, ghostY)
    }

    if (gorillaReady) {
        ctx.drawImage(gorillaImage, gorillaX, gorillaY)
    }

    if (gameOver) {
        ctx.drawImage(gameOverImage, 220, 200)
    }
    if (resetGame) {
        timeSurvive = 0
    } else {
        timeSurvive = SECONDS_PER_ROUND + elapsedTime
    }
    document.getElementById("time-survive").innerHTML = `Time Survive: ${timeSurvive}`
    document.getElementById("score").innerHTML = `Scores: ${scores}`
    ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND + elapsedTime}`, 20, 100);
    ctx.fillText(`Your Scores: ${scores}`, 20, 150);
    ctx.fillStyle = "white"

};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function() {

    update();
    render();
    // Request to do this again ASAP. This is a special method
    // for web browsers. 
    requestAnimationFrame(main);

};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;


function startGame() {
    loadImages();
    setupKeyboardListeners();
    main();
    btnStart.style.visibility = "hidden"

}

function reset() {
    location.reload();
}
let resetGame;
let btnStart = document.getElementById("btnStart")
btnStart.addEventListener('click', startGame)
let btnReset = document.getElementById("btnReset")
btnReset.addEventListener('click', reset)


// Let's play this game!