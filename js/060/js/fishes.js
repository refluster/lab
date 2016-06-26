var Fishes = function() {

	this.geometry = new THREE.Geometry();
	this.createFish();

	this.geometry.computeFaceNormals();
	this.geometry.computeVertexNormals();

	this.material = new THREE.MeshNormalMaterial();

	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.scale.set(30, 30, 30);
	this.mesh.position.set(0, 200, 0);
};

Fishes.prototype.createFish = function() {
	// x = 0
	this.geometry.vertices.push(new THREE.Vector3(0.0,  0.0,  0.0));
	this.geometry.vertices.push(new THREE.Vector3(0.0,  0.0,  0.0));
	this.geometry.vertices.push(new THREE.Vector3(0.0,  0.0,  0.0));
	this.geometry.vertices.push(new THREE.Vector3(0.0,  0.0,  0.0));

	// x = 0.5
	this.geometry.vertices.push(new THREE.Vector3(0.5,  0.4,  0.0));
	this.geometry.vertices.push(new THREE.Vector3(0.5,  0.0, -0.2));
	this.geometry.vertices.push(new THREE.Vector3(0.5, -0.4,  0.0));
	this.geometry.vertices.push(new THREE.Vector3(0.5,  0.0,  0.2));

	// x  = 2.0
	this.geometry.vertices.push(new THREE.Vector3(2.0,  0.8,  0.0));
	this.geometry.vertices.push(new THREE.Vector3(2.0,  0.0, -0.6));
	this.geometry.vertices.push(new THREE.Vector3(2.0, -0.8,  0.0));
	this.geometry.vertices.push(new THREE.Vector3(2.0,  0.0,  0.6));

	// x  = 3.0
	this.geometry.vertices.push(new THREE.Vector3(3.0,  1.0,  0.0));
	this.geometry.vertices.push(new THREE.Vector3(3.0,  0.0, -0.5));
	this.geometry.vertices.push(new THREE.Vector3(3.0, -0.7,  0.0));
	this.geometry.vertices.push(new THREE.Vector3(3.0,  0.0,  0.5));

	// x  = 6.0
	this.geometry.vertices.push(new THREE.Vector3(7.0,  0.2,  0.0));
	this.geometry.vertices.push(new THREE.Vector3(7.0,  0.0, -0.1));
	this.geometry.vertices.push(new THREE.Vector3(7.0, -0.2,  0.0));
	this.geometry.vertices.push(new THREE.Vector3(7.0,  0.0,  0.1));

	// x  = 7.0
	this.geometry.vertices.push(new THREE.Vector3(8.0,  0.4,  0.0));
	this.geometry.vertices.push(new THREE.Vector3(8.0,  0.0,  0.0));
	this.geometry.vertices.push(new THREE.Vector3(8.0, -0.4,  0.0));
	this.geometry.vertices.push(new THREE.Vector3(8.0,  0.0,  0.0));

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
};

Fishes.prototype.getObject = function() {
	return this.mesh;
};

/*
	this.mesh.geometry.vertices[0].y += 0.1;
	this.mesh.geometry.vertices[1].y += 0.1;
	this.mesh.geometry.vertices[2].y += 0.1;
	this.mesh.geometry.vertices[3].y += 0.1;
	this.mesh.geometry.verticesNeedUpdate = true;
*/
