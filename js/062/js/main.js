var game = new Phaser.Game(400, 300, Phaser.AUTO, 'game',
						   { preload: preload, create: create, update: update, render: render });

function preload() {
	game.load.spritesheet('colormap', 'asset/1x1.png', 1, 1);
}

var obj, plate, platform;
var obj2;

function create() {
	var createPlatform = function() {
		w = 380
		h = 280
		b = 10
		cx = game.world.width/2;
		cy = game.world.height/2;
		
		platforms = game.add.group();
		platforms.enableBody = true;

		var g = platforms.create(cx - w/2, cy - h/2 - b/2, 'colormap', 35);
		g.width = w;
		g.height = b;
		g.body.immovable = true;

		g = platforms.create(cx - w/2, cy + h/2 - b/2, 'colormap', 10);
		g.width = w
		g.height = b;
		g.body.immovable = true;

		g = platforms.create(cx - w/2 - b/2, cy - h/2, 'colormap', 1);
		g.width = b;
		g.height = h;
		g.body.immovable = true;

		g = platforms.create(cx + w/2 - b/2, cy - h/2, 'colormap', 2);
		g.width = b;
		g.height = h;
		g.body.immovable = true;

		return platforms
	};

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

	platform = createPlatform();
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
