var Neighbor = function() {
};
Neighbor.prototype.set = function(pa, pb, r, w, nx, ny) {
	this.a = a;
	this.b = b;
	this.r = r;
	this.w = w;
	this.nx = nx;
	this.ny = ny;
};

var Particle = function(x, y) {
	this.x = x;
	this.y = y;
	this.tag;
	this.vx;
	this.vy;
	this.fx;
	this.fy;
	this.w;
	this.h;
	this.nx;
	this.ny;
	this.sx;
	this.sy;
};

var Dew = function(img) {
	this.img = img;

	this.R = 8;
    this.P = 0.10000000000000001;
    this.S = 0.02;
    this.D = 0.050000000000000003;
    this.Z = 0.90000000000000002;
    this.A = 80;
    this.B = 80;
    this.C = 0.050000000000000003;
    this.N = 100;
    this.M = 0;
    this.T = 50;
    this.H = 1;

	particles = [];
	neighbors = [];

    for (var i = 0; i < this.N; i++) {
        r = (Math.sqrt((i + 1) / Math.PI) * this.R * 3) / 4;
        t = 2 * Math.sqrt(Math.PI * (i + 1));
        x = (img.width / 2) + r * Math.cos(t);
        y = (img.height / 2) + r * Math.sin(t);
        particles[i] = new Particle(x, y);
    }
	
    for (var i = 0; i < neighbors.length; i++) {
        neighbors[i] = new Neighbor();
	}
};

