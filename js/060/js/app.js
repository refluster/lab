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
	light.position.set(10000, 10000, 10000);
	this.scene.add(light);

	window.addEventListener('resize', this.resize.bind(this), false);
	setTimeout(this.resize.bind(this), 1);

	this.initFloor();
//	this.initWaterSurface();
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
	this.cloudFish = new CloudFish(this.scene);
};

App.prototype.initWaterSurface = function() {
	this.timeStamp = 0.0;

	// max depth from the camera
	var shadermaterial = new THREE.ShaderMaterial({
		vertexShader: document.getElementById('vshader-water-surface').textContent,
		fragmentShader: document.getElementById('fshader-water-surface').textContent,
        wireframe: true,
		uniforms: THREE.UniformsUtils.merge([
			THREE.UniformsLib['lights'],
			{
				time: { type: 'f', value: this.timeStamp}
			},
		]),
		lights: true,
	});
	var geometry = new THREE.PlaneGeometry( 1400, 1400, 64, 64);
	var mesh = new THREE.Mesh(geometry, shadermaterial);
	mesh.position.x = 120;
	mesh.position.y = this.timeStamp;
	mesh.rotateX(Math.PI/2);
	this.scene.add(mesh);
	this.waterSurface = mesh;
};

App.prototype.waterSurfaceAnimation = function() {
	var base = this.waterSurface.position.y;

	this.waterSurface.geometry.vertices.forEach(function(v) {
		v.z = base +
			Math.cos(this.timeStamp/32 + v.x/32) * 6 +
			Math.cos(this.timeStamp/32 + v.y/64) * 8 +
			Math.cos(this.timeStamp/32 + v.x/32 + v.y/32 + 1) * 8;
	}.bind(this));
	this.waterSurface.geometry.verticesNeedUpdate = true;
};

App.prototype.initFloor = function() {
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
	this.timeStamp += 1.0;

//	this.waterSurfaceAnimation();

	requestAnimationFrame(this.update.bind(this));

	this.cloudFish.animate();

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
