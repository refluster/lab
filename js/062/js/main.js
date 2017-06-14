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

// line intersection helper function: does line segment (p1,p2) intersect segment (p3,p4) ?
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

var Wall = function(p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
};

World.prototype = {
};

Agent.prototype = {
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
    ctx.arc(150, 150, 40, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();

    //w.agents[0].brain.visSelf(document.getElementById('brain_info_div'));
}

function start() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
	draw();

    //w = new World();
    //w.agents = [new Agent()];

    //gofast();
}

window.onload = function() {
	start();
};
