var App = function() {
	this.camera, this.scene, this.renderer;
	this.effect, this.controls;
	this.element, this.container;
	this.clock;
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
	this.camera.position.set(0, 0, 200);
	this.scene.add(this.camera);

	this.controls = new THREE.OrbitControls(this.camera, this.element);
	this.controls.rotateUp(Math.PI / 4);
	this.controls.target.set(0, 0, 0);
	this.controls.noZoom = true;
	this.controls.noPan = true;

	var light = new THREE.PointLight(0xffffff, 1.0);
	// We want it to be very close to our character
	light.position.set(1000, 1000, 1000);
	this.scene.add(light);

	//////////////////////////////
	{
		// objects for shader test 000
		var material = new THREE.ShaderMaterial({
			vertexShader: document.getElementById('vshader').textContent,
			fragmentShader: document.getElementById('fshader').textContent,
			uniforms: THREE.UniformsUtils.merge([
				THREE.UniformsLib['lights'],
			]),
			lights: true,
		});
		var geometry =  new THREE.SphereGeometry(30, 32, 16);

		this.sphere = new THREE.Mesh(geometry, material);
		this.sphere.position.x = 100;
		this.sphere.position.z = 10;
		this.scene.add(this.sphere);
	}
	//////////////////////////////

	//////////////////////////////
	{
		// objects for shader test 001
		var material = new THREE.ShaderMaterial({
			vertexShader: document.getElementById('vshader').textContent,
			fragmentShader: document.getElementById('fshader').textContent,
			uniforms: THREE.UniformsUtils.merge([
				THREE.UniformsLib['lights'],
			]),
			lights: true,
		});
		var geometry = new THREE.CubeGeometry(50, 50, 50);
		this.cube = new THREE.Mesh(geometry, material);
		this.cube.position.x = -100;
		this.scene.add(this.cube);
	}
	//////////////////////////////

	////////////////////////////// original obj
	{
		var defp = [
			[ 0.0,  0.0,  0.0],
			[ 0.0,  0.0, 80.0],
			[ 0.0, 80.0,  0.0],
			[ 0.0, 80.0, 80.0],
			[80.0,  0.0,  0.0],
			[80.0,  0.0, 80.0],
			[80.0, 80.0,  0.0],
			[80.0, 80.0, 80.0],
		];

		var geometry = new THREE.Geometry();
		defp.forEach(function(p) {
			geometry.vertices.push(new THREE.Vector3(p[0], p[1], p[2]));
		}.bind(this));

		// create faces
		geometry.faces.push(new THREE.Face3(7, 5, 6));
		geometry.faces.push(new THREE.Face3(7, 6, 3));

		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

		var material2 = new THREE.MeshNormalMaterial();

		// objects for shader test 001
		var material = new THREE.ShaderMaterial({
			vertexShader: document.getElementById('vshader').textContent,
			fragmentShader: document.getElementById('fshader').textContent,
			uniforms: THREE.UniformsUtils.merge([
				THREE.UniformsLib['lights'],
			]),
			lights: true,
		});

		mesh = new THREE.Mesh(geometry, material);
//		mesh.scale.set(10, 10, 10);
//		mesh.position.set(0, 200, 0);

		this.scene.add(mesh);
	}

	////////////////////////////// floor
	{
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
		mesh.position.y = -100;
		this.scene.add(mesh);
	}

	window.addEventListener('resize', this.resize.bind(this), false);
	setTimeout(this.resize.bind(this), 1);
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
};

App.prototype.animate = function(t) {
	requestAnimationFrame(this.animate.bind(this));

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
