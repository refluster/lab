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
	var material = new THREE.LineBasicMaterial({
		color: 0xaaaaff
	});
	var v3origin = new THREE.Vector3( 0, 0, 0 );

	var addObjects = function(step, root, size, p, direction) {
		if (step == 3) {
			return;
		}

		{
			var geometry = new THREE.Geometry();
			var v = new THREE.Vector3( 0, 20*size, 80*size)
			geometry.vertices.push(v3origin, v);
			var line = new THREE.Line( geometry, material );
			line.position.set(p.x, p.y, p.z);
			root.add(line);
			addObjects(step + 1, line, size * 0.8, v, direction);
		}
		{
			var geometry = new THREE.Geometry();
			var v = new THREE.Vector3( 10*size, -20*size, -10*size )
			geometry.vertices.push(v3origin, v);
			var line = new THREE.Line( geometry, material );
			line.position.set(p.x, p.y, p.z);
			root.add(line);
			addObjects(step + 1, line, size * 0.8, v, direction);
		}
	};

	var obj = new THREE.Object3D();
	addObjects(0, obj, 0.2, {x: 0, y: 0, z: 0}, {x: 0, y: 1, z: 0});
	
	this.scene.add(obj);
};

Apl.prototype.render = function() {
	requestAnimationFrame(this.render.bind(this));
//	this.cube.rotation.z = 0.5*(+new Date - this.baseTime)/1000;
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
