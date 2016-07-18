const space = {x: [-500, 500], y: [5, 120], z: [-500, 500]};
const fishNum = 60;

var App = function() {
	this.useDeviceOrientationControl = false;
	this.useStereoEffect = false;
};

App.prototype.init = function() {
	this.renderer = new THREE.WebGLRenderer();
	this.effect = new THREE.StereoEffect(this.renderer);
	this.renderer.setClearColor(new THREE.Color(0x000000));
	this.element = this.renderer.domElement;
	this.container = document.getElementById('example');
	this.container.appendChild(this.element);
	this.clock = new THREE.Clock();
	this.camera = new THREE.PerspectiveCamera(90, 1, 0.001, 2000);
	this.camera.position.set(0, 10, 0);
	this.scene = new THREE.Scene();
	this.scene.add(this.camera);

	if (this.useDeviceOrientationControl) {
		this.controls = new THREE.DeviceOrientationControls(this.camera, true);
		this.controls.connect();
	} else {
		this.controls = new THREE.OrbitControls(this.camera, this.element);
		this.controls.rotateUp(Math.PI / 4);
		this.controls.target.set(100, 100, 0);
		this.controls.noPan = true;
	}

	var light = new THREE.PointLight(0xffffff, 1.0);
	light.position.set(100, 100, 100);
	this.scene.add(light);

	window.addEventListener('resize', this.resize.bind(this), false);
	setTimeout(this.resize.bind(this), 1);

	this.initFloor();
	this.initObject();

	{
		// objects for shader test
		var shadermaterial = new THREE.ShaderMaterial({
			vertexShader: document.getElementById('vshader-gouraud').textContent,
			fragmentShader: document.getElementById('fshader-gouraud').textContent,
			uniforms: THREE.UniformsUtils.merge([
				THREE.UniformsLib['lights'],
				{
					color: {type: 'f', value: 0.0},
				}
			]),
			lights: true,
		});
		var geometry =  new THREE.SphereGeometry(20, 32, 16);

		this.testObj = new THREE.Mesh(geometry, shadermaterial);
		this.testObj.position.x = 60;
		this.testObj.position.y = 40;
		this.scene.add(this.testObj);
	}
};

App.prototype.initObject = function(){
	this.fish = [];

	for (var i = 0; i < fishNum; i++) {
		this.fish.push(new Fish3d());
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

	this.fishes = new Fish3d();
	this.scene.add(this.fishes.getObject());
};

App.prototype.initFloor = function() {
	var texture = THREE.ImageUtils.loadTexture('textures/patterns/checker.png');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat = new THREE.Vector2(20, 20);
	texture.anisotropy = this.renderer.getMaxAnisotropy();

	var material = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		specular: 0xffffff,
		shininess: 0,
		shading: THREE.FlatShading,
		map: texture,
	});

	var geometry = new THREE.PlaneGeometry(2000, 2000);
	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = -Math.PI / 2;
//	this.scene.add(mesh);

	{
		// max depth from the camera
		var shadermaterial = new THREE.ShaderMaterial({
			vertexShader: document.getElementById('vshader-water').textContent,
			fragmentShader: document.getElementById('fshader-water').textContent,
			side: THREE.BackSide,
			uniforms: THREE.UniformsUtils.merge([
				THREE.UniformsLib['lights'],
			]),
			lights: true,
		});
		var geometry =  new THREE.SphereGeometry(700, 16, 16);

		this.testObj = new THREE.Mesh(geometry, shadermaterial);
		this.testObj.position.x = 120;
		this.testObj.position.y = 80;
		this.scene.add(this.testObj);
	}
};

App.prototype.resize = function() {
	var width = this.container.offsetWidth;
	var height = this.container.offsetHeight;

	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize(width, height);
	this.effect.setSize(width, height);
};

App.prototype.update = function(t) {
	requestAnimationFrame(this.update.bind(this));

	this.fishes.animation();

	var dt = this.clock.getDelta()
	this.controls.update(dt);

	if (this.useStereoEffect) {
		this.effect.render(this.scene, this.camera);
	} else {
		this.renderer.render(this.scene, this.camera);
	}
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
app.update();
