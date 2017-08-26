var Apl = function() {
	this.simulating = false;
	this.timer = $.timer();
	this.fps = 60;

	var $canvas = $('#canvas');
	if ( ! $canvas[0] || ! $canvas[0].getContext ) { return false; }
	this.ctx = $canvas[0].getContext("2d");
	this.ctx.globalCompositeOperation = "source-over";

	// canvas
	this.canvasWidth = $canvas.width();
	this.canvasHeight = $canvas.height();
	this.PI2 = Math.PI * 2; // 2*pi

	// set the position of the canvas on the browser
	var $cvdiv = $('#canvas');
	this.canvasLeft = $cvdiv.offset().left;
	this.canvasTop = $cvdiv.offset().top;

	// environment parameter
	this.radius = 5; // raduis of balls
	this.particles = [];
	this.sph;

	this.sph = new Sph();
	this.sph.init();

	this.init();
	this.draw();

	// set events
	var $btn = $('#stbtn1'); // start button
	$btn.mousedown(this.start.bind(this));
	$btn.text('start');

	var count = 0;
	var dateOrigin = new Date();

	this.timer.set({
		action: function() {
			count ++;
			if (count == 400) {
				console.log(new Date() - dateOrigin);
			}
			this.moveObj();
			this.draw();
		}.bind(this),
		time: 1000/this.fps
	});


	// three.js
	const renderer = new THREE.WebGLRenderer( { 'canvas' : $('#canvas2')[0] } );
	renderer.setSize(800, 600);
	document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera();
    camera.position.x = 200;
    camera.position.y = 200;
    camera.position.z = 500;

    scene = new THREE.Scene();
    scene.add( camera );

	/*
	// triangle
    var material = new THREE.MeshBasicMaterial( { color: 0xeeee00 } );
    var shape = new THREE.Shape();
    shape.moveTo(  0, 100 );
    shape.lineTo(  100, -50 );
    shape.lineTo( -100, -50 );
    shape.lineTo(  0, 100 );
    var geometry = new THREE.ShapeGeometry( shape );
    scene.add( new THREE.Mesh( geometry, material ) );
	*/

	var p = this.sph.get_particle();
	this.p_threejs = [];

	for (var i = 0; i < p.length; i++) {

		// triangle
		var material = new THREE.MeshBasicMaterial( { color: 0xeeee00 } );
		var shape = new THREE.Shape();
		shape.moveTo(  0, 0 );
		shape.lineTo(  -this.radius, this.radius*2 );
		shape.lineTo(   this.radius, this.radius*2 );
		shape.lineTo(  0, 0 );
		var geometry = new THREE.ShapeGeometry( shape );
		var mesh = new THREE.Mesh( geometry, material);
		this.p_threejs.push(mesh);
		scene.add(mesh);
	}

	function animate() {
		requestAnimationFrame(animate.bind(this));
		this.moveObj();
		this.draw();
		renderer.clear();
		renderer.render(scene, camera);
	}

	animate.call(this);
};

Apl.prototype.start = function() {
	var $btn = $('#stbtn1'); // start button

	if (!this.simulating) { // if not playing
		// init canvas
		this.init();
		this.simulating = true;
		this.timer.play();
		$btn.text('stop');
	} else { // if playing
		this.simulating = false;
		this.timer.pause();
		$btn.text('start');
	}
};

Apl.prototype.init = function() {
};

Apl.prototype.moveObj = function() {
	this.sph.step();

	// three.js
	var p = this.sph.get_particle();
	for (var i = 0; i < p.length; i++) {
        this.p_threejs[i].position.x = p[i].pos.x*8;
		this.p_threejs[i].position.y = p[i].pos.y*8;
	}
};

Apl.prototype.draw = function() {
	this.ctx.fillStyle = '#000000';
	this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

	this.ctx.fillStyle = '#aaaaff';
	var p = this.sph.get_particle();
	for (var i = 0; i < p.length; i++) {
        this.ctx.fillRect(p[i].pos.x*8 - this.radius,
						  this.canvasHeight - p[i].pos.y*8,
						  this.radius*2, this.radius*2);
	}
};

$(function() {
    var apl = new Apl();
});
