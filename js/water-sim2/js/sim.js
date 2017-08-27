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

	for (var i = 0; i < (this.N * this.N) / 2; i++) {
		neighbors[i] = new Neighbor();
	}
};
Dew.prototype.step = function() {
	var xbit = parseInt(Math.round(Math.log(this.img.width / this.H) / Math.log(2)));
	var ybit = parseInt(Math.round(Math.log(this.img.height / this.H) / Math.log(2)));
	var xsize = 1 << this.xbit;
	var ysize = 1 << this.ybit;
	var isize = xsize * ysize;
	var background = [];

	var density = new Grid(xbit, ybit);
	density.mass.fill((this.H * this.H) / (this.R * this.R));
	for (var x = 0; x < xsize; x++) {
		density.mass[x] = 1.0;
	}
	for (var x = 0; x < xsize; x++) {
		density.mass[x | ysize - 1 << this.xbit] = 1.0;
	}
	for (var y = 0; y < ysize; y++) {
		density.mass[y << xbit] = 1.0;
	}
	for (var y = 0; y < ysize; y++) {
		density.mass[xsize - 1 | y << this.xbit] = 1.0;
	}
	density.compile();

	var inflation = new Grid(this.xbit, this.ybit);
	var thickness = new Array(isize);
	var depth = new Array(isize);
	var reflection = new Array(isize);

	var photons = new Grid(this.xbit, this.ybit);
	photons.mass.fill(this.C);
	for (var x = 0; x < xsize; x++) {
		photons.mass[x] = 4;
	}
	for (var x = 0; x < xsize; x++) {
		photons.mass[x | ysize - 1 << this.xbit] = 4;
	}
	for (var y = 0; y < ysize; y++) {
		photons.mass[y << this.xbit] = 4;
	}
	for (var y = 0; y < ysize; y++) {
		photons.mass[xsize - 1 | y << this.xbit] = 4;
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
			{
				for (var i = 0; i < this.N; i++) {
					p = particles[i];
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
				this.sort(particles, 0, this.N - 1);
				var i = 0;
				var j = 0;
				label0:
				for(; i < this.N; i++) {
					p = particles[i];
					var k = i + 1;
					do {
						if (k >= this.N) {
							break;
						}
						q = particles[k];
						if (p.tag + 1 < q.tag) {
							break;
						}
						this.match(neighbors, p, q);
						k++;
					} while(true);
					do {
						if (j >= this.N) {
							break;
						}
						q = particles[j];
						if ((p.tag + 0x10000) - 1 <= q.tag) {
							break;
						}
						j++;
					} while(true);
					q = j;
					do {
						if (q >= this.N) {
							continue label0;
						}
						q = particles[q];
						if (p.tag + 0x10000 + 1 < q.tag) {
							continue label0;
						}
						this.match(neighbors, p, q);
						q++;
					} while(true);
				}

				for (var i = 0; i < this.M; i++) {
					var n = neighbors[i];
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
					var p = particles[i];
					p.h = this.P * (p.w - 1);
					p.sx = this.S * this.R * p.nx;
					p.sy = this.S * this.R * p.ny;
					p.fx = 0;
					p.fy = 0;
				}

				for (var i = 0; i < this.M; i++) {
					var n = neighbors[i];
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
					p = particles[i];
					p.vx += p.fx;
					p.vy += p.fy;
				}
			}
			t++;
		    break; // zantei
		} while(true);

		density.source.fill(0);
		{
			for(var i = 0; i < this.N; i++) {
				p = particles[i];
				var x = Math.max(1, Math.min((xscale * p.x), xsize - 1));
				var y = Math.max(1, Math.min((yscale * p.y), ysize - 1));
				var j = x | y << this.xbit;
				density.source[j] += 8;
			}

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
				var px = inflation.value[x + 1 & xsize - 1 | y << this.xbit] - inflation.value[x - 1 & xsize - 1 | y << this.xbit];
				var py = inflation.value[x | (y + 1 & ysize - 1) << this.xbit] - inflation.value[x | (y - 1 & ysize - 1) << this.xbit];
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
				var nx = thickness[x - 1 & xsize - 1 | y << this.xbit] - thickness[x + 1 & xsize - 1 | y << this.xbit];
				var ny = thickness[x | (y - 1 & ysize - 1) << this.xbit] - thickness[x | (y + 1 & ysize - 1) << this.xbit];
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
				_x = ~(_x >> 31) & (_x | -(_x >> this.xbit) >> 31) & xsize - 1;
				_y = ~(_y >> 31) & (_y | -(_y >> this.ybit) >> 31) & ysize - 1;
				photons.source[_x | _y << this.xbit] += ln;
				ln = nz + Math.sqrt((e * e - 1) + nz * nz);
				lx = ln * nx;
				ly = ln * ny;
				lz = ln * nz + 1;
				_x = x - parseInt((z / lz) * lx) & xsize - 1;
				_y = y - parseInt((z / lz) * ly) & ysize - 1;
				refraction[i] = _x | _y << this.xbit;
				x++;
				i++;
			}
		}

		for (var x = 0; x < xsize; x++) {
			photons.source[x] = 150;
		}
		for (var x = 0; x < xsize; x++) {
			photons.source[x | ysize - 1 << this.xbit] = 150;
		}
		for (var y = 0; y < ysize; y++) {
			photons.source[y << this.xbit] = 150;
		}
		for (var y = 0; y < ysize; y++) {
			photons.source[xsize - 1 | y << this.xbit] = 150;
		}
		photons.solve(1, 2);
	    /*
		synchronized(this)
		{
			if(background != null)
			{
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
			{
				for(int i = 0; i < isize; i++)
				{
					int j = refraction[i];
					double specular = reflection[i];
					specular *= specular;
					specular *= specular;
					specular *= specular;
					specular *= specular;
					int white = (int)(256D * specular);
					white += (int)(A + B * C * photons.value[j]);
					white = (white | -(white >> 8) >> 31) & 0xff;
					pixels[i] = 0xff000000 | white << 16 | white << 8 | white;
				}

			}
			mis.newPixels();
			repaint();
		}
		try
		{
			Thread.sleep(10L);
			continue;
		}
		catch(InterruptedException e) { }
		*/
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
Dew.prototype.match = function(neigbors, a, b) {
	var dx = b.x - a.x;
	var dy = b.y - a.y;
	var d2 = dx * dx + dy * dy;
	if (d2 > 0 && d2 < this.R * this.R) {
		var r = Math.sqrt(d2);
		var w = 1 - r / this.R;
		neighbors[this.M++].set(a, b, r, w, dx / r, dy / r);
	}
}
