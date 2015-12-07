var Apl = function() {
	this.width;
	this.height;
	this.renderer;
	this.camera;
	this.scene;
	this.light;
	this.cube;

	this.baseTime = +new Date;
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
	this.camera = new THREE.PerspectiveCamera( 45 , this.width / this.height,
											   1 , 10000 );
	this.camera.position.x = 100;
	this.camera.position.y = 20;
	this.camera.position.z = 50;
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
	this.cube = new THREE.Mesh(
		new THREE.CubeGeometry(50,50,50), // set model
		new THREE.MeshLambertMaterial({color: 0xff0000}) // set material
	);
	this.scene.add(this.cube);
	this.cube.position.set(0,0,0);
};

Apl.prototype.render = function() {
	requestAnimationFrame(this.render.bind(this));
	this.cube.rotation.z = 0.5*(+new Date - this.baseTime)/1000;
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

$(function() {
	var apl = new Apl();
	apl.threeStart();
});
