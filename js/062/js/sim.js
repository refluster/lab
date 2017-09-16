var Neighbor = function() {
};
Neighbor.prototype.set = function(a, b, r, w, nx, ny) {
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
	this.tag = 0;
	this.vx = 0;
	this.vy = 0;
	this.fx;
	this.fy;
	this.w;
	this.h;
	this.nx;
	this.ny;
	this.sx;
	this.sy;
};

var Dew = function(ctx, width, height) {
	this.width = width;
	this.height = height;

	this.R = 8;
	this.P = 0.10000000000000001;
	this.S = 0.02;
	this.D = 0.050000000000000003;
	this.Z = 0.90000000000000002;
	this.A = 80;
	this.B = 80;
	this.C = 0.050000000000000003;
	this.N = 100; //zantei 100;
	this.M = 0;
	this.T = 50;
	this.H = 1;

	this.particles = [];
	this.neighbors = [];

	for (var i = 0; i < this.N; i++) {
		r = (Math.sqrt((i + 1) / Math.PI) * this.R * 3) / 4;
		t = 2 * Math.sqrt(Math.PI * (i + 1));
		x = (width / 2) + r * Math.cos(t);
		y = (height / 2) + r * Math.sin(t);
		this.particles[i] = new Particle(x, y);
	}

	for (var i = 0; i < (this.N * this.N) / 2; i++) {
		this.neighbors[i] = new Neighbor();
	}

	this.input = new Input(this.T);

	this.gravity = parseInt($('input[name=gravity]').val());
	var _this = this;

	$('input[name=gravity]').bind('change', function(e) {
		var g = $(this).val();
		_this.gravity = g;
		$('#gravity-value').text(g + 'G');
	});
};
Dew.prototype.step = function() {
	var xbit = parseInt(Math.round(Math.log(this.width / this.H) / Math.log(2)));
	var ybit = parseInt(Math.round(Math.log(this.height / this.H) / Math.log(2)));
	var xsize = 1 << xbit;
	var ysize = 1 << ybit;

	do {
		var xscale = xsize / this.width;
		var yscale = ysize / this.height;
		var xmin = 4 * this.R;
		var ymin = 4 * this.R;
		var xmax = this.width- 4 * this.R;
		var ymax = this.height - 4 * this.R;
		var t = 0;
		do {
			if (t >= this.T)
				break;
			if (this.input.pressed == true) {
				this.input.step();
				for (var i = 0; i < this.N; i++) {
					p = this.particles[i];
					var dx = this.input.x - p.x;
					var dy = this.input.y - p.y;
					var alpha = Math.min((this.R * this.R) / (dx * dx + dy * dy) - 0.20000000000000001, 1);
					if (alpha > 0) {
						p.vx = (1 - alpha) * p.vx + alpha * this.input.vx;
						p.vy = (1 - alpha) * p.vy + alpha * this.input.vy;
					}
				}
			}

			for (var i = 0; i < this.N; i++) {
				p = this.particles[i];
				var dx = p.x >= xmin ? p.x >= xmax ? p.x - xmax : 0.0 : p.x - xmin;
				var dy = p.y >= ymin ? p.y >= ymax ? p.y - ymax : 0.0 : p.y - ymin;
				var d2 = dx * dx + dy * dy;
				if (d2 > 1.0) {
					var d = Math.sqrt(d2);
					p.vx -= ((d - 1) * dx) / d;
					p.vy -= ((d - 1) * dy) / d;
				}
				p.x += p.vx;
				p.y += p.vy;
				p.tag = (p.y / this.R) << 16 | (p.x / this.R);
				p.w = 0;
				p.nx = 0;
				p.ny = 0;
			}

			this.M = 0;
			this.sort(this.particles, 0, this.N - 1);
			var i = 0;
			var j = 0;
			label0:
			for(; i < this.N; i++) {
				p = this.particles[i];
				var k = i + 1;
				do {
					if (k >= this.N) {
						break;
					}
					q = this.particles[k];
					if (p.tag + 1 < q.tag) {
						break;
					}
					this.match(this.neighbors, p, q);
					k++;
				} while(true);
				do {
					if (j >= this.N) {
						break;
					}
					q = this.particles[j];
					if ((p.tag + 0x10000) - 1 <= q.tag) {
						break;
					}
					j++;
				} while(true);
				var iq = j;
				do {
					if (iq >= this.N) {
						continue label0;
					}
					q = this.particles[iq];
					if (p.tag + 0x10000 + 1 < q.tag) {
						continue label0;
					}
					this.match(this.neighbors, p, q);
					iq++;
				} while(true);
			}

			for (var i = 0; i < this.M; i++) {
				var n = this.neighbors[i];
				var a = n.a;
				var b = n.b;
				var w = n.w;
				var nx = n.nx;
				var ny = n.ny;
				a.w += w;
				b.w += w;
				a.nx -= w * nx;
				a.ny -= w * ny;
				b.nx += w * nx;
				b.ny += w * ny;
			}

			for (var i = 0; i < this.N; i++) {
				var p = this.particles[i];
				p.h = this.P * (p.w - 1);
				p.sx = this.S * this.R * p.nx;
				p.sy = this.S * this.R * p.ny;
				p.fx = 0;
				p.fy = 0;
			}

			for (var i = 0; i < this.M; i++) {
				var n = this.neighbors[i];
				var a = n.a;
				var b = n.b;
				var r = n.r;
				var w = n.w;
				var nx = n.nx;
				var ny = n.ny;
				var fn = (a.h + b.h) * w;
				var vx = b.vx - a.vx;
				var vy = b.vy - a.vy;
				var vn = vx * nx + vy * ny;
				if (vn < 0) {
					fn -= this.D * vn;
				}
				var sx = b.sx - a.sx;
				var sy = b.sy - a.sy;
				var sn = sx * nx + sy * ny;
				var fx = fn * nx + (sn * nx + (w * sx) / 2) / r;
				var fy = fn * ny + (sn * ny + (w * sy) / 2) / r;
				a.fx -= fx;
				a.fy -= fy;
				b.fx += fx;
				b.fy += fy;
			}

			for (var i = 0; i < this.N; i++) {
				const gravityDivider = 8192;
				p = this.particles[i];
				p.vx += p.fx;
				p.vy += p.fy;
				p.vx += this.input.gravity.x*this.gravity/gravityDivider;
				p.vy += this.input.gravity.y*this.gravity/gravityDivider;
			}
			t++;
		} while(true);

		break;
	} while(true);

	$('#msg').text(this.input.gravity.x);
};
Dew.prototype.sort = function(particles, first, last) {
	var a = first;
	var b = last;
	do {
		var mid;
		for (mid = particles[parseInt((first + last) / 2)].tag;
			 particles[a].tag < mid;
			 a++);
		for (; mid < particles[b].tag; b--);
		if (a >= b)
			break;
		c = particles[a];
		particles[a] = particles[b];
		particles[b] = c;
		a++;
		b--;
	} while(true);
	if (first < a - 1) {
		this.sort(particles, first, a - 1);
	}
	if (b + 1 < last) {
		this.sort(particles, b + 1, last);
	}
}
Dew.prototype.match = function(neighbors, a, b) {
	var dx = b.x - a.x;
	var dy = b.y - a.y;
	var d2 = dx * dx + dy * dy;
	if (d2 > 0 && d2 < this.R * this.R) {
		var r = Math.sqrt(d2);
		var w = 1 - r / this.R;
		neighbors[this.M++].set(a, b, r, w, dx / r, dy / r);
	}
}
