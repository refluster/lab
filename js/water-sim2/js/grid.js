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
