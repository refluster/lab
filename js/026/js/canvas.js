/* HTML5 Canvas drag&drop */
var canvasManager = {}; // namespace

(function($) {
    /* canvas class
     * {canvas context} ctx: the context
     * {int} w: width
     * {int} h: height
     * {objext} names: caller namespace
     */

    canvasManager.canv = function(ctx, w, h, names) {
	this.ctx = ctx; // the context
	this.area = {w:w, h:h};  // the area
	this.cvpos = {x:0, y:0};  // position of the canvas on the browser
        this.prevPos = {x:0, y:0}; // previous position of the cursor
        this.lineWidth = 1;
        this.PI2 = Math.PI * 2; // 2*pi
        
	// set the position of the canvas on the browser
	var $cvdiv = $('#cvdiv1');
	this.cvpos.x = $cvdiv.offset().left;
	this.cvpos.y = $cvdiv.offset().top;

        // environment parameter
        this.drawInterval = 33; //msec
        this.radius = 3; // raduis of balls
        this.particles = [];
        this.sph;

	this.blank = function() {
	    //this.ctx.clearRect(0, 0, this.area.w, this.area.h);
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 0, this.area.w, this.area.h);
	};
        
        this.init = function(n) {
            this.sph = new Sim();
            this.sph.init();
        };
        
        this.setFps = function(fps) {
            this.drawInterval = 1000/fps;
        };

        this.setRadius = function(radius) {
            this.radius = radius;
        };
        
        this.moveObj = function() {
            this.sph.step();
        };

        this.draw = function() {
            this.blank();
            this.ctx.save();

            // draw ball
            this.ctx.fillStyle = 'white';
            //this.ctx.globalAlpha = 0.5;

            var p = this.sph.get_particle();

            for (var i = 0; i < p.length; i++) {
                this.ctx.beginPath();
                this.ctx.arc(p[i].pos.x*8, this.area.h-p[i].pos.y*8,
                             this.radius, 0, this.PI2, false);
                this.ctx.fill();
            }

            this.ctx.restore();
	};

    }

})(jQuery);

