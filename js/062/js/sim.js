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

var Dew = function(ctx, img) {
	this.img = img;

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
		x = (img.width / 2) + r * Math.cos(t);
		y = (img.height / 2) + r * Math.sin(t);
		this.particles[i] = new Particle(x, y);
	}

	for (var i = 0; i < (this.N * this.N) / 2; i++) {
		this.neighbors[i] = new Neighbor();
	}

	this.input = new Input(this.T);

};
Dew.prototype.step = function() {
	var xbit = parseInt(Math.round(Math.log(this.img.width / this.H) / Math.log(2)));
	var ybit = parseInt(Math.round(Math.log(this.img.height / this.H) / Math.log(2)));
	var xsize = 1 << xbit;
	var ysize = 1 << ybit;
	var isize = xsize * ysize;
	var background = [];

	var density = new Grid(xbit, ybit);
	density.mass.fill((this.H * this.H) / (this.R * this.R));
	for (var x = 0; x < xsize; x++) {
		density.mass[x] = 1.0;
	}
	for (var x = 0; x < xsize; x++) {
		density.mass[x | ysize - 1 << xbit] = 1.0;
	}
	for (var y = 0; y < ysize; y++) {
		density.mass[y << xbit] = 1.0;
	}
	for (var y = 0; y < ysize; y++) {
		density.mass[xsize - 1 | y << xbit] = 1.0;
	}
	density.compile();

	var inflation = new Grid(xbit, ybit);
	var thickness = new Array(isize);
	var depth = new Array(isize);
	var reflection = new Array(isize);

	var photons = new Grid(xbit, ybit);
	photons.mass.fill(this.C);
	for (var x = 0; x < xsize; x++) {
		photons.mass[x] = 4;
	}
	for (var x = 0; x < xsize; x++) {
		photons.mass[x | ysize - 1 << xbit] = 4;
	}
	for (var y = 0; y < ysize; y++) {
		photons.mass[y << xbit] = 4;
	}
	for (var y = 0; y < ysize; y++) {
		photons.mass[xsize - 1 | y << xbit] = 4;
	}
	photons.compile();

	var refraction = new Array(isize);
	var pixels = new Array(isize);

	//////////////////////////////

	do {
		var xscale = xsize / this.img.width;
		var yscale = ysize / this.img.height;
		var xmin = 4 * this.R;
		var ymin = 4 * this.R;
		var xmax = this.img.width- 4 * this.R;
		var ymax = this.img.height - 4 * this.R;
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
/*
						console.log('= ' + i + ' =======');
						console.log(alpha);
						console.log(this.input.vx, this.input.vy);
						console.log(p.vx, p.vy);
*/
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
				p = this.particles[i];
				p.vx += p.fx;
				p.vy += p.fy;
			}
			t++;
		} while(true);

		// zantei
		{
			//this.particles[0].x += 1;
			break;// zantei
		}

		density.source.fill(0);
		for(var i = 0; i < this.N; i++) {
			p = this.particles[i];
			var x = Math.max(1, Math.min((xscale * p.x), xsize - 1));
			var y = Math.max(1, Math.min((yscale * p.y), ysize - 1));
			var j = x | y << xbit;
			density.source[j] += 8;
		}
		density.solve(1, 2);

		for (var i = 0; i < isize; i++){
			p = density.value[i];
			if (p < 4) {
				inflation.mass[i] = 4 - p;
				inflation.source[i] = p;
			} else {
				inflation.mass[i] = 0;
				inflation.source[i] = 4;
			}
		}

		inflation.compile();
		inflation.solve(1, 3);
		var i = 0;
		for (var y = 0; y < ysize; y++) {
			for (var x = 0; x < xsize;) {
				var p = inflation.value[i];
				var z = p <= 0 ? 0 : Math.sqrt(p);
				thickness[i] = z;
				var px = inflation.value[x + 1 & xsize - 1 | y << xbit] - inflation.value[x - 1 & xsize - 1 | y << xbit];
				var py = inflation.value[x | (y + 1 & ysize - 1) << xbit] - inflation.value[x | (y - 1 & ysize - 1) << xbit];
				p += (px * px + py * py) / 16;
				z += p <= 0 ? 0 : this.Z * Math.sqrt(p);
				depth[i] = z;
				x++;
				i++;
			}
		}

		photons.source.fill(0);
		var i = 0;
		for (var y = 0; y < ysize; y++) {
			for (var x = 0; x < xsize;) {
				var z = depth[i];
				var nx = thickness[x - 1 & xsize - 1 | y << xbit] - thickness[x + 1 & xsize - 1 | y << xbit];
				var ny = thickness[x | (y - 1 & ysize - 1) << xbit] - thickness[x | (y + 1 & ysize - 1) << xbit];
				var nz = 2;
				var _n = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz);
				nx *= _n;
				ny *= _n;
				nz *= _n;
				var lx = -0.35999999999999999;
				var ly = -0.47999999999999998;
				var lz = 0.80000000000000004;
				var ln = lx * nx + ly * ny + lz * nz;
				reflection[i] = ln;
				var e = 1.3300000000000001;
				ln += Math.sqrt((e * e - 1) + ln * ln);
				lx += ln * nx;
				ly += ln * ny;
				lz += ln * nz;
				var _x = x - parseInt((z / lz) * lx);
				var _y = y - parseInt((z / lz) * ly);
				_x = ~(_x >> 31) & (_x | -(_x >> xbit) >> 31) & xsize - 1;
				_y = ~(_y >> 31) & (_y | -(_y >> ybit) >> 31) & ysize - 1;
				photons.source[_x | _y << xbit] += ln;
				ln = nz + Math.sqrt((e * e - 1) + nz * nz);
				lx = ln * nx;
				ly = ln * ny;
				lz = ln * nz + 1;
				_x = x - parseInt((z / lz) * lx) & xsize - 1;
				_y = y - parseInt((z / lz) * ly) & ysize - 1;
				refraction[i] = _x | _y << xbit;
				x++;
				i++;
			}
		}

		for (var x = 0; x < xsize; x++) {
			photons.source[x] = 150;
		}
		for (var x = 0; x < xsize; x++) {
			photons.source[x | ysize - 1 << xbit] = 150;
		}
		for (var y = 0; y < ysize; y++) {
			photons.source[y << xbit] = 150;
		}
		for (var y = 0; y < ysize; y++) {
			photons.source[xsize - 1 | y << xbit] = 150;
		}
		photons.solve(1, 2);

		/*
		if (background != null) {
			for(int i = 0; i < isize; i++)
			{
				int j = refraction[i];
				double specular = reflection[i];
				specular *= specular;
				specular *= specular;
				specular *= specular;
				specular *= specular;
				int white = (int)(65536D * specular);
				int luminance = (int)(A + B * C * photons.value[j]);
				int color = background[j];
				int red = white + luminance * (color >> 16 & 0xff);
				int green = white + luminance * (color >> 8 & 0xff);
				int blue = white + luminance * (color & 0xff);
				pixels[i] = 0xff000000 | 0xff0000 & (red | -(red >> 16) >> 31) << 8 | 0xff00 & (green | -(green >> 16) >> 31) | 0xff & (blue | -(blue >> 16) >> 31) >> 8;
			}

		} else
		*/
		{
			for (var i = 0; i < isize; i++) {
				var j = refraction[i];
				var specular = reflection[i];
				specular *= specular;
				specular *= specular;
				specular *= specular;
				specular *= specular;
				var white = parseInt(256 * specular);
				white += parseInt(this.A + this.B * this.C * photons.value[j]);
				white = (white | -(white >> 8) >> 31) & 0xff;
				//pixels[i] = 0xff000000 | white << 16 | white << 8 | white;
				this.img.data[i*4 + 0] = white;
				this.img.data[i*4 + 1] = white;
				this.img.data[i*4 + 2] = white;
				this.img.data[i*4 + 3] = 255;
			}
		}
		break;
	} while(true);

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
