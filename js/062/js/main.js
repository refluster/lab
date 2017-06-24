var game = new Phaser.Game(400, 300, Phaser.AUTO, 'game',
						   { preload: preload, create: create, update: update, render: render });

function preload() {
}

var obj, plate;

function create() {
	var spawnObj = function() {
		graphics = game.add.graphics(0, 0);
		graphics.beginFill(0xa9a904);
		graphics.lineStyle(4, 0xfd02eb, 1);
		graphics.moveTo(0, 0);
		graphics.lineTo(125, 0);
		graphics.lineTo(125, 100);
		graphics.lineTo(62, 50);
		graphics.lineTo(0, 100);
		graphics.lineTo(0, 0);
		graphics.endFill();
		return graphics;
	};

	var spawnPlate = function() {
		graphics = game.add.graphics(200, 150);
		graphics.beginFill(0xa03090);
		graphics.lineStyle(4, 0xfd02eb, 1);
		graphics.moveTo(0, 0);
		graphics.lineTo(125, 0);
		graphics.lineTo(125, 10);
		graphics.lineTo(0, 10);
		graphics.lineTo(0, 0);
		graphics.endFill();
		return graphics;
	};

	obj = spawnObj();
	plate = spawnPlate();
	game.physics.arcade.enable([obj, plate]);
	//game.physics.arcade.enable([obj]);

	//game.physics.arcade.enable(obj);
	obj.body.velocity.x = 100;
	obj.body.velocity.y = 70;
	obj.body.position.y = 270;
	obj.body.bounce.set(1);
	obj.body.collideWorldBounds = true;

	//game.physics.arcade.enable(plate);
	plate.body.bounce.set(1);
	plate.body.collideWorldBounds = true;
	plate.body.immovable = true;

	console.log(obj);
	console.log(plate);
}

function update() {
    game.physics.arcade.collide(obj, plate);
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
