var canvasManager = {}; // namespace

(function($) {
	
	/* canvas class
	 * {canvas context} ctx: context
	 * {int} w: width
	 * {int} h: height
	 * {objext} names: caller namespace
	 */
	canvasManager.canv = function(ctx, w, h, names) {
		this.ctx = ctx; // the context
		this.area = {w:w, h:h};  // the area
//		this.cvpos = {x:0, y:0};  // position of the canvas on the browser
		this.prevPos = {x:0, y:0}; // previous position of the cursor
		this.color = 'black';
		this.lineWidth = 1;
		
		// set the position of the canvas on the browser
//		var $cvdiv = $('#cvdiv1');
//		this.cvpos.x = $cvdiv.offset().left;
//		this.cvpos.y = $cvdiv.offset().top;
		
		this.blank = function() {
			this.ctx.clearRect(0, 0, this.area.w, this.area.h);
		};
		
		this.setPos = function(pos) {
			this.prevPos = pos;
		};
		
		this.setColor = function(color) {
			this.color = color;
		};
		
		this.setLineWidth = function(lineWidth) {
			this.lineWidth = lineWidth;
		};
		
		this.draw = function(pos) {
			this.ctx.save();
			this.ctx.strokeStyle = this.color;
			this.ctx.lineWidth = this.lineWidth;
			
			this.ctx.beginPath();
			this.ctx.moveTo(this.prevPos.x, this.prevPos.y);
			this.ctx.lineTo(pos.x, pos.y);
			this.ctx.stroke();
			
			this.ctx.restore();
			
			this.prevPos = pos;
		};
		
		this.restoreImage = function(imgData) {
			var img = new Image();
			var alpha = ctx.globalAlpha;
			
			img.src = imgData;
			ctx.globalAlpha = 1.0;
			this.ctx.drawImage(img, 0, 0);
			ctx.globalAlpha = alpha;
		}
	}
})(jQuery);
