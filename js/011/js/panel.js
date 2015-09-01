var panelApl = function() {
	this.width;
	this.height;
	this.renderer;
	this.camera;
	this.scene;
	this.light;
	this.cube;
	this.baseTime = +new Date;
};

panelApl.prototype.initThree = function() {
	this.width = document.getElementById('canvas-frame').clientWidth;
	this.height = document.getElementById('canvas-frame').clientHeight;
	this.renderer = new THREE.WebGLRenderer({antialias: true});
	this.renderer.setSize(this.width, this.height );
	document.getElementById('canvas-frame').appendChild(this.renderer.domElement);
	this.renderer.setClearColorHex(0x000000, 1.0);
};

panelApl.prototype.initCamera = function() {
	this.camera = new THREE.PerspectiveCamera( 15 , this.width / this.height,
											   1 , 10000 );
	this.camera.position.x = 0;
	this.camera.position.y = 4;
	this.camera.position.z = 8;
	this.camera.lookAt( {x:0, y:0, z:0 } );
};

panelApl.prototype.initScene = function() {
	this.scene = new THREE.Scene();
};

panelApl.prototype.initLight = function() {
	this.light = new THREE.DirectionalLight(0xcccccc, 1.0, 0);
	this.light.position.set( 0.577, 0.577, 0.577 );
	this.ambient = new THREE.AmbientLight(0x333333);

	this.scene.add(this.light);
	this.scene.add(this.ambient);
};

panelApl.prototype.initObject = function(){
	var geometry = new THREE.SphereGeometry(1, 32, 16);
	var material = new THREE.MeshPhongMaterial({
		color: 0xffffff, ambient: 0xffffff,
		specular: 0xcccccc, shininess:50, metal:true,
		map: THREE.ImageUtils.loadTexture('img/earth.jpg') });
	this.mesh = new THREE.Mesh(geometry, material);
	this.scene.add(this.mesh);
};

panelApl.prototype.render = function() {
	requestAnimationFrame(this.render.bind(this));
	this.mesh.rotation.y = 0.3 * (+new Date - this.baseTime) / 1000;
	this.renderer.render(this.scene, this.camera);
};

panelApl.prototype.threeStart = function() {
	this.initThree();
	this.initCamera();
	this.initScene();
	this.initLight();
	this.initObject();
	this.renderer.clear();
	this.render();
};

$(function() {
    var apl = new panelApl();
    apl.threeStart();
});
