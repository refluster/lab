var Apl = function() {
	this.simulating = false;

	// environment parameter
	this.radius = 5; // raduis of balls
	this.particles = [];
	this.sph = new Sph();
	this.sph.init();

	// set events
	var $btn = $('#stbtn1'); // start button
	$btn.mousedown(this.start.bind(this));
	$btn.text('start');

	// three.js
	const renderer = new THREE.WebGLRenderer( { 'canvas' : $('#canvas')[0] } );
	renderer.setSize(800, 600);
	document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera();
    camera.position.x = 200;
    camera.position.y = 200;
    camera.position.z = 500;

    scene = new THREE.Scene();
    scene.add( camera );

	this.p_threejs = [];
	for (var i = 0; i < this.sph.get_particle().length; i++) {
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

Apl.prototype.moveObj = function() {
	this.sph.step();

	// three.js
	var p = this.sph.get_particle();
	for (var i = 0; i < p.length; i++) {
        this.p_threejs[i].position.x = p[i].pos.x*8;
		this.p_threejs[i].position.y = p[i].pos.y*8;
	}
};

$(function() {
    var apl = new Apl();
});
