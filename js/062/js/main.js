var game = new Phaser.Game(400, 300, Phaser.AUTO, 'game',
						   { preload: preload, create: create, update: update, render: render });

function preload() {
	game.load.spritesheet('colormap', 'asset/1x1.png', 1, 1);
}

var paddle;
var bricks;

function create() {
	var spawnObj = function() {
		return g;
	};

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.checkCollision.down = false;

	bricks = game.add.group();
	bricks.enableBody = true;
	bricks.phisicsBodyType = Phaser.Physics.ARCADE;

	for (var y = 0; y < 4; y++) {
		for (var x = 0; x < 4; x++) {
			brick = bricks.create(20 + x*20, 100 + y*20, 'colormap', 8);
			brick.width = 16;
			brick.height = 4;
			brick.body.bounce.set(1);
			brick.body.immovable = true;
			brick.body.collideWorldBounds = true;
		}
	}

	paddle = game.add.sprite(game.world.centerX, game.world.centerY + 30, 'colormap', 10);
	paddle.width = 40;
	paddle.height = 4;
	game.physics.arcade.enable(paddle);
	paddle.body.immovable = true;
    paddle.body.collideWorldBounds = true;
	paddle.body.bounce.set(1);
	paddle.anchor.setTo(0.5, 0.5);

	ball = game.add.sprite(game.world.centerX, game.world.centerY + 30, 'colormap', 4);
	ball.width = 4;
	ball.height = 4;
	game.physics.arcade.enable(ball);
	ball.body.position.y = 30;
	ball.body.bounce.set(1);
	ball.body.collideWorldBounds = true;
	ball.body.bounce.set(1);
	ball.anchor.set(0.5);
	ball.checkWorldBounds = true;
	ball.events.onOutOfBounds.add(ballLost, this);

	ball.body.velocity.x = 100;
	ball.body.velocity.y = -80;

	cursors = game.input.keyboard.createCursorKeys();
}

function ballLost() {
	console.log('ball lost');
	ball.body.velocity.y = -80;
}

function update() {
	if (cursors.left.isDown) {
		paddle.body.position.x -= 5;
	} else if (cursors.right.isDown) {
		paddle.body.position.x += 5;
	}

    game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
    game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);

	//game.physics.arcade.collide([ball, paddle]);
}

function ballHitBrick (_ball, _brick) {
	console.log('hit to brick');
}

function ballHitPaddle (_ball, _paddle) {
	console.log('hit to paddle');
}

function render() {
	/*
	if (graphics.body.position.x > 100) {
		graphics.body.position.x = 0;
		graphics.body.velocity.y = 4;
	}
	*/
	//console.log({x: graphics.body.position.x, y: graphics.body.position.y});
}
