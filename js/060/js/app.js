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
		100, 200, 0
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
			vertexShader: document.getElementById('vshader000').textContent,
			fragmentShader: document.getElementById('fshader000').textContent,
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
			vertexShader: document.getElementById('vshader001').textContent,
			fragmentShader: document.getElementById('fshader001').textContent,
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

	var fishes = new Fishes();
	this.mesh = fishes.getObject();
	this.scene.add(this.mesh);
	return;

	// 3d fish
	{
		var geometry = new THREE.Geometry();
		
		// x = 0
		geometry.vertices.push(new THREE.Vector3(0.0,  0.0,  0.0));
		geometry.vertices.push(new THREE.Vector3(0.0,  0.0,  0.0));
		geometry.vertices.push(new THREE.Vector3(0.0,  0.0,  0.0));
		geometry.vertices.push(new THREE.Vector3(0.0,  0.0,  0.0));

		// x = 0.5
		geometry.vertices.push(new THREE.Vector3(0.5,  0.4,  0.0));
		geometry.vertices.push(new THREE.Vector3(0.5,  0.0, -0.2));
		geometry.vertices.push(new THREE.Vector3(0.5, -0.4,  0.0));
		geometry.vertices.push(new THREE.Vector3(0.5,  0.0,  0.2));

		// x  = 2.0
		geometry.vertices.push(new THREE.Vector3(2.0,  0.8,  0.0));
		geometry.vertices.push(new THREE.Vector3(2.0,  0.0, -0.6));
		geometry.vertices.push(new THREE.Vector3(2.0, -0.8,  0.0));
		geometry.vertices.push(new THREE.Vector3(2.0,  0.0,  0.6));
		
		// x  = 3.0
		geometry.vertices.push(new THREE.Vector3(3.0,  1.0,  0.0));
		geometry.vertices.push(new THREE.Vector3(3.0,  0.0, -0.5));
		geometry.vertices.push(new THREE.Vector3(3.0, -0.7,  0.0));
		geometry.vertices.push(new THREE.Vector3(3.0,  0.0,  0.5));
		
		// x  = 6.0
		geometry.vertices.push(new THREE.Vector3(7.0,  0.2,  0.0));
		geometry.vertices.push(new THREE.Vector3(7.0,  0.0, -0.1));
		geometry.vertices.push(new THREE.Vector3(7.0, -0.2,  0.0));
		geometry.vertices.push(new THREE.Vector3(7.0,  0.0,  0.1));
							   
		// x  = 7.0
		geometry.vertices.push(new THREE.Vector3(8.0,  0.4,  0.0));
		geometry.vertices.push(new THREE.Vector3(8.0,  0.0,  0.0));
		geometry.vertices.push(new THREE.Vector3(8.0, -0.4,  0.0));
		geometry.vertices.push(new THREE.Vector3(8.0,  0.0,  0.0));

		// create faces
		for (var i = 0; i < 5; i++) {
			for (var j = 0; j < 4; j++) {
				var b = i*4 + j;
				var idx = [
					b,
					b + 1 - (j + 1 < 4 ? 0: 4),
					b + 4,
					b + 5 - (j + 1 < 4 ? 0: 4)];
				geometry.faces.push(new THREE.Face3(idx[0], idx[2], idx[1]));
				geometry.faces.push(new THREE.Face3(idx[1], idx[2], idx[3]));
			}
		}

		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

		var material = new THREE.MeshNormalMaterial();

		var mesh = new THREE.Mesh(geometry, material);
		mesh.scale.set(30, 30, 30);
		mesh.position.set(0, 200, 0);
		this.scene.add(mesh);
		this.mesh = mesh;
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

	this.update(this.clock.getDelta());
	this.render(this.clock.getDelta());

/*
	this.fish.forEach(function(f) {
		f.animate();
		var p = f.getPosition();
		if (p.x < space.x[0] || p.x > space.x[1] ||
			p.y < space.y[0] || p.y > space.y[1] ||
			p.z < space.z[0] || p.z > space.z[1]) {
			var x = space.x[1];
			var y = (Math.random()*(space.y[1] - space.y[0]) + space.y[0]);
			var z = (Math.random()*(space.z[1] - space.z[0]) + space.z[0]);
			f.setPosition(x, y, z);
		}
	});
*/
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

