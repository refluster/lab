var brain;
function deepqlearn_init() {
	var num_inputs = 4; // ball and paddle xy positions
	var num_actions = 3; // 3 possible actions, left, stay, right
	var temporal_window = 1; // amount of temporal memory. 0 = agent lives in-the-moment :)
	var network_size = num_inputs*temporal_window + num_actions*temporal_window + num_inputs;

	// the value function network computes a value of taking any of the possible actions
	// given an input state. Here we specify one explicitly the hard way
	// but user could also equivalently instead use opt.hidden_layer_sizes = [20,20]
	// to just insert simple relu hidden layers.
	var layer_defs = [];
	layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:network_size});
	layer_defs.push({type:'fc', num_neurons: 50, activation:'relu'});
	layer_defs.push({type:'fc', num_neurons: 50, activation:'relu'});
	layer_defs.push({type:'regression', num_neurons:num_actions});

	// options for the Temporal Difference learner that trains the above net
	// by backpropping the temporal difference learning rule.
	var tdtrainer_options = {learning_rate:0.001, momentum:0.0, batch_size:64, l2_decay:0.01};

	var opt = {};
	opt.temporal_window = temporal_window;
	opt.experience_size = 30000;
	opt.start_learn_threshold = 1000;
	opt.gamma = 0.7;
	opt.learning_steps_total = 200000;
	opt.learning_steps_burnin = 3000;
	opt.epsilon_min = 0.05;
	opt.epsilon_test_time = 0.05;
	opt.layer_defs = layer_defs;
	opt.tdtrainer_options = tdtrainer_options;

	brain = new deepqlearn.Brain(num_inputs, num_actions, opt); // woohoo
    brain.learning = true;
}

var game;

window.onload = function() {

	game = new Phaser.Game(400, 300, Phaser.AUTO, 'game',
							   { preload: preload, create: create, update: update, render: render });
	deepqlearn_init();
}

function preload() {
	game.load.spritesheet('colormap', 'asset/1x1.png', 1, 1);
}

var paddle;
var bricks;
var score;

score = 0;

var msg;

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

	msg = document.getElementById('msg');
}

function ballLost() {
	console.log('ball lost');
	ball.body.velocity.y = -80;
	score -= 1000;
}

var tick = 0;

function update() {
	++tick;

	/*
	if (cursors.left.isDown) {
		paddle.body.position.x -= 5;
	} else if (cursors.right.isDown) {
		paddle.body.position.x += 5;
	}
	*/

	// forward the brain
	var input_array = new Array(4);
	input_array[0] = ball.body.position.x / game.world.width;
	input_array[1] = ball.body.position.y / game.world.height;
	input_array[2] = paddle.body.position.x / game.world.width;
	input_array[3] = paddle.body.position.y / game.world.width;
	actionix = brain.forward(input_array);

	// apply outputs of agents on environment
	if (actionix == 0) {
		paddle.body.position.x -= 5;		
	} else if (actionix == 1) {
		paddle.body.position.x += 5;
	}

    game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
    game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);

    // agents are given the opportunity to learn based on feedback of their action on environment
	reward = score;

	brain.backward(reward);

	msg.innerHTML = 'iteration: ' + tick + '<br>' +
		'score: ' + score + '<br>' +
		'ball.x ' + input_array[0].toFixed(3) + '<br>' +
		'ball.y ' + input_array[1].toFixed(3) + '<br>' +
		'paddle.x ' + input_array[2].toFixed(3) + '<br>' +
		'paddle.y ' + input_array[3].toFixed(3) + '<br>';
}

function ballHitBrick (_ball, _brick) {
	console.log('hit to brick');
    _brick.kill();

    score += 10;

	//  Are they any bricks left?
	if (bricks.countLiving() == 0) {
		//  New level starts
		score += 1000;
		//scoreText.text = 'score: ' + score;
		//introText.text = '- Next Level -';

		//  Let's move the ball back to the paddle
		//ballOnPaddle = true;
		//ball.body.velocity.set(0);
		//ball.x = paddle.x + 16;
		//ball.y = paddle.y - 16;
		//ball.animations.stop();

		//  And bring the bricks back from the dead :)
		bricks.callAll('revive');
	}
}

function ballHitPaddle (_ball, _paddle) {
	console.log('hit to paddle');
	_ball.body.velocity.x = 10*(_ball.x - _paddle.x);
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

