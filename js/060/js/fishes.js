var Fishes = function() {

	this.geometry = new THREE.Geometry();
	new Fish_(this.geometry);

	this.geometry.computeFaceNormals();
	this.geometry.computeVertexNormals();

	this.material = new THREE.MeshNormalMaterial();

	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.scale.set(30, 30, 30);
	this.mesh.position.set(0, 200, 0);
};

Fishes.prototype.getObject = function() {
	return this.mesh;
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

	this.defp.forEach(function(p) {
		geometry.vertices.push(new THREE.Vector3(p[0], p[1], p[2]));
	});

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
};

/*
	this.mesh.geometry.vertices[0].y += 0.1;
	this.mesh.geometry.vertices[1].y += 0.1;
	this.mesh.geometry.vertices[2].y += 0.1;
	this.mesh.geometry.vertices[3].y += 0.1;
	this.mesh.geometry.verticesNeedUpdate = true;
*/
