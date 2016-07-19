var Fish3d = function(geometry) {
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

	geometry = new THREE.Geometry();

	this.scale = 4;
	this.defp.forEach(function(p) {
		geometry.vertices.push(
			new THREE.Vector3(p[0]*this.scale, p[1]*this.scale, p[2]*this.scale));
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
			geometry.faces.push(new THREE.Face3(idx[0], idx[2], idx[1]));
			geometry.faces.push(new THREE.Face3(idx[1], idx[2], idx[3]));
		}
	}

	geometry.computeFaceNormals();
	geometry.computeVertexNormals();

	this.material = new THREE.ShaderMaterial({
		vertexShader: document.getElementById('vshader-gouraud').textContent,
		fragmentShader: document.getElementById('fshader-gouraud').textContent,
		uniforms: THREE.UniformsUtils.merge([
			THREE.UniformsLib['lights'],
		]),
		lights: true,
	});

	this.mesh = new THREE.Mesh(geometry, this.material);
	this.mesh.position.set(0, 100, 0);

	this.state = Math.random()*1000;
	this.speed = {x: 2, y: 0, z: 0};
};

Fish3d.prototype.getObject = function() {
	return this.mesh;
};

Fish3d.prototype.move = function(x, y, z) {
	this.mesh.position.x += x;
	this.mesh.position.y += y;
	this.mesh.position.z += z;
};

Fish3d.prototype.animate = function() {
	for (var i = 0; i < this.defp.length; i++) {
		switch (this.defp[i][0]) {
		case 7.0:
			this.mesh.geometry.vertices[i].z = this.defp[i][2] + Math.cos(this.state)/4*this.scale;
			break;
		case 8.0:
			this.mesh.geometry.vertices[i].z = this.defp[i][2] + Math.cos(this.state - 1)/2*this.scale;
			break;
		}
	}
	this.mesh.geometry.verticesNeedUpdate = true;
	this.state += 0.1;

	this.mesh.position.x += this.speed.x;
	this.mesh.position.y += this.speed.y;
	this.mesh.position.z += this.speed.z;

	const range = 400;
	if (this.mesh.position.x > range) {
		this.mesh.position.x -= range*2;
	} else if (this.mesh.position.x < -range) {
		this.mesh.position.x += range*2;
	}
	if (this.mesh.position.y > range) {
		this.mesh.position.y -= range*2;
	} else if (this.mesh.position.y < -range) {
		this.mesh.position.y += range*2;
	}
	if (this.mesh.position.z > range) {
		this.mesh.position.z -= range*2;
	} else if (this.mesh.position.z < -range) {
		this.mesh.position.z += range*2;
	}
};

Fish3d.prototype.setPosition = function(x, y, z) {
	this.mesh.position.set(x, y, z);
};

Fish3d.prototype.setSize = function(s) {
};

Fish3d.prototype.setSeed = function(s) {
};

Fish3d.prototype.setSpeed = function(vx, vy, vz) {
};

Fish3d.prototype.get3DObject = function() {
	return this.mesh;
};
