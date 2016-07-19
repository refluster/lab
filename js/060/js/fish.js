var CloudFish = function(scene) {
	const space = {x: [-300, 300], y: [5, 120], z: [-30, 30]};
	const fishNum = 60;

	this.scene = scene
	this.fishes = [];

	for (var i = 0; i < fishNum; i++) {
		var f = new Fish3d();
		var x = (Math.random()*(space.x[1] - space.x[0]) + space.x[0]);
		var y = (Math.random()*(space.y[1] - space.y[0]) + space.y[0]);
		var z = (Math.random()*(space.z[1] - space.z[0]) + space.z[0]);
		f.setPosition(x, y, z);
//		f.setSize(.4);
//		f.setSeed(Math.random() * Math.PI * 2);
//		f.setSpeed({x: -.5, y: 0, z: 0});
		this.fishes.push(f);
		this.scene.add(f.get3DObject());
	}
};

CloudFish.prototype.move = function(x, y, z) {
	this.fishes.forEach(function(f) {
		f.move(x, y, z);
	});
};

CloudFish.prototype.animate = function() {
	this.fishes.forEach(function(f) {
		f.animate();
	}.bind(this));
};
