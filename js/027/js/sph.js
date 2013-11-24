/// Vec3 ///////////////////////////

var Vec3 = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};
Vec3.prototype = {
    add: function(vec) {
	this.x += vec.x;
	this.y += vec.y;
	this.z += vec.z;
    },
    sub: function(vec) {
	this.add({x:-vec.x, y:-vec.y, z:-vec.z});
    },
    mag2: function() {
	return this.x*this.x + this.y*this.y + this.z*this.z;
    },
    mag: function() {
	return Math.sqrt(this.mag2());
    },
    eq: function(vec) {
	return (this.x == vec.x) &&
	    (this.y == vec.y) &&
	    (this.z == vec.z);
    },
    multScalar: function(s) {
	this.x *= s;
	this.y *= s;
	this.z *= s;
    },
    divScalar: function(s) {
	this.multScalar(1/s);
    },
    dot: function(vec) {
	return this.x*vec.x + this.y*vec.y + this.z*vec.z;
    },
    cross: function(vec) {
	this.x = this.y*vec.z - this.z*vec.y;
	this.y = this.z*vec.x - this.x*vec.z;
	this.z = this.x*vec.y - this.y*vec.x;
    },
    copy: function(vec) {
	return new Vec3(this.x, this.y, this.z);
    }
};
Vec3.add = function(v1, v2) {
    var v = v1.copy();
    v.add(v2);
    return v;
};
Vec3.sub = function(v1, v2) {
    var v = v1.copy();
    v.sub(v2);
    return v;
};
Vec3.eq = function(v1, v2) {
    return v1.eq(v2);
};
Vec3.multScalar = function(s, v2) {
    var v = v2.copy();
    v.multScalar(s);
    return v;
};
Vec3.divScalar = function(s, v2) {
    var v = v2.copy();
    v.multScalar(1/s);
    return v;
};
Vec3.dot = function(v1, v2) {
    var v = v1.copy();
    return v.dot(v2);
};
Vec3.cross = function(v1, v2) {
    var v = v1.copy();
    v.cross(v2);
    return v;
}

/// Particle ///////////////////////////
var Particle = function() {
    this.pos = new Vec3(0, 0, 0);
    this.vel = new Vec3(0, 0, 0);
    this.f   = new Vec3(0, 0, 0);
    this.rho = 0.0;
    this.prs = 0.0;
};

/// Sph /////////////////////////// 
var Sph = function() {
    // parameters
    const SPH_RESTDENSITY = 600.0;
//    const SPH_RESTDENSITY = 300.0;
    const SPH_INTSTIFF    = 3.0;
    const SPH_PMASS       = 0.00020543;
    const SPH_SIMSCALE    = 0.004;
    const H               = 0.012;
    const PI              = 3.141592653589793;
    const DT              = 0.004;
    const SPH_VISC        = 0.2;
    const SPH_LIMIT       = 200.0;
    const SPH_RADIUS      = 0.004;
    const SPH_EPSILON     = 0.00001;
    const SPH_EXTSTIFF    = 10000.0;
    const SPH_EXTDAMP     = 256.0;
    const SPH_PDIST       = Math.pow(SPH_PMASS/SPH_RESTDENSITY,
                                     1.0/3.0);
/*
    const MIN             = new Vec3(  0.0,  0.0, -5.0);
    const MAX             = new Vec3( 10.0, 25.0,  0.0);
    const INIT_MIN        = new Vec3(  0.0,  0.0,  10.0);
    const INIT_MAX        = new Vec3(  5.0, 10.0,  10.0);
*/

    const MIN             = new Vec3(  0.0,  0.0,   0.0);
    const MAX             = new Vec3( 30.0, 50.0,  15.0);
    const INIT_MIN        = new Vec3(  0.0,  0.0,   0.0);
    const INIT_MAX        = new Vec3( 10.0, 30.0,  15.0);

    const Poly6Kern       = 315.0/(64.0*PI*Math.pow(H, 9));
    const SpikyKern       = -45.0/(PI*Math.pow(H, 6));
    const LapKern         = 45.0/(PI*Math.pow(H, 6));
    
    function new_particles() {
	var p_ps = [];
	
	var d = SPH_PDIST/SPH_SIMSCALE*0.95;
	for (var x = INIT_MIN.x + d; x <= INIT_MAX.x - d; x += d)
	    for (var y = INIT_MIN.y + d; y <= INIT_MAX.y - d; y += d)
		for (var z = INIT_MIN.z + d; z <= INIT_MAX.z - d; z += d) {
		    var p = new Particle();
		    p.pos.x = x; p.pos.y = y; p.pos.z = z;
                    p_ps.push(p);
		}
	return p_ps;
    };
    
    function particles_size(p_ps) {
	return p_ps.length;
    };
    
    function new_neighbor_map(p_ps) {
	var p_nbr_map = [];
	for (var i = 0; i < p_ps.length; i++) {
            insert_neighbor_map(p_ps[i], p_nbr_map);
	}
        return p_nbr_map;
    };

    function insert_neighbor_map(p_p, p_nbr_map) {
	var ix = neighbor_map_idx(p_p.pos);
	if (p_nbr_map[ix] == undefined) {
	    p_nbr_map[ix] = [];
	}
	p_nbr_map[ix].push(p_p);
    };
    
    function neighbor_map_idx(r) {
	var x, y, z;
	var mx, my;
	var d_inv;
	d_inv  = SPH_SIMSCALE/H;
	x  = Math.floor((r.x - MIN.x)*d_inv);
	y  = Math.floor((r.y - MIN.y)*d_inv);
	z  = Math.floor((r.z - MIN.z)*d_inv);
	mx = Math.floor((MAX.x - MIN.x)*d_inv);
	my = Math.floor((MAX.y - MIN.y)*d_inv);
	return x + y*mx + z*mx*my;
    };

    function neighbor(p_nbr_map, r) {
	var ptrs = [];
	var d = H/SPH_SIMSCALE;

	for (var x = -1; x < 2; x++)
            for (var y = -1; y < 2; y++)
		for (var z = -1; z < 2; z++) {
                    var v = new Vec3(r.x + x*d,
                                     r.y + y*d,
                                     r.z + z*d);
		    if (MIN.x <= v.x && v.x <= MAX.x &&
			MIN.y <= v.y && v.y <= MAX.y &&
			MIN.z <= v.z && v.z <= MAX.z) {
			var ix = neighbor_map_idx(v);

			if (p_nbr_map[ix] != undefined) {
                            for (var i = 0; i < p_nbr_map[ix].length; i++) {
                                ptrs.push(p_nbr_map[ix][i]);
                            }
			}
		    }
		}

	return ptrs;
    };
    
    function simulation(p_ps) {
	var p_nbr_map;
	p_nbr_map = new_neighbor_map(p_ps);
	calc_amount(p_ps, p_nbr_map);
	calc_force(p_ps, p_nbr_map);
	advance(p_ps, p_nbr_map);
    };
    
    function calc_amount(p_ps, p_nbr_map) {
	const H2 = H*H;
	
	for (var i = 0; i < p_ps.length; i++) {
	    var p_p = p_ps[i];
            var ptrs = neighbor(p_nbr_map, p_p.pos);
            var sum  = 0.0;
	    for (var j = 0; j < ptrs.length; j++) {
		var p_pj = ptrs[j];
		var dr = Vec3.sub(p_p.pos, p_pj.pos);
                dr.multScalar(SPH_SIMSCALE);
		var r2 = dr.mag2();
		if (H2 > r2) {
                    var c = H2 - r2;
                    sum += c*c*c;
		}
            }
            p_p.rho = sum*SPH_PMASS*Poly6Kern;
            p_p.prs = (p_p.rho - SPH_RESTDENSITY)*SPH_INTSTIFF;
            p_p.rho = 1.0/p_p.rho;
	}
    };

    function calc_force(p_ps, p_nbr_map ) {
	var pterm, vterm, c;
	var fcurr;
  
	for (var i = 0; i < p_ps.length; i++) {
	    var p_p = p_ps[i];
	    var force = p_p.f;
	    var ptrs = neighbor(p_nbr_map, p_p.pos);
	    force.x = force.y = force.z = 0.0;
	    
	    for (var j = 0; j < ptrs.length; j++) {
		var p_pj = ptrs[j];
		if (Vec3.eq(p_p.pos, p_pj.pos)) continue;
		var dr = Vec3.sub(p_p.pos, p_pj.pos);
                dr.multScalar(SPH_SIMSCALE);
		var r  = dr.mag();

		if (H > r) {
                    //c = H - r;
                    //pterm = -0.5 * c * SpikyKern * (p_p->prs + p_pj->prs) / r;
                    //vterm = LapKern * SPH_VISC;
                    c = H - r;
                    pterm = -0.5*c*SpikyKern*(p_p.prs + p_pj.prs)/r;
                    vterm = LapKern*SPH_VISC;

                    //fcurr = pterm * dr + vterm * (p_pj->vel - p_p->vel);
                    dr.multScalar(pterm);
                    var dv = Vec3.sub(p_pj.vel, p_p.vel);
                    dv.multScalar(vterm);
                    fcurr = Vec3.add(dr, dv);

                    //fcurr *= c * p_p->rho * p_pj->rho;
                    fcurr.multScalar(c*p_p.rho*p_pj.rho);

                    //force += fcurr;
                    force.add(fcurr);
		}
            }
	}
    };

    function advance(p_ps, p_nbr_map) {
        var g;
        var speed, diff, adj;
  
        g = gravity; //new Vec3(0.0, -9.8, 0.0);
	
        for (var i = 0; i < p_ps.length; i++) {
            var p_p = p_ps[i];
            var accel = Vec3.multScalar(SPH_PMASS, p_p.f);
	    
            speed = accel.mag2();
            if (speed > SPH_LIMIT*SPH_LIMIT) {
                accel.multScalar(SPH_LIMIT/Math.sqrt(speed));
            }
      
            // Z-axis walls
            diff = 2.0*SPH_RADIUS - (p_p.pos.z - MIN.z)*SPH_SIMSCALE;
            if (diff > SPH_EPSILON) {
                var norm = new Vec3(0.0, 0.0, 1.0);
                adj = SPH_EXTSTIFF*diff - SPH_EXTDAMP*Vec3.dot(norm, p_p.vel);
                norm.multScalar(adj);
                accel.add(norm);
            }
            diff = 2.0*SPH_RADIUS - (MAX.z - p_p.pos.z)*SPH_SIMSCALE;
            if (diff > SPH_EPSILON) {
                var norm = new Vec3(0.0, 0.0, -1.0);
                adj = SPH_EXTSTIFF*diff - SPH_EXTDAMP*Vec3.dot(norm, p_p.vel);
                norm.multScalar(adj);
                accel.add(norm);
            }
     
            // X-axis walls
            diff = 2.0*SPH_RADIUS - (p_p.pos.x - MIN.x)*SPH_SIMSCALE;
            if (diff > SPH_EPSILON) {
                var norm = new Vec3(1.0, 0.0, 0.0);
                adj = SPH_EXTSTIFF*diff - SPH_EXTDAMP*Vec3.dot(norm, p_p.vel);
                norm.multScalar(adj);
                accel.add(norm);
            }
            diff = 2.0*SPH_RADIUS - (MAX.x - p_p.pos.x)*SPH_SIMSCALE;
            if (diff > SPH_EPSILON) {
                var norm = new Vec3(-1.0, 0.0, 0.0);
                adj = SPH_EXTSTIFF*diff - SPH_EXTDAMP*Vec3.dot(norm, p_p.vel);
                norm.multScalar(adj);
                accel.add(norm);
            }

            // Y-axis walls
            diff = 2.0*SPH_RADIUS - (p_p.pos.y - MIN.y)*SPH_SIMSCALE;
            if (diff > SPH_EPSILON) {
                var norm = new Vec3(0.0, 1.0, 0.0);
                adj = SPH_EXTSTIFF*diff - SPH_EXTDAMP*Vec3.dot(norm, p_p.vel);
                norm.multScalar(adj);
                accel.add(norm);
            }
            diff = 2.0*SPH_RADIUS - (MAX.y - p_p.pos.y)*SPH_SIMSCALE;
            if (diff > SPH_EPSILON) {
                var norm = new Vec3(0.0, -1.0, 0.0);
                adj = SPH_EXTSTIFF*diff - SPH_EXTDAMP*Vec3.dot(norm, p_p.vel);
                norm.multScalar(adj);
                accel.add(norm);
            }

            accel.add(g);
            accel.multScalar(DT);
            p_p.vel.add(accel);
            p_p.vel.multScalar(DT/SPH_SIMSCALE);
            p_p.pos.add(p_p.vel);
        }
    };

    this.main = function() {
        var n = 1;

        var p_ps = new_particles();

        simulation(p_ps);
        simulation(p_ps);
        simulation(p_ps);
        output_particles(p_ps, 1);
        return;

        for (var i = 0 ; i < 2; i++) {
            output_particles(p_ps, i);
            simulation(p_ps);
        }
    };

    var gravity = new Vec3(0.0, -9.8, 0.0);
    var particles = [];

    this.init = function() {
        particles = new_particles();
    };

    this.step = function() {
        simulation(particles);
    };

    this.get_particle = function() {
        return particles;
    };
    
    this.set_gravity = function(gx, gy, gz) {
        gravity.x = gx;
        gravity.y = gy;
        gravity.z = gz;
    };
};
