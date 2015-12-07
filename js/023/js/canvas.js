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
        this.color = 'black'
        this.lineWidth = 1;
        this.PI2 = Math.PI * 2; // 2*pi
        
	// set the position of the canvas on the browser
	var $cvdiv = $('#cvdiv1');
	this.cvpos.x = $cvdiv.offset().left;
	this.cvpos.y = $cvdiv.offset().top;

        // environment parameter
        this.drawInterval = 33; //msec
        this.theta = Math.PI/6;
        this.px_per_meter = (300/6); // 300px per 6cm
        this.center = {x:200, y:200};
        this.radius = 8; // raduis of balls
        this.cor = 0.8; // coefficient of restitution
        this.cof = 7; // coefficient of friction

        this.ball = [];

	this.blank = function() {
	    //this.ctx.clearRect(0, 0, this.area.w, this.area.h);
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 0, this.area.w, this.area.h);
	};
        
        this.init = function(n) {
            this.ball = [];
            this.gravity = {x:0, y:0, z:-9.8};
            for (var i = 0; i < n; i++) {
                var r = Math.floor(Math.random()*0x12345678);
                this.ball.push({
//                    pos:{x:r%this.area.w/2, y:r%(this.area.h - 1)},
                    pos:{x:100, y:200},
                    v:{x:0, y:0},
                });
            }
        };
        
        this.setFps = function(fps) {
            this.drawInterval = 1000/fps;
        };

        this.setCor = function(cor) {
            this.cor = cor;
        };

        this.setCof = function(cof) {
            this.cof = cof;
        };

        this.setRadius = function(radius) {
            this.radius = radius;
        };

        this.set3dGravity = function(gravity) {
            this.gravity = gravity;
        };
        
        this.getNormalVector = function(dst, src) {
            var v = {x:dst.x - src.x, y:dst.y - src.y};
            var d = Math.sqrt(v.x*v.x + v.y*v.y);
            return {x:v.x/d, y:v.y/d};
        };
        
        this.moveObj = function() {
            // px per sec
            this.accel = {x: this.gravity.x*this.px_per_meter,
                          y: this.gravity.y*this.px_per_meter,
                          z: this.gravity.z*this.px_per_meter};

            // (px/s/s)*(interval)
            var intervalAccel = {x: this.accel.x*this.drawInterval/1000,
                                 y: this.accel.y*this.drawInterval/1000,
                                 z: this.accel.z*this.drawInterval/1000};

            // calc pos
            for (var i = 0; i < this.ball.length; i++) {
                this.ball[i].pos.x += this.ball[i].v.x;
                this.ball[i].pos.y += this.ball[i].v.y;
            }

            // calc vel (inc accel)
            for (var i = 0; i < this.ball.length; i++) {
                var p = this.ball[i].pos;
                var v = this.ball[i].v;
                var nvec = this.getNormalVector(this.center, this.ball[i].pos);
                var acc = {x://intervalAccel.x +
                           -nvec.x*intervalAccel.z*Math.sin(this.theta),
                           y://intervalAccel.y +
                           -nvec.y*intervalAccel.z*Math.sin(this.theta)};
                v.x += acc.x;
                v.y += acc.y;
                
                // friction calc
                var absVel = Math.sqrt(v.x*v.x + v.y*v.y);
                var absVelFriction = (absVel > this.cof ? absVel - this.cof: 0);
                var rate = absVelFriction/absVel;
                v.x *= rate;
                v.y *= rate;

                console.log('x:%d v:%2f vf:%2f v:%2f a:%f',
                            p.x, absVel, absVelFriction, rate, acc.x);
                if (v.x*v.x + v.y*v.y < 1 &&
                    acc.x*acc.x + acc.y*acc.y < 65000) {
                    v.x = v.y = 0;
                } else {
                    //console.log('%d vx:%f vy:%f ix:%f iy:%f',
                    //i, v.x, v.y, acc.x, acc.y);
                }
            }
            
            // collision detection and re-calc vel
            for (var i = 0; i < this.ball.length; i++) {
                var v1 = this.ball[i].v;
                var p1 = this.ball[i].pos;
                for (var j = i + 1; j < this.ball.length; j++) {
                    var v2 = this.ball[j].v;
                    var p2 = this.ball[j].pos;
                    var d12 = {x:p2.x - p1.x, y:p2.y - p1.y};
                    
                    if (Math.abs(d12.x) < 2*this.radius &&
                        Math.abs(d12.y) < 2*this.radius &&
                        d12.x*d12.x + d12.y*d12.y < 4*this.radius*this.radius) {
                        // collision detected
                        var tan = parseFloat(d12.y)/d12.x;
                        var abs_cos = 1/Math.sqrt(tan*tan + 1);
                        var cos = (d12.x > 0 ? abs_cos : -abs_cos);
                        var sin = tan*cos;
                        
                        // rotate coordinates -theta
                        var u1 = {x:v1.x*cos + v1.y*sin,
                                  y:-v1.x*sin + v1.y*cos};
                        var u2 = {x:v2.x*cos + v2.y*sin,
                                  y:-v2.x*sin + v2.y*cos};
                        
                        // temp var
                        var u1x = u1.x;
                        var u2x = u2.x;
                        
                        // next vel
                        u1.x = this.cor*u2x + (1.0 - this.cor)*(u1x + u2x)/2;
                        u2.x = this.cor*u1x + (1.0 - this.cor)*(u1x + u2x)/2;

                        // rotate coordinates +theta
                        v1.x = u1.x*cos - u1.y*sin;
                        v1.y = u1.x*sin + u1.y*cos;
                        v2.x = u2.x*cos - u2.y*sin;
                        v2.y = u2.x*sin + u2.y*cos;

                        // set pos again
                        var d = this.radius - 
                            Math.sqrt(d12.x*d12.x + d12.y*d12.y)/2;
                        p1.x = p1.x - d*cos;
                        p1.y = p1.y - d*sin;
                        p2.x = p2.x + d*cos;
                        p2.y = p2.y + d*sin;
                    }
                }
            }
        };

        this.draw = function() {
            this.blank();
            this.ctx.save();

            this.ctx.strokeStyle = 'rgb(160,160,160)';
            var r = 600;
            var n = 13;
            this.ctx.beginPath();
            for (var i = 0; i < n; i++) {
                var dx = r*Math.cos(Math.PI/n*i);
                var dy = r*Math.sin(Math.PI/n*i);
                this.ctx.moveTo(this.center.x + dx, this.center.y + dy);
                this.ctx.lineTo(this.center.x - dx, this.center.y - dy);
            }
            this.ctx.stroke();

            // draw ball
            this.ctx.fillStyle = 'white';
            //this.ctx.globalAlpha = 0.5;
            for (var i = 0; i < this.ball.length; i++) {
                this.ctx.fillStyle = this.ball[i].color;
                this.ctx.beginPath();
                this.ctx.arc(this.ball[i].pos.x, this.ball[i].pos.y,
                             this.radius, 0, this.PI2, false);
                this.ctx.fill();
            }

            this.ctx.restore();
	};

    }

})(jQuery);

