var Fishes = function() {
	this.fish = new Fish_(this.geometry);
};

Fishes.prototype.getObject = function() {
	return this.fish.getObject();
};

Fishes.prototype.animation = function() {
//	this.fish.animation();
};

var Fish_ = function(geometry) {
	this.defp = [
		[0.0,  0.0,  0.0],
		[0.0,  0.0,  0.0],
		[0.0,  0.0,  0.0],
		[0.0,  0.0,  0.0],
		[0.5,  0.4,  0.0],
		[0.5,  0.0, -0.2],
		[0.5, -0.4,  0.0],
		[0.5,  0.0,  0.2],
		[2.0,  0.8,  0.0],
		[2.0,  0.0, -0.6],
		[2.0, -0.8,  0.0],
		[2.0,  0.0,  0.6],
		[3.0,  1.0,  0.0],
		[3.0,  0.0, -0.5],
		[3.0, -0.7,  0.0],
		[3.0,  0.0,  0.5],
		[7.0,  0.2,  0.0],
		[7.0,  0.0, -0.1],
		[7.0, -0.2,  0.0],
		[7.0,  0.0,  0.1],
		[8.0,  0.4,  0.0],
		[8.0,  0.0,  0.0],
		[8.0, -0.4,  0.0],
		[8.0,  0.0,  0.0],
	];

	this.geometry = new THREE.Geometry();

	this.defp.forEach(function(p) {
		this.geometry.vertices.push(new THREE.Vector3(p[0], p[1], p[2]));
	}.bind(this));

	// create faces
	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < 4; j++) {
			var b = i*4 + j;
			var idx = [
				b,
				b + 1 - (j + 1 < 4 ? 0: 4),
				b + 4,
				b + 5 - (j + 1 < 4 ? 0: 4)];
			this.geometry.faces.push(new THREE.Face3(idx[0], idx[2], idx[1]));
			this.geometry.faces.push(new THREE.Face3(idx[1], idx[2], idx[3]));
		}
	}

	this.geometry.computeFaceNormals();
	this.geometry.computeVertexNormals();

	this.material = new THREE.MeshNormalMaterial();

	// objects for shader test 001
	var material = new THREE.ShaderMaterial({
		vertexShader: document.getElementById('vshader').textContent,
		fragmentShader: document.getElementById('fshader').textContent,
		uniforms: THREE.UniformsUtils.merge([
			THREE.UniformsLib['lights'],
			{
				color: {type: 'f', value: 0.0},
			}
		]),
		lights: true,
	});

	this.mesh = new THREE.Mesh(this.geometry, material);
	this.mesh.scale.set(30, 30, 30);
	this.mesh.position.set(0, 200, 0);

	this.state = 0;
};

Fish_.prototype.getObject = function() {
	return this.mesh;
};

Fish_.prototype.move = function(x, y, z) {
	
};

Fish_.prototype.animation = function() {
	for (var i = 0; i < this.defp.length; i++) {
		switch (this.defp[i][0]) {
		case 7.0:
			this.geometry.vertices[i].z = this.defp[i][2] + Math.cos(this.state)/4;
			break;
		case 8.0:
			this.geometry.vertices[i].z = this.defp[i][2] + Math.cos(this.state - 1)/2;
			break;
		}
	}
	this.geometry.verticesNeedUpdate = true;
	this.state += 0.1;
};
