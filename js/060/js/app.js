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
	this.camera = new THREE.PerspectiveCamera(90, 1, 0.001, 20000000);
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
	this.initWaterSurface();
	this.initObject();
	this.initSkyBox();

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
//	this.cloudFish = new CloudFish(this.scene);
//	this.cloudFish.move(0, 20, 100);
//
//	this.cloudFish2 = new CloudFish(this.scene);
//	this.cloudFish2.move(-30, -40, -60);
//
//	this.cloudFish3 = new CloudFish(this.scene);
//	this.cloudFish3.move(30, 40, -60);
};

App.prototype.initSkyBox = function() {
	var cubeMap = new THREE.CubeTexture([]);
	cubeMap.format = THREE.RGBFormat;

	var loader = new THREE.ImageLoader();
	loader.load('textures/skyboxsun25degtest.png', function(image) {
		var getSide = function(x, y) {
			var size = 1024;
			var canvas = document.createElement('canvas');
			canvas.width = size;
			canvas.height = size;
			var context = canvas.getContext('2d');
			context.drawImage(image, - x * size, - y * size);
			return canvas;
		};
		cubeMap.images[0] = getSide(2, 1); // px
		cubeMap.images[1] = getSide(0, 1); // nx
		cubeMap.images[2] = getSide(1, 2); // py
		cubeMap.images[3] = getSide(1, 0); // ny
		cubeMap.images[4] = getSide(1, 1); // pz
		cubeMap.images[5] = getSide(3, 1); // nz
		cubeMap.needsUpdate = true;
	});

	var cubeShader = THREE.ShaderLib['cube'];
	cubeShader.uniforms['tCube'].value = cubeMap;

	var skyBoxMaterial = new THREE.ShaderMaterial( {
		fragmentShader: cubeShader.fragmentShader,
		vertexShader: cubeShader.vertexShader,
		uniforms: cubeShader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	});

	var skyBox = new THREE.Mesh(
		new THREE.BoxGeometry(1000000, 1000000, 1000000),
		skyBoxMaterial
	);
	this.scene.add(skyBox);
};

App.prototype.initWaterSurface = function() {
	this.timeStamp = 0.0;

	this.waterNormals = new THREE.ImageUtils.loadTexture( 'textures/waternormals.jpg' );
	this.waterNormals.wrapS = this.waterNormals.wrapT = THREE.RepeatWrapping;

	var r = 0.6;
	var color = {r: (7*r + 90*(1-r))/255,
				 g: (25*r + 220*(1-r))/255,
				 b: (40*r + 255*(1-r))/255};

	// max depth from the camera
	var shadermaterial = new THREE.ShaderMaterial({
		vertexShader: document.getElementById('vshader-water-surface').textContent,
		fragmentShader: document.getElementById('fshader-water-surface').textContent,
		uniforms: THREE.UniformsUtils.merge([
			THREE.UniformsLib['lights'],
			{
				time: { type: 'f', value: this.timeStamp},
				normalSampler: { type: 't', value: null},
				sunColor: { type: "c", value: new THREE.Color(0xffffff)},
				sunDirection: { type: "v3", value: new THREE.Vector3( 0.70707, 0.70707, 0.0 )},
				waterColor: { type: "c", value: new THREE.Color(color.r, color.g, color.b)},
			},
		]),
		lights: true,
	});

	shadermaterial.uniforms.normalSampler.value = this.waterNormals;

	var geometry = new THREE.PlaneGeometry( 2100, 2100, 1, 1);
	var mesh = new THREE.Mesh(geometry, shadermaterial);
	mesh.position.y = 150;
	mesh.rotateX(Math.PI/2);
	this.scene.add(mesh);
	this.waterSurface = mesh;
};

App.prototype.waterSurfaceAnimation = function() {
	this.waterSurface.material.uniforms.time.value = this.timeStamp;
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
	var geometry =  new THREE.SphereGeometry(1000, 8, 8, 0, Math.PI);
	
	this.testObj = new THREE.Mesh(geometry, shadermaterial);
	this.testObj.position.y = 200;
	this.testObj.rotation.set(Math.PI/2, 0, 0);
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
	this.timeStamp += 1.0/60.0;

	this.waterSurfaceAnimation();

	requestAnimationFrame(this.update.bind(this));

//	this.cloudFish.animate();
//	this.cloudFish2.animate();
//	this.cloudFish3.animate();

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
