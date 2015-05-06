$(function(){
	function disableScrolling(e) { e.preventDefault();}
	document.addEventListener('touchstart', disableScrolling, false);
	document.addEventListener('touchmove', disableScrolling, false);
	$('img').on('dragstart', disableScrolling);

	function movable(id, update) {
		this.state = {
			offset_x: 0,
			last_margin_x: 0,
		};
		this.obj = $(id);
		this.bodyObj = $('body');
		this.update = update;

		this.obj.mousedown(inputStart.bind(this));
		this.obj.bind('touchstart', inputStart.bind(this));

		function inputStart(e) {
			var pageX = (e.pageX? e.pageX: e.originalEvent.touches[0].pageX);

			this.state.offset_x = pageX - this.state.last_margin_x;
			this.bodyObj.mousemove(inputMove.bind(this));
			this.bodyObj.mouseup(inputEnd.bind(this));
			this.bodyObj.bind('touchmove', inputMove.bind(this));
			this.bodyObj.bind('touchend', inputEnd.bind(this));
		}

		function inputMove(e) {
			var pageX = (e.pageX? e.pageX: e.originalEvent.touches[0].pageX);

			this.state.last_margin_x = pageX - this.state.offset_x;
			this.obj.css({'margin-left': this.state.last_margin_x + 'px'});
			this.update({left: this.state.last_margin_x / this.bodyObj.width(),
						 right: (this.state.last_margin_x + this.obj.width()) / this.bodyObj.width()});
		}

		function inputEnd(e) {
			this.bodyObj.unbind('mousemove');
			this.bodyObj.unbind('mouseup');
			this.bodyObj.unbind('touchmove');
			this.bodyObj.unbind('touchend');
		}
	}

	function ledCtrl() {
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

		this.updateSun = function(p) {
			var r = (p.left + p.right)/2;

			for (var i = 0; i < this.refColor.length - 1; i++) {
				if (r < this.refColor[i + 1].ratio) {
					var c = this.refColor[i + 1].ratio - this.refColor[i].ratio;
					var a = r - this.refColor[i].ratio;
					var b = this.refColor[i + 1].ratio - r;
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
		
		this.updateCloud = function(p) {
			console.log(p);
		}
	}

	var led = new ledCtrl();

	led.updateSun(0);
	var sun = new movable('#sun', led.updateSun.bind(led));
	var cloud = new movable('#cloud', led.updateCloud.bind(led));

	$('#color_disp_0').text('hoge');
});
