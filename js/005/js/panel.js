/* HTML5 Canvas drag&drop
 * canvas is updated when an object is dragged by 1px
 */
var panelApl = {}; // namespace

(function($) {
    // timer
    panelApl.timer = $.timer();

    /* button process
     * return: none
     */
    panelApl.start = function() {
		var $cvdiv = $('#cvdiv1'); // main Canvas¤Îdiv

		// init canvas
		panelApl.canv.init();
		
        panelApl.timer.play();
    };

    /* body onload process */
    $(window).load(function() {
		// get canvas's DOM element and context
		var canvas = document.getElementById('cv1');
		if ( ! canvas || ! canvas.getContext ) { return false; }
		var ctx = canvas.getContext("2d");
		ctx.lineWidth = 1;
		ctx.globalCompositeOperation = "source-over";

		// display
		panelApl.canv = new canvasManager.canv(ctx, canvas.width, canvas.height, panelApl);
		panelApl.canv.init();
		panelApl.canv.draw();

        panelApl.timer.set({
            action: function() {
                panelApl.count ++;
                panelApl.canv.moveObj();
                panelApl.canv.draw();
            },
            time: 15
        });

		panelApl.start();
    });


})(jQuery);
