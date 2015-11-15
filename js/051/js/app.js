var App = function() {
	this.camera, this.scene, this.renderer;
	this.effect, this.controls;
	this.element, this.container;
	this.clock = new THREE.Clock();
	this.fish;
};

App.prototype.init = function() {
	this.renderer = new THREE.WebGLRenderer();
	this.element = this.renderer.domElement;
	this.container = document.getElementById('example');
	this.container.appendChild(this.element);

	this.effect = new THREE.StereoEffect(this.renderer);

	this.scene = new THREE.Scene();

	this.camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
	this.camera.position.set(0, 10, 0);
	this.scene.add(this.camera);

	this.controls = new THREE.OrbitControls(this.camera, this.element);
	this.controls.rotateUp(Math.PI / 4);
	this.controls.target.set(
		this.camera.position.x + 0.1,
		this.camera.position.y,
		this.camera.position.z
	);
	this.controls.noZoom = true;
	this.controls.noPan = true;

	function setOrientationControls(e) {
		if (!e.alpha) {
			return;
		}

		this.controls = new THREE.DeviceOrientationControls(this.camera, true);
		this.controls.connect();
		this.controls.update();

		this.element.addEventListener('click', fullscreen, false);

		window.removeEventListener('deviceorientation', setOrientationControls.bind(this), true);
	}
	window.addEventListener('deviceorientation', setOrientationControls.bind(this), true);


	var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
	this.scene.add(light);

	var texture = THREE.ImageUtils.loadTexture(
		'textures/patterns/checker.png'
	);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat = new THREE.Vector2(50, 50);
	texture.anisotropy = this.renderer.getMaxAnisotropy();

	var material = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		specular: 0xffffff,
		shininess: 20,
		shading: THREE.FlatShading,
		map: texture
	});

	var geometry = new THREE.PlaneGeometry(1000, 1000);

	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = -Math.PI / 2;
	this.scene.add(mesh);

	window.addEventListener('resize', this.resize.bind(this), false);
	setTimeout(this.resize.bind(this), 1);

//////////////////////////////
var Fish = function() {
	this.color = Math.random()*0xffffff;

	var material = new THREE.MeshBasicMaterial({
        color: this.color,
        side: THREE.DoubleSide
    });
    var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3( 0,  0,  0));
	geometry.vertices.push(new THREE.Vector3(10,  0, 10));
	geometry.vertices.push(new THREE.Vector3(20,  0,  0));
	geometry.vertices.push(new THREE.Vector3(25,  0,  5));
	geometry.vertices.push(new THREE.Vector3(25,  0, -5));
	geometry.vertices.push(new THREE.Vector3(20,  0,  0));
	geometry.vertices.push(new THREE.Vector3(10,  0,-10));
	geometry.vertices.push(new THREE.Vector3( 0,  0,  0));
	geometry.faces.push(new THREE.Face3(0, 1, 2));
	geometry.faces.push(new THREE.Face3(2, 3, 4));
	geometry.faces.push(new THREE.Face3(5, 6, 7));

	this.line = new THREE.Mesh(geometry, material);
	this.state = 0;
};

Fish.prototype.setSeed = function(s) {
	this.state = s;
};

Fish.prototype.setSize = function(s) {
	this.line.position.set(x, y, z);
};

Fish.prototype.get3DObject = function() {
	return this.line;
};

Fish.prototype.animate = function() {
	this.line.geometry.vertices.forEach(function(v) {
		v.y = Math.cos(v.x / 8 - this.state);
	}.bind(this));
	this.line.geometry.verticesNeedUpdate = true;
	this.state += 0.1;
};

Fish.prototype.setPosition = function(x, y, z) {
	this.line.position.set(x, y, z);
};
//////////////////////////////

	this.fish = new Fish();
	this.fish.setPosition(20, 40, 100);
	this.fish.setSeed(0);
	this.scene.add(this.fish.get3DObject());
}

App.prototype.resize = function() {
	var width = this.container.offsetWidth;
	var height = this.container.offsetHeight;

	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize(width, height);
	this.effect.setSize(width, height);
}

App.prototype.update = function(dt) {
	this.resize();

	this.camera.updateProjectionMatrix();

	this.controls.update(dt);
}

App.prototype.render = function(dt) {
	this.effect.render(this.scene, this.camera);
}

App.prototype.animate = function(t) {
	requestAnimationFrame(this.animate.bind(this));

	this.update(this.clock.getDelta());
	this.render(this.clock.getDelta());

	//////////////////////////////
	this.fish.animate();
}

App.prototype.fullscreen = function() {
	if (this.container.requestFullscreen) {
		this.container.requestFullscreen();
	} else if (this.container.msRequestFullscreen) {
		this.container.msRequestFullscreen();
	} else if (this.container.mozRequestFullScreen) {
		this.container.mozRequestFullScreen();
	} else if (this.container.webkitRequestFullscreen) {
		this.container.webkitRequestFullscreen();
	}
}

var app = new App();
	
app.init();
app.animate();

