var game = new Phaser.Game(400, 300, Phaser.AUTO, 'game',
						   { preload: preload, create: create, update: update, render: render });

function preload() {
	game.load.spritesheet('colormap', 'asset/1x1.png', 1, 1);
}

var obj, plate, platform;
var bricks;

function create() {
	var spawnObj = function() {
		var g = game.add.sprite(game.world.width/2, -80 + game.world.height/2, 'colormap', 4);
		g.width = 100;
		g.height = 10;

		game.physics.arcade.enable(g);
		g.body.velocity.x = 100;
		g.body.velocity.y = 80;
		g.body.position.y = 30;
		g.body.bounce.set(1);
		g.body.collideWorldBounds = true;
		return g;
	};

	var createPlate = function() {
		var g = game.add.sprite(game.world.width/2, game.world.height/2 + 30, 'colormap', 8);
		g.width = 100;
		g.height = 20;
		game.physics.arcade.enable(g);
		g.body.velocity.x = 100;
		g.body.bounce.set(1);
		//g.body.immovable = true;
		g.body.collideWorldBounds = true;
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

	plate = createPlate();
	obj = spawnObj();

	cursors = game.input.keyboard.createCursorKeys();

	console.log(obj);
	console.log(plate);
}

function update() {
	//plate.body.velocity.x = 0;
	/*
	if (cursors.left.isDown) {
		plate.body.velocity.x = -50;
	} else if (cursors.right.isDown) {
		plate.body.velocity.x = 50;
	}
*/

	game.physics.arcade.collide([plate, obj], platform);
	game.physics.arcade.collide([obj], plate);
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
