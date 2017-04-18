// Enemies our player must avoid
var Enemy = function(column, row, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // To center the bug vertically in the row I use "-20" on "y" values
    this.x = 100 * column;
    this.y = 75 * row - 20;
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    //all computers
    this.x += this.speed * dt;
    // Random speed
    if (this.x >550){
        this.x = -100;
        this.speed = 100 + Math.floor(Math.random() * 512);
    }
    // Draw the enemy on the screen, required method for game
    Enemy.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
    // Check for collision with Player
    this.checkCollision();

};
// collision with Player check
Enemy.prototype.checkCollision = function() {
    // Since Enemy is drawn 10px higher than Player, adjust 'y'
    if (this.y === player.y - 10) {
        /* Below the Enemy is on same row as Player, So Enemy can move many pixels each 'dt',
         in below line define the distance between enemy and player and when the game is reset */
        if (this.x > player.x - 30 && this.x < player.x + 30) {
            // Collision! the game will pop out message to inform the player and reset
            player.reset();
            window.alert("Game over!");
            // Cut 20 from the total score when the player collision with enemy
            score.modifyScore(-20);
        }
    }
};
// Here the gems that player collect to increse the score
var Gem = function(column, row, speed, color) {
    // Gems are a subclass of  Enemy
    Enemy.call(this, column, row, speed);
    if (color === 'blue') {
        this.sprite = 'images/Gem Blue.png';
    } else if (color === 'green') {
        this.sprite = 'images/Gem Green.png';
    }
    else if (color === 'orange') {
        this.sprite = 'images/Gem Orange.png';
    } else {
        this.sprite = 'images/Rock.png';
    }
    // Cache the current sprite image
    this.oldSprite = this.sprite;
};
// below lone to make sure that Gems drives from enmy
Gem.prototype = Object.create(Enemy.prototype);
Gem.prototype.constructor = Gem;
// The below code will make different between gem and enemy
Gem.prototype.checkCollision = function() {
    // Check for collision with Player
    // Since Gem is drawn 10px higher than Player, adjust 'y'
    if (this.y === player.y - 10) {
        // Gem is on same row as Player
        // Since Gem can move many pixels each 'dt', check range
        if (this.x > player.x - 50 && this.x < player.x + 50) {
            // Check if this is start of collision
            if (this.sprite != 'images/Star.png') {
                // then add 10 scores to total score
                score.modifyScore(10);
                // When the player collides the gem will changed to star image
                this.sprite = 'images/Star.png';
            }
        }
    }
};
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(column, row) {
    // To center the player vertically in the row I use "-10" on "y" values
    this.x = 100 * column;
    this.y = 75 * row - 10;
    // Here to select the image of player
    this.sprite = 'images/char-boy.png';
    //when the player reach water he win the game and it will restart
    this.showSuccess = 0;
};
Player.prototype.update = function(dt) {
    // If Player reached water, hold changed sprite for a while
    if (this.showSuccess > 20) {
        // Visual display of Success done - reset Player
        this.reset();
    }
};
Player.prototype.render = function() {
    // Redraw Player image
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // If Player reached water, showing success for a few ticks
    if (this.y < 0) {
        this.showSuccess++;
    }
};
Player.prototype.reset = function() {
    // Move player back to 3rd column and bottom row of play area
    this.y = 100 * 2;
    this.y = 75 * 5 - 10;

    // Here to make sure that player is the same char
    this.sprite = 'images/char-boy.png';
    // Reset
    this.showSuccess = 0;

    // Here to reset the gems to old after win the game
    for (var i = 0; i < allEnemies.length; i++) {
        if (allEnemies[i] instanceof Gem) {
            allEnemies[i].reset();
        }
    }
};
Player.prototype.handleInput = function(keyName) {
    // Check for an expected key and move Player
    if (keyName === 'up') {
        // Move up by one square
        this.y = this.y - 75;

        if (this.y < 0) {
            // If this just happened, handle reaching water row
            // Note: Enemy collision method handles player reset
            if (this.showSuccess === 0) {
                // Temporarily replace character sprite with
                // star image so user knows they succeeded!
                this.sprite = 'images/Star.png';

                // When reach the water the score will increase 100, and show message win the game
                score.modifyScore(100);
                console.log( 'your score is ', this.score );

            }
        }

    }
    else if (keyName === 'down') {
        // Move down by one square
        this.y = this.y + 75;
        // The player cannot move in bottom edge ( in Game area )
        if (this.y > 75 * 5 - 10) {
            this.y = 75 * 5 - 10;
        }
    } else if (keyName === 'left') {
        // Move left by one square
        this.x =  this.x - 100;
        // The player cannot move in left edge ( In Game Area )
        if (this.x < 0) {
            this.x = 0;
        }
    } else if (keyName === 'right') {
        // Move right by one square
        this.x =this.x + 100;

        // The player cannot move in right edge ( In Game Area )
        if (this.x > 100 * 4) {
            this.x = 100 * 4;
        }
    }else if(keyName === 'a'){
        this.sprite = 'images/char-cat-girl.png';
    }
};
// Create a Score object for keeping track of points and displaying
var Score = function() {
    // Start with a score of 0
    this.score = 0;

    // Put the score in center top of the game area
    this.x = 100 * 2.5;
    this.y = 30;
};
Score.prototype.modifyScore = function(change) {
    // To increase the score "change" should be positive and negative value to decrease the score
    this.score = this.score + change;
    if (this.score < 0) {
        // score can't be minus value
        this.score = 0;
    }
};
// Update the score object
// Parameter: dt, a time delta between ticks
Score.prototype.update = function(dt) {
    // Update the score will be happen bt other events
};
Score.prototype.render = function() {
    // Remove old Score and draw updated Score on screen
    ctx.clearRect(0, 0, 505, 50);
    ctx.fillText(this.score, this.x, this.y);
    ctx.strokeText(this.score, this.x, this.y);
};

// Now instantiate your objects.
// when refresh the game the player object will be in 3rd column, 6th row at bottom
var player = new Player(2, 6);
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
// Push Enemy in 1st column, 2nd row, standard speed random
allEnemies.push(new Enemy(0, 1, 100 + Math.floor(Math.random() * 512)));
// Push Enemy in 2nd column, 4th row, standard speed random
allEnemies.push(new Enemy(1, 3, 100 + Math.floor(Math.random() * 512)));
// Push Enemy in 4th column, 3rd row, standard speed random
allEnemies.push(new Enemy(3, 2, 100 + Math.floor(Math.random() * 512)));
// allEnemies.push(new Enemy(3, 2, 4));
//  add Gems to allEnemies
allEnemies.push(new Gem(3, 1, 100 + Math.floor(Math.random() * 512), 'blue'));
allEnemies.push(new Gem(0, 2, 100 + Math.floor(Math.random() * 512), 'orange'));
allEnemies.push(new Gem(4, 3, 100 + Math.floor(Math.random() * 512), 'green'));
// The score object holds the current score and displays it
// Update the score will be happen bt other events
var score = new Score();
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'a'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
// Below code will reset the game in case of win or lose
Gem.prototype.reset = function() {
    // Reset function
    this.sprite = this.oldSprite;
};
