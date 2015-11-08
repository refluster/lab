var App = function() {
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	this.camera.position.z = 5;

	this.addBox();

	var render = function() {
		requestAnimationFrame(render);
		this.animateBox();
		renderer.render(this.scene, this.camera);
	}.bind(this);

	render();
};

App.prototype.addBox = function() {
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	this.cube = new THREE.Mesh( geometry, material );
	this.scene.add(this.cube);
};

App.prototype.animateBox = function() {
	this.cube.rotation.x += 0.01;
	this.cube.rotation.y += 0.01;
};

var app = new App();
