var game = new Phaser.Game(400, 300, Phaser.AUTO, 'game',
						   { preload: preload, create: create, update: update, render: render });

function preload() {
	game.load.spritesheet('colormap', 'asset/1x1.png', 1, 1);
}

var obj, plate, platform;

function create() {
	var createPlatform = function() {
		w = 380
		h = 280
		b = 10
		cx = game.world.width/2;
		cy = game.world.height/2;
		
		platforms = game.add.group();
		platforms.enableBody = true;

		g = platforms.create(cx - w/2, cy - h/2 - b/2, 'colormap', 35);
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
		graphics = game.add.graphics(50, 50);
		graphics.beginFill(0xa9a904);
		graphics.lineStyle(4, 0xfd02eb, 1);
		graphics.moveTo(0, 0);
		graphics.lineTo(55, 0);
		graphics.lineTo(55, 100);
		graphics.lineTo(32, 25);
		graphics.lineTo(0, 100);
		graphics.lineTo(0, 0);
		graphics.endFill();
		game.physics.arcade.enable(graphics);
		graphics.body.velocity.x = 100;
		graphics.body.velocity.y = 70;
		graphics.body.position.y = 270;
		graphics.body.bounce.set(1);
		graphics.body.collideWorldBounds = true;
		return graphics;
	};

	var createPlate = function() {
		g = game.add.sprite(game.world.width/2, game.world.height/2, 'colormap', 4);
		game.physics.arcade.enable(g);
		g.body.bounce.set(1);
		return g;
	};

	platform = createPlatform();
	obj = spawnObj();
	plate = createPlate();

	console.log(obj);
	console.log(plate);
}

function update() {
    game.physics.arcade.collide(obj, platform);
    //game.physics.arcade.collide(obj, plate);
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
