var Grid = function(xbit, ybit) {
    this.xbit = xbit;
    this.ybit = ybit;
	this.value = new Array(1 << xbit + ybit);
    this.mass = new Array(1 << xbit + ybit);
    this.source = new Array(1 << xbit + ybit);
    this._mass = new Array(1 << xbit + ybit);
    if (xbit > 1 && ybit > 1) {
        this.parent = new Grid(xbit - 1, ybit - 1);
	} else {
        this.parent = undefined;
	}
};
Grid.prototype.compile = function() {
    var xmax = (1 << this.xbit) - 1;
    var ymax = (1 << this.ybit) - 1;
    var imax = (1 << this.xbit + this.ybit) - 1;
    for(var i = 0; i <= imax; i++) {
        this._mass[i] = 1 / (this.mass[i] + 4);
	}	
    if (this.parent != null) {
		this.parent.mass.fill(0);
        var i = 0;
        for (var y = 0; y <= ymax; y++) {
            for (var x = 0; x <= xmax;) {
                var _x = x >> 1;
                var _y = y >> 1;
                var _i = _x | _y << this.parent.xbit;
                this.parent.mass[_i] += this.mass[i];
                x++;
                i++;
            }
			
        }
		
        this.parent.compile();
    }
};
Grid.prototype.solve = function(before, after) {
	var xmax = (1 << this.xbit) - 1;
	var ymax = (1 << this.ybit) - 1;
	for (var t = 0; t < before; t++) {
		var i = 0;
		for (var y = 0; y <= ymax; y++) {
			for (var x = 0; x <= xmax;) {
				this.value[i] = (this.source[i] + this.value[x - 1 & xmax | y << this.xbit] + this.value[x + 1 & xmax | y << this.xbit] + this.value[x | (y - 1 & ymax) << this.xbit] + this.value[x | (y + 1 & ymax) << this.xbit]) * this._mass[i];
				x++;
				i++;
			}

		}

	}

	if (this.parent != null) {
		this.parent.value.fill(0);
		this.parent.source.fill(0);
		var i = 0;
		for (var y = 0; y <= ymax; y++) {
			for (var x = 0; x <= xmax;) {
				var p = (this.source[i] + this.value[x - 1 & xmax | y << this.xbit] + this.value[x + 1 & xmax | y << this.xbit] + this.value[x | (y - 1 & ymax) << this.xbit] + this.value[x | (y + 1 & ymax) << this.xbit]) - (this.mass[i] + 4) * this.value[i];
				this. _x = x >> 1;
				this. _y = y >> 1;
				this. _i = _x | _y << this.parent.xbit;
				this.parent.source[_i] += p;
				x++;
				i++;
			}

		}

		this.parent.solve(before, after);
		var i = 0;
		for (var y = 0; y <= ymax; y++) {
			for (var x = 0; x <= xmax;) {
				var _x = x >> 1;
				var _y = y >> 1;
				var _i = _x | _y << this.parent.xbit;
				this.value[i] += this.parent.value[_i];
				x++;
				i++;
			}
		}

	}
	for (var t = 0; t < after; t++) {
		var i = 0;
		for (var y = 0; y <= ymax; y++) {
			for (var x = 0; x <= xmax;) {
				this.value[i] = (this.source[i] + this.value[x - 1 & xmax | y << this.xbit] + this.value[x + 1 & xmax | y << this.xbit] + this.value[x | (y - 1 & ymax) << this.xbit] + this.value[x | (y + 1 & ymax) << this.xbit]) * this._mass[i];
				x++;
				i++;
			}

		}

	}
};
