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
	this.effect.separation = .1;

	this.scene = new THREE.Scene();

	this.camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
	this.camera.position.set(20, 80, 0);
	this.camera.position.set(0, 10, 0);
	this.scene.add(this.camera);

	this.controls = new THREE.OrbitControls(this.camera, this.element);
	this.controls.rotateUp(Math.PI / 4);

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
	window.addEventListener('deviceorientation', setOrientationControls, true);


	var hemiLight = new THREE.HemisphereLight(0xbbaaaa, 0x000000, 0.1);
	this.scene.add(hemiLight);

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( -1, 1, 0 );
	this.scene.add( directionalLight );

	var ambLight = new THREE.AmbientLight( 0x202020 ); // soft white light
	this.scene.add( ambLight );


	var texture = THREE.ImageUtils.loadTexture(
		'textures/patterns/asp1.jpg'
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

	this.initObject();
};

App.prototype.initObject = function(){
	var loader = new THREE.JSONLoader();

	var objfile = [
		'js/build00.json',
		'js/build01.json',
		'js/build02.json',
		'js/build03.json',
		'js/build04.json',
		'js/build05.json',
		'js/build06.json',
		'js/build07.json',
		'js/build08.json',
		'js/build09.json',
		'js/build10.json',
		'js/build11.json',
		'js/build12.json',
	];

	var map = [
		{objId: 10, x:   0, y:   0},
		{objId:  1, x:   0, y:  40},
		{objId:  2, x:   0, y:  80},
		{objId: 11, x:   0, y: 160},
		{objId: 10, x:   0, y: 200},
		{objId:  5, x:   0, y: 240},
		{objId:  2, x:  40, y: 280},
		{objId:  0, x:  40, y: 320},
		{objId: 10, x:  40, y: 360},

		{objId:  2, x:  40, y:   0},
		{objId:  0, x:  40, y:  40},
		{objId:  1, x:  40, y:  80},
		{objId: 11, x:  40, y: 120},
		{objId: 10, x:  40, y: 160},
		{objId:  5, x:  40, y: 200},
		{objId:  6, x:  40, y: 240},
		{objId:  6, x:  40, y: 280},
		{objId: 10, x:  40, y: 320},
		{objId:  5, x:  40, y: 360},
	];

	var objmap = {};
	map.forEach(function(m) {
		if (objmap[m.objId] === undefined) {
			objmap[m.objId] = {
				geometry: undefined,
				objs: [],
			};
		}
		objmap[m.objId].objs.push(m);
	});

	function loadObj(objmap, cb) {
		var objIds = [];
		for (var k in objmap) {
			objIds.push(k);
		}

		var ptr = -1;
		function _cb(geometry, material) {
			if (geometry !== undefined) {
				objmap[objIds[ptr]].geometry = geometry;
			}
			if (++ptr >= objIds.length) {
				cb(objmap);
				return;
			}
			console.log(objfile[objIds[ptr]]);
			loader.load(objfile[objIds[ptr]], _cb);
		}

		_cb(undefined, undefined);
	}

	loadObj(objmap, function(geometryes) {
		for (var k in objmap) {
			var om = objmap[k];
			om.objs.forEach(function(o) {
				var mesh;
				mesh = new THREE.Mesh(om.geometry,
									  new THREE.MeshLambertMaterial({color: 0xffffff}));
				mesh.position.x = o.x;
				mesh.position.z = o.y;
				this.scene.add(mesh);
			}.bind(this));
		}
	}.bind(this));
};

App.prototype.resize = function() {
	var width = this.container.offsetWidth;
	var height = this.container.offsetHeight;

	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize(width, height);
	this.effect.setSize(width, height);
};

var v = 0;
var t_ = 0;

App.prototype.update = function(dt) {
	this.resize();

	this.camera.updateProjectionMatrix();

	this.controls.update(dt);
};

App.prototype.render = function(dt) {
	this.effect.render(this.scene, this.camera);

	var d = this.camera.getWorldDirection();

	this.camera.position.x += d.x/16;
	this.camera.position.y += d.y/16;
	this.camera.position.z += d.z/16;

	this.controls.target.set(
		this.camera.position.x + d.x/16,
		this.camera.position.y + d.y/16,
		this.camera.position.z + d.z/16
	);
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

