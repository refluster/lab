const space = {x: [-200, 200], y: [5, 40], z: [-200, 200]};
const fishNum = 60;

var App = function() {
	this.camera, this.scene, this.renderer;
	this.effect, this.controls;
	this.element, this.container;
	this.clock;
	this.fish;
};

App.prototype.init = function() {
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setClearColor(new THREE.Color(0x000000));
	this.element = this.renderer.domElement;
	this.container = document.getElementById('example');
	this.container.appendChild(this.element);
	this.clock = new THREE.Clock();

	this.effect = new THREE.StereoEffect(this.renderer);

	this.scene = new THREE.Scene();

	this.camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
	this.camera.position.set(0, 10, 0);
//	this.camera.position.set(0, 200, 0);
	this.scene.add(this.camera);

	this.controls = new THREE.OrbitControls(this.camera, this.element);
	this.controls.rotateUp(Math.PI / 4);
	this.controls.target.set(
		100, 100, 0
//		100, 0, 0
//		this.camera.position.x + 0.1,
//		this.camera.position.y,
//		this.camera.position.z
	);
	this.controls.noZoom = true;
	this.controls.noPan = true;

	var setOrientationControls = function(e) {
		if (!e.alpha) {
			return;
		}

		this.controls = new THREE.DeviceOrientationControls(this.camera, true);
		this.controls.connect();
		this.controls.update();

		this.element.addEventListener('click', this.fullscreen.bind(this), false);

		window.removeEventListener('deviceorientation', setOrientationControls, true);
	}.bind(this)
//	window.addEventListener('deviceorientation', setOrientationControls, true);


/*
	hemiLight = new THREE.HemisphereLight( 0xffffff,
										   0xffffff, 0.6 );
//	hemiLight.color.setHSL( 0.6, 1, 0.6 );
//	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 500, 0 );
	hemiLight.visible = true;
	this.scene.add( hemiLight );
*/

	var light = new THREE.PointLight(0xffffff, 1.0);
	// We want it to be very close to our character
	light.position.set(100, 100, 100);
	this.scene.add(light);

	//////////////////////////////
	{
		// objects for shader test 000
		var shadermaterial = new THREE.ShaderMaterial({
			vertexShader: document.getElementById('vshader').textContent,
			fragmentShader: document.getElementById('fshader').textContent,
			uniforms: THREE.UniformsUtils.merge([
				THREE.UniformsLib['lights'],
				{
					color: {type: 'f', value: 0.0},
				}
			]),
			lights: true,
		});
		var gSphere =  new THREE.SphereGeometry(30, 32, 16);
		this.testObj = new THREE.Mesh(gSphere, shadermaterial);
		this.testObj.position.x = 100;
		this.testObj.position.z = 10;
		this.scene.add(this.testObj);
	}
	//////////////////////////////

	//////////////////////////////
	{
		// objects for shader test 001
		var shadermaterial = new THREE.ShaderMaterial({
			vertexShader: document.getElementById('vshader').textContent,
			fragmentShader: document.getElementById('fshader').textContent,
			uniforms: THREE.UniformsUtils.merge([
				THREE.UniformsLib['lights'],
				{
					color: {type: 'f', value: 0.0},
				}
			]),
			lights: true,
		});
		var gSphere =  new THREE.SphereGeometry(20, 32, 16);
		this.testObj = new THREE.Mesh(gSphere, shadermaterial);
		this.testObj.position.x = 60;
		this.scene.add(this.testObj);
	}
	//////////////////////////////

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
		map: texture,
	});

	var geometry = new THREE.PlaneGeometry(1000, 1000);

	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = -Math.PI / 2;
	this.scene.add(mesh);

	window.addEventListener('resize', this.resize.bind(this), false);
	setTimeout(this.resize.bind(this), 1);

	this.initObject();
};

App.prototype.initObject = function(){
	this.fish = [];

	for (var i = 0; i < fishNum; i++) {
		this.fish.push(new Fish());
	}

	this.fish.forEach(function(f) {
		var x = (Math.random()*(space.x[1] - space.x[0]) + space.x[0]);
		var y = (Math.random()*(space.y[1] - space.y[0]) + space.y[0]);
		var z = (Math.random()*(space.z[1] - space.z[0]) + space.z[0]);
		f.setPosition(x, y, z);
		f.setSize(.4);
		f.setSeed(Math.random() * Math.PI * 2);
		f.setSpeed({x: -.5, y: 0, z: 0});
		this.scene.add(f.get3DObject());
	}.bind(this));

	this.fishes = new Fishes();
	this.scene.add(this.fishes.getObject());
};

App.prototype.resize = function() {
	var width = this.container.offsetWidth;
	var height = this.container.offsetHeight;

	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize(width, height);
	this.effect.setSize(width, height);
};

App.prototype.update = function(dt) {
	this.resize();

	this.camera.updateProjectionMatrix();

	this.controls.update(dt);
};

App.prototype.render = function(dt) {
	this.renderer.render(this.scene, this.camera);
//	this.effect.render(this.scene, this.camera);
};

App.prototype.animate = function(t) {
	requestAnimationFrame(this.animate.bind(this));

	this.fishes.animation();

	this.update(this.clock.getDelta());
	this.render(this.clock.getDelta());
};

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
};

var app = new App();

app.init();
app.animate();
