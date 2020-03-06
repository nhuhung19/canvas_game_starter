/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

let game = true
let canvas = document.getElementById("canvas")
let ctx;
let scores = 0;

// canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
// document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady, tRexReady, gorillaReady, ghostReady;
let bgImage, heroImage, monsterImage, tRexImage, gorillaImage, ghostImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 0;
let elapsedTime = 0;

function loadImages() {
    gorillaImage = new Image();
    gorillaImage.onload = function() {
        // show the background image
        gorillaReady = true;
    };
    gorillaImage.src = "images/monkey.png";

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

    monsterImage = new Image();
    monsterImage.onload = function() {
        // show the monster image
        monsterReady = true;
    };
    monsterImage.src = "images/monster.png";

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

let monsterX = 100;
let monsterY = 100;

let tRexX = 150;
let tRexY = 200;

let gorillaX = 70;
let gorillaY = 70;

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

let speedGorrilaX = 2
let speedGorrilaY = 2

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



let heroDead;
let update = function() {

    heroDead = heroX <= (ghostX + 32) && heroY <= (ghostY + 32) && ghostY <= (heroY + 32) && ghostX <= (heroX + 32)



    if (heroDead) {
        game = false;
    }
    if (!game) {
        return
    }
    if (scores < 3) {
        gorillaReady = false
    } else {
        heroDead = heroX <= (gorillaX + 32) && heroY <= (gorillaY + 32) && gorillaY <= (heroY + 32) && gorillaX <= (heroX + 32)
        gorillaReady = true
        gorillaFly()
        if (heroDead) {
            game = false;
        }
    }
    if (scores < 6) {
        tRexReady = false
    } else {
        heroDead = heroX <= (tRexX + 32) && heroY <= (tRexY + 32) && tRexY <= (heroY + 32) && tRexX <= (heroX + 32)
        tRexReady = true
        tRexFly()
        if (heroDead) {
            game = false
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
        heroX <= (monsterX + 32) &&
        monsterX <= (heroX + 32) &&
        heroY <= (monsterY + 32) &&
        monsterY <= (heroY + 32)
    ) {
        // Pick a new location for the monster.
        // Note: Change this to place the monster at a new, random location.
        monsterX = 32 + Math.ceil(Math.random() * (canvas.width - 64))
        monsterY = 32 + Math.ceil(Math.random() * (canvas.height - 64))
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
    if (monsterReady) {
        ctx.drawImage(monsterImage, monsterX, monsterY)
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


// Let's play this game!
loadImages();
setupKeyboardListeners();
main();