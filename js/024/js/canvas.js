/* HTML5 Canvas drag&drop */
var canvasManager = {}; // namespace

(function($) {
    /* canvas class
     * {canvas context} ctx: the context
     * {int} w: width
     * {int} h: height
     */

    canvasManager.canv = function(ctx, w, h) {
	this.ctx = ctx; // the context
	this.area = {w:w, h:h};  // the area
        
	// set the position of the canvas on the browser
        //var $cvdiv = $('#cvdiv1');
	//this.cvpos.x = $cvdiv.offset().left;
	//this.cvpos.y = $cvdiv.offset().top;
        
        //////////////////////////////
        this.shading = 4;
        this.refraction = 2;
        this.damping = 0.99;
        this.background;
        this.imageData;
        this.cvpos = {x:0, y:0};  // position of the canvas on the browser

        this.buffer1 = [];
        this.buffer2 = [];

        this.drawInterval = 600; // msec, 1000/fps

	this.blank = function() {
            this.ctx.beginPath();
            /* set the gradient region */
            var grad = this.ctx.createLinearGradient(0, 0, 0, this.area.h);
            /* set the colors at the beginning and the end */
            grad.addColorStop(0,'#6080e0');
            grad.addColorStop(1,'#80b0ff');
            /* set the gradient to fill style */
            this.ctx.fillStyle = grad;
            /* draw rect */
            this.ctx.fillRect(0, 0, this.area.w, this.area.h);
	};
        
        this.init = function() {
            for (var i = 0; i < this.area.w*this.area.h; i++){
                this.buffer1.push(0);
                this.buffer2.push(0);
            }

            this.buffer1[50 + 30*this.area.w] = 100;
            this.blank();
            this.background = this.ctx.
                getImageData(0, 0, w, h).data;
            this.imageData = this.ctx.getImageData(0, 0, w, h);

            // set the position of the canvas on the browser
            var $cvdiv = $('#cvdiv1');
            this.cvpos.x = $cvdiv.offset().left;
            this.cvpos.y = $cvdiv.offset().top;
        };
        
        this.setPos = function(x, y) {
            this.buffer1[x + y*this.area.w] += 200;
        };

        this.setFps = function(fps) {
            this.drawInterval = 1000/fps;
        };

        this.update = function() {
            for (var i = this.area.w + 1, x = 1;
                 i < this.area.w*this.area.h - this.area.w;
                 i++, x++){
                if ((x < this.area.w)){
                    this.buffer2[i] = ((this.buffer1[i - 1] +
                                        this.buffer1[i + 1] +
                                        this.buffer1[i - this.area.w] +
                                        this.buffer1[i + this.area.w])/2)
                        - this.buffer2[i];
                    this.buffer2[i] *= this.damping;
                } else x = 0;
            }
            
            var temp = this.buffer1;
            this.buffer1 = this.buffer2;
            this.buffer2 = temp;
        };

        this.draw = function() {
            var imageDataArray = this.imageData.data;

            for (var i = this.area.w + 1, index = (this.area.w + 1) * 4;
                 i < this.area.w*this.area.h - (1 + this.area.w);
                 i++, index += 4){
                var xOffset = ~~(this.buffer1[i - 1] -
                                 this.buffer1[i + 1]);
                var yOffset = ~~(this.buffer1[i - this.area.w] -
                                 this.buffer1[i + this.area.w]);
                var shade = xOffset*this.shading;
                var texture = index + (xOffset*this.refraction +
                                       yOffset*this.refraction*this.area.w)*4;
                imageDataArray[index] = 
                    this.background[texture] + shade; 
                imageDataArray[index + 1] = 
                    this.background[texture + 1] + shade;
                imageDataArray[index + 2] = 
                    this.background[texture + 2] + shade;
            }
            this.ctx.putImageData(this.imageData, 0, 0);
            
	};

    }

})(jQuery);

