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
        
	// set the position of the canvas on the browser
	var $cvdiv = $('#cvdiv1');
	this.cvpos.x = $cvdiv.offset().left;
	this.cvpos.y = $cvdiv.offset().top;

	/* init process
	 * return: none
	 */
	this.init = function() {
	}

	/* init canvas
	 * return: none
	 */
	this.blank = function() {
	    this.ctx.clearRect(0, 0, this.area.w, this.area.h);
	};

	/* draw canvas
	 * return: none
	 */
	this.draw = function(pos, color) {
            this.ctx.save();
            this.ctx.fillStyle = color;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, 8, 0,  2*Math.PI, true);
            this.ctx.fill();
            this.ctx.restore();
	};
    }

})(jQuery);

