

$(function(){
	function disableScrolling(e) { e.preventDefault();}
	document.addEventListener('touchstart', disableScrolling, false);
	document.addEventListener('touchmove', disableScrolling, false);
	$('img').on('dragstart', disableScrolling);

	var Movable = function(id, update) {
		this.state = {
			offset_x: 0,
			last_margin_x: 0,
		};
		this.obj = $(id);
		this.bodyObj = $('body');
		this.update = update;

		this.obj.mousedown(this.inputStart.bind(this));
		this.obj.bind('touchstart', this.inputStart.bind(this));
	}

	Movable.prototype.inputStart = function(e) {
		var pageX = (e.pageX? e.pageX: e.originalEvent.touches[0].pageX);
		
		this.state.offset_x = pageX - this.state.last_margin_x;
		this.bodyObj.mousemove(this.inputMove.bind(this));
		this.bodyObj.mouseup(this.inputEnd.bind(this));
		this.bodyObj.bind('touchmove', this.inputMove.bind(this));
		this.bodyObj.bind('touchend', this.inputEnd.bind(this));
	}
	
	Movable.prototype.inputMove = function(e) {
		var pageX = (e.pageX? e.pageX: e.originalEvent.touches[0].pageX);
		
		this.state.last_margin_x = pageX - this.state.offset_x;
		this.obj.css({'margin-left': this.state.last_margin_x + 'px'});
		this.update({left: this.state.last_margin_x / this.bodyObj.width(),
					 right: (this.state.last_margin_x + this.obj.width()) / this.bodyObj.width()});
	}
	
	Movable.prototype.inputEnd = function(e) {
		this.bodyObj.unbind('mousemove');
		this.bodyObj.unbind('mouseup');
		this.bodyObj.unbind('touchmove');
		this.bodyObj.unbind('touchend');
	}
	
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
		this.updateLed.bind(this);
	}

	LedCtrl.prototype.updateCloud = function(p) {
		//this.sunX = (p.left + p.right)/2;
		this.updateLed.bind(this);
	}

	LedCtrl.prototype.updateLed = function() {
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
				
				console.log(this.ledSun[0]);
				break;
			}
		}
	}

	var led = new LedCtrl();
	var sun = new Movable('#sun', led.updateSun.bind(led));
	var cloud = new Movable('#cloud', led.updateCloud.bind(led));
});
