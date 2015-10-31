var Apl = function() {
	this.width;
	this.height;
	this.renderer;
	this.camera;
	this.scene;
	this.light;
	this.cube;
};

Apl.prototype.initThree = function() {
	this.width = document.getElementById('canvas-frame').clientWidth;
	this.height = document.getElementById('canvas-frame').clientHeight;
	this.renderer = new THREE.WebGLRenderer({antialias: true});
	this.renderer.setSize(this.width, this.height );
	document.getElementById('canvas-frame').appendChild(this.renderer.domElement);
	this.renderer.setClearColorHex(0x000000, 1.0);
};

Apl.prototype.initCamera = function() {
	this.camera = new THREE.PerspectiveCamera( 60 , this.width / this.height,
											   1 , 10000 );
	this.camera.position.x = 100;
	this.camera.position.y = 20;
	this.camera.position.z = 20;
	this.camera.up.x = 0;
	this.camera.up.y = 0;
	this.camera.up.z = 1;
	this.camera.lookAt( {x:0, y:0, z:0 } );
};

Apl.prototype.initScene = function() {
	this.scene = new THREE.Scene();
};

Apl.prototype.initLight = function() {
	this.light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
	this.light.position.set( 100, 100, 200 );
	this.scene.add(this.light);
};

Apl.prototype.initObject = function(){
	const fishNum = 20;

	this.fish = [];
	for (var i = 0; i < fishNum; i++) {
		this.fish.push(new Fish());
	}

	this.fish.forEach(function(f) {
		const volume = 70;
		var x = (Math.random() - 0.5) * volume;
		var y = (Math.random() - 0.5) * volume;
		var z = (Math.random() - 0.5) * volume;
		f.setPosition(x, y, z);
		f.setSeed(Math.random() * Math.PI * 2);
		this.scene.add(f.get3DObject());
	}.bind(this));
};

Apl.prototype.render = function() {
	requestAnimationFrame(this.render.bind(this));
	this.fish.forEach(function(f) {
		f.animate();
	});
	this.renderer.render(this.scene, this.camera);
};

Apl.prototype.threeStart = function() {
	this.initThree();
	this.initCamera();
	this.initScene();
	this.initLight();
	this.initObject();
	this.renderer.clear();
	this.render();
};

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

$(function() {
	var apl = new Apl();
	apl.threeStart();
});
