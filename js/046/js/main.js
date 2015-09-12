var Apl = function() {
	this.width;
	this.height;
	this.renderer;
	this.camera;
	this.scene;
	this.light;
	this.cube;

	this.baseTime = +new Date;
	
	this.generateCoreVectors();

	this.depth = $('#depth').val();
	this.branch = $('#branch').val();
	
	$('#depth').change(function() {
		this.depth = $('#depth').val();		
		this.threeRestart();
	}.bind(this));
	$('#branch').change(function() {
		this.branch = $('#branch').val();
		this.threeRestart();
	}.bind(this));
	$('#recalc').on('tap click', function() {
		this.generateCoreVectors();
		this.threeRestart();
		return false;
	}.bind(this));
};

$(function() {
	$('#volume').slider().on('slide', function(e) {
		console.log(e.value);
	});
});

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

Apl.prototype.generateCoreVectors = function() {
	this.vectors = [];
	for (var i = 0; i < 10; i++) {
		this.vectors.push({x: (Math.random() - 0.5)*100, y: (Math.random() - 0.5)*100,
						   z: Math.random()*50});
	}
};

Apl.prototype.initObject = function(){
	var material = new THREE.LineBasicMaterial({
		color: 0xaaaaff
	});
	var v3origin = new THREE.Vector3( 0, 0, 0 );

	var addObjects = function(step, root, size, p, depth, geometries) {
		if (step == depth) {
			return;
		}

		for (var i = 0; i < this.branch; i++) {
			var geometry = new THREE.Geometry();
			var vector = new THREE.Vector3(this.vectors[i].x*size, this.vectors[i].y*size,
										   this.vectors[i].z*size);
			var length = vector.length();
			geometry.vertices.push(v3origin, vector);
			var line = new THREE.Line( geometry, material );
			line.position.set(p.x, p.y, p.z);
			line.rotation.set(p.x/length, p.y/length, 0);
			root.add(line);
			geometries.push(geometry);
			addObjects.call(this, step + 1, line, size * 0.6, vector, depth, geometries);
		}
	};

	this.obj = new THREE.Object3D();
	this.obj.position.set(0, 0, -20);
	this.geometries = [];
	addObjects.call(this, 0, this.obj, .8, {x: 0, y: 0, z: 0}, this.depth, this.geometries);
	
	this.scene.add(this.obj);
};

Apl.prototype.render = function() {
	requestAnimationFrame(this.render.bind(this));
	this.obj.rotation.z = 0.5*(+new Date - this.baseTime)/1000;
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

Apl.prototype.threeRestart = function() {
	this.scene.remove(this.obj);
	this.geometries.forEach(function(g) {
		g.dispose();
	});
	this.initObject();
	this.renderer.clear();
	this.render();
};

$(function() {
	var apl = new Apl();
	apl.threeStart();
});
