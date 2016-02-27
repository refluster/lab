var App = function() {
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	this.camera.position.z = 5;

	this.addBox();
	this.bufArr();

	var light1 = new THREE.DirectionalLight( 0xffffff, 1 );
	light1.position.set( 0, 0, 1 );
	scene.add( light1 );


	var render = function() {
		requestAnimationFrame(render);
		this.animateBox();
		this.mesh.rotation.x += 0.03;
		this.mesh.rotation.y += 0.02;
		renderer.render(this.scene, this.camera);
	}.bind(this);

	render();
};

App.prototype.addBox = function() {
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	this.cube = new THREE.Mesh( geometry, material );
	this.scene.add(this.cube);
};

App.prototype.animateBox = function() {
	this.cube.rotation.x += 0.01;
	this.cube.rotation.y += 0.01;
};

App.prototype.bufArr = function() {
	var geometry = new THREE.BufferGeometry();
	// create a simple square shape. We duplicate the top left and bottom right
	// vertices because each vertex needs to appear once per triangle.
	var vertexPositions = [
		[-1.0, -1.0,  1.0],
		[ 1.0, -1.0,  1.0],
		[ 1.0,  1.0,  1.0],
		
		[ 1.0,  1.0,  1.0],
		[-1.0,  1.0,  1.0],
		[-1.0, -1.0,  1.0]
	];
	var vertices = new Float32Array( vertexPositions.length * 3 ); // three components per vertex

	// components of the position vector for each vertex are stored
	// contiguously in the buffer.
	for ( var i = 0; i < vertexPositions.length; i++ ) {
		vertices[ i*3 + 0 ] = vertexPositions[i][0];
		vertices[ i*3 + 1 ] = vertexPositions[i][1];
		vertices[ i*3 + 2 ] = vertexPositions[i][2];
	}
	
	// itemSize = 3 because there are 3 values (components) per vertex
	geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	this.mesh = new THREE.Mesh( geometry, material );

	this.scene.add(this.mesh);
};


var app = new App();
