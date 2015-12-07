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
	this.speed = {x: 0, y: 0, z: 0};
};

Fish.prototype.setSeed = function(s) {
	this.state = s;
};

Fish.prototype.setSpeed = function(s) {
	this.speed.x = s.x;
	this.speed.y = s.y;
	this.speed.z = s.z;
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
	this.line.position.x += this.speed.x;
	this.line.position.y += this.speed.y;
	this.line.position.z += this.speed.z;
	this.state += 0.1;
};

Fish.prototype.setPosition = function(x, y, z) {
	this.line.position.set(x, y, z);
};

Fish.prototype.getPosition = function() {
	return {x: this.line.position.x,
			y: this.line.position.y,
			z: this.line.position.z};
};
