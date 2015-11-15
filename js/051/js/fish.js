var Fish = function() {
	this.color = Math.random()*0xffffff;

	var material = new THREE.MeshBasicMaterial({
        color: this.color,
        side: THREE.DoubleSide
    });
    var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3( 0,  0, 0));
	geometry.vertices.push(new THREE.Vector3(10, 10, 0));
	geometry.vertices.push(new THREE.Vector3(20,  0, 0));
	geometry.vertices.push(new THREE.Vector3(25,  5, 0));
	geometry.vertices.push(new THREE.Vector3(25, -5, 0));
	geometry.vertices.push(new THREE.Vector3(20,  0, 0));
	geometry.vertices.push(new THREE.Vector3(10,-10, 0));
	geometry.vertices.push(new THREE.Vector3( 0,  0, 0));
	geometry.faces.push(new THREE.Face3(0, 2, 1));
	geometry.faces.push(new THREE.Face3(2, 4, 3));
	geometry.faces.push(new THREE.Face3(5, 7, 6));

	this.line = new THREE.Mesh(geometry, material);
	this.state = 0;
};

Fish.prototype.setSeed = function(s) {
	this.state = s;
};

Fish.prototype.setSize = function(s) {
	this.line.geometry.vertices.forEach(function(v) {
		v.x *= s;
		v.y *= s;
		v.z *= s;
	}.bind(this));
};

Fish.prototype.get3DObject = function() {
	return this.line;
};

Fish.prototype.animate = function() {
	this.line.geometry.vertices.forEach(function(v) {
		v.z = Math.cos(v.x / 8 - this.state);
	}.bind(this));
	this.line.geometry.verticesNeedUpdate = true;
	this.state += 0.1;
};

Fish.prototype.setPosition = function(x, y, z) {
	this.line.position.set(x, y, z);
};

