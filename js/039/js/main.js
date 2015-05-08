var inherits = function(childCtor, parentCtor) {
	// inherits prototype from parent class
	Object.setPrototypeOf(childCtor.prototype, parentCtor.prototype);
};

$(function(){
	function disableEvent(e) { e.preventDefault();}
	document.addEventListener('touchstart', disableEvent, false);
	document.addEventListener('touchmove', disableEvent, false);
	$('img').on('dragstart', disableEvent);

	Movable = function(id, update) {
		this.state = {
			offsetX: 0,
			marginX: 0,
		};
		this.obj = $(id);
		this.bodyObj = $('body');
		this.update = update;
		this.obj.mousedown(this.inputStart.bind(this));
		this.obj.bind('touchstart', this.inputStart.bind(this));
	}

	Movable.prototype.setEventHandler = function() {
		this.bodyObj.mousemove(this.inputMove.bind(this));
		this.bodyObj.mouseup(this.inputEnd.bind(this));
		this.bodyObj.bind('touchmove', this.inputMove.bind(this));
		this.bodyObj.bind('touchend', this.inputEnd.bind(this));
	}

	Movable.prototype.resetEventHandler = function() {
		this.bodyObj.unbind('mousemove');
		this.bodyObj.unbind('mouseup');
		this.bodyObj.unbind('touchmove');
		this.bodyObj.unbind('touchend');
	}

	Movable.prototype.inputStart = function(e) {
		var pageX = (e.pageX? e.pageX: e.originalEvent.touches[0].pageX);
		this.state.offsetX = pageX - this.state.marginX;
		this.setEventHandler();
	}
	
	Movable.prototype.inputMove = function(e) {
		var pageX = (e.pageX? e.pageX: e.originalEvent.touches[0].pageX);
		this.state.marginX = pageX - this.state.offsetX;
		this.obj.css({'margin-left': this.state.marginX + 'px'});
		this.update({left: this.state.marginX / this.bodyObj.width(),
					 right: (this.state.marginX + this.obj.width()) / this.bodyObj.width()});
	}
	
	Movable.prototype.inputEnd = function(e) {
		this.resetEventHandler();
	}
	
	MovableStretch = function(id, update) {
		Movable.call(this, id, update);
		this.prevTouchX = [0, 0];
	}
	
	MovableStretch.prototype.inputStart = function(e) {
		if (e.pageX || e.originalEvent.touches.length == 1) {
			// click or single touch
			Movable.prototype.inputStart.call(this, e);
		} else {
			// multi touch
			this.prevTouchX[0] = e.originalEvent.touches[0].pageX;
			this.prevTouchX[1] = e.originalEvent.touches[1].pageX;
			this.setEventHandler();
		}
	}
	
	MovableStretch.prototype.inputMove = function(e) {
		if (e.pageX || e.originalEvent.touches.length == 1) {
			// click or single touch
			Movable.prototype.inputMove.call(this, e);
		} else {
			// multi touch
			this.prevTouchX[0] = e.originalEvent.touches[0].pageX;
			this.prevTouchX[1] = e.originalEvent.touches[1].pageX;
		}
	}

	inherits(MovableStretch, Movable);

	function LedCtrl() {
		this.refColor = [];
		this.refColor.push({ratio: 0,
							rgb: [{r:   0, g:   0, b:   0},
								  {r:   0, g:   0, b:   0},
								  {r:   0, g:   0, b:   0},
								  {r:   0, g:   0, b:   0},
								  {r:   0, g:   0, b:   0}]});
		this.refColor.push({ratio: 0.5,
							rgb: [{r:   0, g: 100, b:   0},
								  {r:   0, g:   0, b:   0},
								  {r:   0, g:   0, b:   0},
								  {r:   0, g:   0, b:   0},
								  {r:   0, g:   0, b:   0}]});
		this.refColor.push({ratio: 1,
							rgb: [{r: 100, g:   0, b:   0},
								  {r:   0, g:   0, b:   0},
								  {r:   0, g:   0, b:   0},
								  {r:   0, g:   0, b:   0},
								  {r:   0, g:   0, b:   0}]});
							
		this.led = [{r: 0, g: 0, b: 0},
					{r: 0, g: 0, b: 0},
					{r: 0, g: 0, b: 0},
					{r: 0, g: 0, b: 0},
					{r: 0, g: 0, b: 0}];
		this.ledSun = [{r: 0, g: 0, b: 0},
					   {r: 0, g: 0, b: 0},
					   {r: 0, g: 0, b: 0},
					   {r: 0, g: 0, b: 0},
					   {r: 0, g: 0, b: 0}];

		this.sunX = 0;
	}

	LedCtrl.prototype.updateSun = function(p) {
		this.sunX = (p.left + p.right)/2;
		this.updateLed();
	}

	LedCtrl.prototype.updateCloud = function(p) {
		this.updateLed();
	}

	LedCtrl.prototype.updateLed = function() {
		// re-calc sun light
		for (var i = 0; i < this.refColor.length - 1; i++) {
			if (this.sunX < this.refColor[i + 1].ratio) {
				var c = this.refColor[i + 1].ratio - this.refColor[i].ratio;
				var a = this.sunX - this.refColor[i].ratio;
				var b = this.refColor[i + 1].ratio - this.sunX;
				var ra = a/c;
				var rb = b/c;
				
				for (var j = 0; j < this.ledSun.length; j++) {
					this.ledSun[j].r = Math.floor(this.refColor[i].rgb[j].r*rb +
												  this.refColor[i + 1].rgb[j].r*ra);
					this.ledSun[j].g = Math.floor(this.refColor[i].rgb[j].g*rb +
												  this.refColor[i + 1].rgb[j].g*ra);
					this.ledSun[j].b = Math.floor(this.refColor[i].rgb[j].b*rb +
												  this.refColor[i + 1].rgb[j].b*ra);
				}
				
				break;
			}
		}

		// re-calc cloud shadow
		for (var i = 0; i < this.led.length; i++) {
			this.led[i].r = this.ledSun[i].r;
			this.led[i].g = this.ledSun[i].g;
			this.led[i].b = this.ledSun[i].b;
		}

		// update led
		for (var i = 0; i < this.led.length; i++) {
			
			console.log(this.led[i]);

			$('#color_disp_' + i).css('background-color', 'rgb(' +
									 this.led[i].r + ',' + 
									 this.led[i].g + ',' + 
									 this.led[i].b + ')');
		}
	}

	var led = new LedCtrl();
	var sun = new Movable('#sun', led.updateSun.bind(led));
	var cloud = new MovableStretch('#cloud', led.updateCloud.bind(led));
});
