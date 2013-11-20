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
        this.color = 'black'
        this.lineWidth = 1;
        this.PI2 = Math.PI * 2; // 2*pi
        this.radius = 30; // raduis of balls
        
	// set the position of the canvas on the browser
	var $cvdiv = $('#cvdiv1');
	this.cvpos.x = $cvdiv.offset().left;
	this.cvpos.y = $cvdiv.offset().top;

        this.ball = [];
        this.holdBallIdx = null; // index of the hold ball (for positioning)
        this.releasedBallIdx = null; // index of the released ball (for speed setting)
        this.prevCorsorPos = {x:0, y:0}; // previous cursor position (updated by event)
        this.prevHoldBallPos = {x:0, y:0}; // previous hold ball pos (updated by timer)

	/* init process
	 * return: none
	 */
        this.ball[0] = {
            pos:{x:100, y:100},
            speed:{x:0, y:0},
            color:'green',
            moveNow: false
        };
        /*
        this.ball[1] = {
            pos:{x:150, y:100},
            speed:{x:4, y:-2},
            color:'red'
        };
        this.ball[2] = {
            pos:{x:200, y:100},
            speed:{x:-4, y:2},
            color:'blue'
        };
        */

	/* init canvas
	 * return: none
	 */
	this.blank = function() {
	    // clear
	    this.ctx.clearRect(0, 0, this.area.w, this.area.h);
	};

        this.init = function() {
            
        };

	/* draw canvas
	 * return: none
	 */
        this.draw = function() {
            this.blank();
            this.ctx.save();
            this.ctx.strokeStyle = this.color;
            this.ctx.globalAlpha = 0.5;

            for (var i = 0; i < this.ball.length; i++) {
                this.ctx.fillStyle = this.ball[i].color;
                this.ctx.beginPath();
                this.ctx.arc(this.ball[i].pos.x, this.ball[i].pos.y,
                             this.radius, 0, this.PI2, false);
                this.ctx.fill();
            }

            this.ctx.restore();
	};

        this.moveObj = function() {
            for (var i = 0; i < this.ball.length; i++) {
                if (this.ball[i].moveNow) {
                    this.ball[i].pos.x += this.ball[i].speed.x;
                    this.ball[i].pos.y += this.ball[i].speed.y;
                    if (this.ball[i].pos.x + this.radius > this.area.w) {
                        this.ball[i].pos.x = this.area.w -
                            (this.ball[i].pos.x + this.radius - this.area.w) - this.radius;
                        this.ball[i].speed.x = -this.ball[i].speed.x;
                    }
                    if (this.ball[i].pos.x - this.radius < 0) {
                        this.ball[i].pos.x = -(this.ball[i].pos.x - this.radius) + this.radius;
                        this.ball[i].speed.x = -this.ball[i].speed.x;
                    }
                    if (this.ball[i].pos.y + this.radius > this.area.h) {
                        this.ball[i].pos.y = this.area.h
                            - (this.ball[i].pos.y + this.radius - this.area.h) - this.radius;
                        this.ball[i].speed.y = -this.ball[i].speed.y;
                    }
                    if (this.ball[i].pos.y - this.radius < 0) {
                        this.ball[i].pos.y = -(this.ball[i].pos.y - this.radius) + this.radius;
                        this.ball[i].speed.y = -this.ball[i].speed.y;
                    }
                }
            }            
        };
        
        this.setSpeedMovedObj = function() {
            if (this.releasedBallIdx != null) {
                this.ball[this.releasedBallIdx].speed.x =
                    this.ball[this.releasedBallIdx].pos.x - this.prevHoldBallPos.x;
                this.ball[this.releasedBallIdx].speed.y =
                    this.ball[this.releasedBallIdx].pos.y - this.prevHoldBallPos.y;

                if (this.ball[this.releasedBallIdx].speed.x != 0 ||
                    this.ball[this.releasedBallIdx].speed.y != 0) {
                    this.ball[this.releasedBallIdx].moveNow = true;
                    console.log('moveing (speed)');
                }
                this.releasedBallIdx = null;
            }
            if (this.holdBallIdx != null) {
                this.prevHoldBallPos.x = this.ball[this.holdBallIdx].pos.x;
                this.prevHoldBallPos.y = this.ball[this.holdBallIdx].pos.y;
            }
        }

        this.holdAt = function(pos) {
            // check if the clicked position is on a ball
            for (var i = 0; i < this.ball.length; i++) {
                if (this.ball[i].pos.x - this.radius < pos.x &&
                    this.ball[i].pos.x + this.radius > pos.x &&
                    this.ball[i].pos.y - this.radius < pos.y &&
                    this.ball[i].pos.y + this.radius > pos.y) {
                    //this.ball[i].moveNow;
                    this.holdBallIdx = i;
                    this.prevCursorPos = pos;
                    this.ball[i].moveNow = false;
                }
            }
        };

        this.releaseAt = function(pos) {
            if (this.holdBallIdx != null) {
                this.releasedBallIdx = this.holdBallIdx;
                this.holdBallIdx = null;
            }
        };

        this.moveTo = function(pos) {
            if (this.holdBallIdx != null) {
                this.ball[this.holdBallIdx].pos.x += pos.x - this.prevCursorPos.x;
                this.ball[this.holdBallIdx].pos.y += pos.y - this.prevCursorPos.y;
                this.prevCursorPos = pos;
            }
        };
    }

})(jQuery);

