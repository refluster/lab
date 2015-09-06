/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var panelApl = function() {
	this.simulating = false;  // true if playing
	this.timer = $.timer();
	this.fps = 30;

		// get canvas's DOM element and context
		var canvas = document.getElementById('cv1');
		if ( ! canvas || ! canvas.getContext ) { return false; }
		var ctx = canvas.getContext("2d");

		// canvas
		this.canv = new canvasManager.canv(ctx, canvas.width,
											   canvas.height);
		this.canv.init();
		this.canv.draw();

		// set events
		var $btn = $('#stbtn1'); // start button
		$btn.mousedown(this.start.bind(this));
		$btn.text('start');

		// show message
		this.showmsg('press start button');
		window.addEventListener('devicemotion', this.readGravity);

		this.timer.set({
			action: function() {
				this.canv.moveObj();
				this.canv.draw();
			}.bind(this),
			time: 1000/this.fps
		});

}; // namespace

	/* button process
	 * return: none
	 */
panelApl.prototype.start = function() {
		var $cvdiv = $('#cvdiv1'); // main Canvas¤Îdiv
		var $btn = $('#stbtn1'); // start button

		if (!this.simulating) { // if not playing
			// init canvas
			this.canv.init();
			this.simulating = true;
			this.canv.setFps(this.fps);
			this.showmsg('moving');
			this.timer.play();
			$btn.text('stop');
		} else { // if playing
			this.simulating = false;
			this.timer.pause();
			this.showmsg('paused');
			$btn.text('start');
		}
};

panelApl.prototype.showmsg = function(msg) {
		$('#msg1').html(msg);
};

$(function() {
    var apl = new panelApl();
});
