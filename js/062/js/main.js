function sample_code() {
	var num_inputs = 27; // 9 eyes, each sees 3 numbers (wall, green, red thing proximity)
	var num_actions = 5; // 5 possible angles agent can turn
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

	var brain = new deepqlearn.Brain(num_inputs, num_actions, opt); // woohoo

	//////////////////////////////
	//////////////////////////////

	var brain = new deepqlearn.Brain(3, 2); // 3 inputs, 2 possible outputs (0,1)
	var state = [Math.random(), Math.random(), Math.random()];
	for(var k=0;k<10000;k++) {
		var action = brain.forward(state); // returns index of chosen action
		//console.log(action)
		var reward = action === 0 ? 1.0 : 0.0;
		brain.backward([reward]); // <-- learning magic happens here
		state[Math.floor(Math.random()*3)] += Math.random()*2-0.5;
	}
	brain.epsilon_test_time = 0.0; // don't make any more random choices
	brain.learning = false;
	// get an optimal action from the learned policy
	var action = brain.forward(array_with_num_inputs_numbers);
}

var canvas, ctx;

// A 2D vector utility
var Vec = function(x, y) {
    this.x = x;
    this.y = y;
}
Vec.prototype = {
    // utilities
    dist_from: function(v) { return Math.sqrt(Math.pow(this.x-v.x,2) + Math.pow(this.y-v.y,2)); },
    length: function() { return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2)); },
    
    // new vector returning operations
    add: function(v) { return new Vec(this.x + v.x, this.y + v.y); },
    sub: function(v) { return new Vec(this.x - v.x, this.y - v.y); },
    rotate: function(a) {  // CLOCKWISE
        return new Vec(this.x * Math.cos(a) + this.y * Math.sin(a),
                       -this.x * Math.sin(a) + this.y * Math.cos(a));
    },
    
    // in place operations
    scale: function(s) { this.x *= s; this.y *= s; },
    normalize: function() { var d = this.length(); this.scale(1.0/d); }
}

// line intersection helper function: does line segment (p1,p2) intersect segment (p3,p4) ?
var line_intersect = function(p1,p2,p3,p4) {
    var denom = (p4.y-p3.y)*(p2.x-p1.x)-(p4.x-p3.x)*(p2.y-p1.y);
    if(denom===0.0) { return false; } // parallel lines
    var ua = ((p4.x-p3.x)*(p1.y-p3.y)-(p4.y-p3.y)*(p1.x-p3.x))/denom;
    var ub = ((p2.x-p1.x)*(p1.y-p3.y)-(p2.y-p1.y)*(p1.x-p3.x))/denom;
    if(ua>0.0&&ua<1.0&&ub>0.0&&ub<1.0) {
        var up = new Vec(p1.x+ua*(p2.x-p1.x), p1.y+ua*(p2.y-p1.y));
        return {ua:ua, ub:ub, up:up}; // up is intersection point
    }
    return false;
}

// line intersection helper function: does line segment (p1,p2) intersect point p0 with rad ?
var line_point_intersect = function(p1,p2,p0,rad) {
    var v = new Vec(p2.y-p1.y,-(p2.x-p1.x)); // perpendicular vector
    var d = Math.abs((p2.x-p1.x)*(p1.y-p0.y)-(p1.x-p0.x)*(p2.y-p1.y));
    d = d / v.length();
    if(d > rad) { return false; }
    
    v.normalize();
    v.scale(d);
    var up = p0.add(v);
    if(Math.abs(p2.x-p1.x)>Math.abs(p2.y-p1.y)) {
        var ua = (up.x - p1.x) / (p2.x - p1.x);
    } else {
        var ua = (up.y - p1.y) / (p2.y - p1.y);
    }
    if(ua>0.0&&ua<1.0) {
        return {ua:ua, up:up};
    }
    return false;
}

// item is box thing on the floor that agent can interact with (see or eat, etc)
var Item = function(x, y, type) {
    this.p = new Vec(x, y); // position
	this.rad = 10; // defauls size
}

var Ball = function(x, y, dir) {
	this.p = new Vec(x, y);
	this.op = this.p;
	this.dir = dir;
};

// Wall is made up of two points
var Wall = function(p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
};

// World object contains many agents and walls and food and stuff
var util_add_box = function(lst, x, y, w, h) {
    lst.push(new Wall(new Vec(x,y), new Vec(x+w,y)));
    lst.push(new Wall(new Vec(x+w,y), new Vec(x+w,y+h)));
    lst.push(new Wall(new Vec(x+w,y+h), new Vec(x,y+h)));
    lst.push(new Wall(new Vec(x,y+h), new Vec(x,y)));
}

var World = function() {
    this.clock = 0;
    this.agent = null;
	this.walls = [];
	this.balls = [];
};
World.prototype = {
    // helper function to get closest colliding walls/items
    stuff_collide_: function(p1, p2, check_walls, check_items) {
        var minres = false;

        // collide with walls
        if(check_walls) {
			for(var i=0,n=this.walls.length;i<n;i++) {
				var wall = this.walls[i];
				var res = line_intersect(p1, p2, wall.p1, wall.p2);
				if(res) {
					res.type = 0; // 0 is wall
					if(!minres) { minres=res; }
					else {
						// check if its closer
						if(res.ua < minres.ua) {
							// if yes replace it
							minres = res;
						}
					}
				}
			}
        }

        // collide with items
        if(check_items) {
			for(var i=0,n=this.items.length;i<n;i++) {
				var it = this.items[i];
				var res = line_point_intersect(p1, p2, it.p, it.rad);
				if(res) {
					res.type = it.type; // store type of item
					if(!minres) { minres=res; }
					else { if(res.ua < minres.ua) { minres = res; }
						 }
				}
			}
        }
        
        return minres;
    },
    tick: function() {
        // tick the environment
        this.clock++;
        
        // let the agent behave in the world based on their input
		this.agent.forward();
        
        // apply outputs of agents on evironment
		this.agent.op = this.agent.p; // back up old position

		// move ball
		this.ball.op = this.ball.p;
		this.ball.p.x += 3;

		// move agent
		// yet implemented

        // agent are given the opportunity to learn based on feedback of their action on environment
		this.agent.backward();
    }
};

var Agent = function() {
    this.p = new Vec(50, 50);
    this.op = this.p; // old position
};
Agent.prototype = {
	forward: function() {
	},
	backward: function() {
	}
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;

    // draw walls in environment
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.beginPath();
	ctx.moveTo(100, 100);
	ctx.lineTo(200, 100);
	ctx.moveTo(100, 200);
	ctx.lineTo(200, 200);
    ctx.stroke();

    // draw agents
    ctx.fillStyle = "rgb(150, 150, 150)";
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.beginPath();
    ctx.arc(w.ball.p.x, w.ball.p.y, 10, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();

    //w.agents[0].brain.visSelf(document.getElementById('brain_info_div'));
}

function tick() {
    w.tick();
    if(!skipdraw || w.clock % 50 === 0) {
        draw();
    }
}

function gofast() {
    window.clearInterval(current_interval_id);
    current_interval_id = setInterval(tick, 0);
    skipdraw = false;
    simspeed = 2;
}

function gonormal() {
    window.clearInterval(current_interval_id);
    current_interval_id = setInterval(tick, 30);
    skipdraw = false;
    simspeed = 1;
}

var w; // global world object
var current_interval_id;
var skipdraw = false;
function start() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    w = new World();
    w.agent = new Agent();
	w.ball = new Ball(50, 30, 0);

    gonormal();
}

window.onload = function() {
	start();
};
