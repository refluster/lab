var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var Apl = function() {
	this.simulating = false;

	// environment parameter
	this.radius = 20; // raduis of balls
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
    camera.position.x = 250;
    camera.position.y = 250;
    camera.position.z = 600;

    scene = new THREE.Scene();
    scene.add( camera );

	var geometry = new THREE.PlaneGeometry( 150, 150, 64, 64 );
	var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	var mesh = new THREE.Mesh( geometry, material);
	scene.add(mesh);

	this.p_hold_idx = undefined;

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
		mesh.idx = i;
	}

	this.mouse = {};
	this.mouse_hold = {};
	this.hold_pos = {};

	//$('#canvas').on('touchstart mousedown', function(e) {
	$('#canvas').on('touchstart', function(e) {
		mouse.x = ( e.touches[0].clientX / window.innerWidth ) * 2 - 1;
		mouse.y = -( e.touches[0].clientY / window.innerHeight ) * 2 + 1;
		this.mouse_hold.x = this.mouse.x = e.touches[0].clientX;
		this.mouse_hold.y = this.mouse.y = e.touches[0].clientY;
		raycaster.setFromCamera( mouse, camera );
		intersects = raycaster.intersectObjects( scene.children );
		for ( var i = 0; i < intersects.length; i++ ) {
			//intersects[i].object.material.color.set( 0x000000 );
		}
		if (intersects.length > 0) {
			this.p_hold_idx = intersects[0].object.idx;
			this.hold_pos.x = this.sph.get_particle()[this.p_hold_idx].pos.x;
			this.hold_pos.y = this.sph.get_particle()[this.p_hold_idx].pos.y;
		}
		console.log(intersects);
	}.bind(this));

	$('#canvas').on('touchmove mousemove', function(e) {
		if (e.touches) {
			this.mouse.x = e.touches[0].clientX;
			this.mouse.y = e.touches[0].clientY;
			console.log(this.mouse);
			//console.log(this.p_threejs);
		}
	}.bind(this));

	$('#canvas').on('touchend mouseup', function(e) {
		this.p_hold_idx = undefined;
	}.bind(this));

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
		$btn.text('stop');
	} else { // if playing
		this.simulating = false;
		$btn.text('start');
	}
};

Apl.prototype.moveObj = function() {
	if (this.p_hold_idx) {
		console.log(this);
		var moveX = this.mouse.x - this.mouse_hold.x;
		var moveY = this.mouse.y - this.mouse_hold.y;
		var p = this.sph.get_particle();
		p[this.p_hold_idx].pos.x = this.hold_pos.x + moveX/16;
		p[this.p_hold_idx].pos.y = this.hold_pos.y + moveY/16;
		console.log(moveX, moveY);
	}
	this.sph.step();

	// three.js
	var p = this.sph.get_particle();
	for (var i = 0; i < p.length; i++) {
        this.p_threejs[i].position.x = p[i].pos.x*16;
		this.p_threejs[i].position.y = p[i].pos.y*16;
	}
};

$(function() {
    var apl = new Apl();
});
