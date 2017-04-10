var Character = function(params) {
    this.sprite = params.sprite;

    this.MAX_X = params.MAX_X;
    this.MAX_Y = params.MAX_Y;

    this.x = this.STARTER_X = params.x;
    this.y = this.STARTER_Y = params.y;
};

Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Character.prototype.update = function() {
    this._checkCollision();
};

function extend(Super, Child) {
    for (var key in Super) {
        if (Super.hasOwnProperty(key)) {
            Child[key] = Super[key];
        }
    }

    function NoopClass() {
        this.constructor = Child;
    }

    Child.prototype = (NoopClass.prototype = Super.prototype, new NoopClass());

    Child.prototype._super = Super;
}

// Enemies our player must avoid
var Enemy = function(starterX, starterY) {
// Variables applied to each of our instances go here,
// we've provided one for you to get started

// The image/sprite for our enemies, this uses
// a helper we've provided to easily load images
    this._super.call(this, {
        sprite: 'images/enemy-bug.png',
        MAX_X: 505,
        MAX_Y: 999,
        x: starterX,
        y: starterY
    });

    this.VELOCITY = 500;
};

extend(Character, Enemy);

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
// You should multiply any movement by the dt parameter
// which will ensure the game runs at the same speed for
// all computers.
    this.x += dt * this.VELOCITY;

    this._super.prototype.update.call(this);
};

Enemy.prototype._checkCollision = function() {
    if (this.x > this.MAX_X) {
        this.x = this.STARTER_X;

        this.MAX_X = this._generateRandomStarter();
    }

    if (this.y > this.MAX_Y) {
        this.y = this.STARTER_Y;
    }
};

Enemy.prototype._generateRandomStarter = function() {
    return Math.random() * (800 - this.MAX_X) + this.MAX_X;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this._super.call(this, {
        sprite: 'images/char-boy.png',
        MAX_X: 404,
        MAX_Y: 390,
        x: 202,
        y: 390
    });

    this.MIN_X = 0;
    this.MIN_Y = 0;
};

extend(Character, Player);

Player.prototype.update = function() {
    this._super.prototype.update.call(this);
};

Player.prototype._checkCollision = function() {
    if (this.x > this.MAX_X) {
        this.handleInput('left');
    }

    if (this.y > this.MAX_Y) {
        this.handleInput('up');
    }

    if (this.x < this.MIN_X) {
        this.handleInput('right');
    }

    if (this.y < this.MIN_Y) {
        this.win();
    }
};

Player.prototype._reset = function() {
    this.x = this.STARTER_X;
    this.y = this.STARTER_Y;
};

Player.prototype.lost = function() {
    this._reset();
};

Player.prototype.win = function() {
    this._reset();
};

Player.prototype.handleInput = function(key) {
    var allowedMoves = {
        left: function(){
            this.x -= 101;
        }.bind(this),
        up: function() {
            this.y -= 83;
        }.bind(this),
        right: function() {
            this.x += 101;
        }.bind(this),
        down: function() {
            this.y += 83;
        }.bind(this)
    };

    return allowedMoves[key] && allowedMoves[key]();
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [
    new Enemy(-100, 145),
    new Enemy(-100, 145),
    new Enemy(-350, 62),
    new Enemy(-100, 62),
    new Enemy(-10, 230),
    new Enemy(-100, 230)
];
var player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});