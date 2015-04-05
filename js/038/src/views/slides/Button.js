define(function(require, exports, module) {
	var Surface = require('famous/core/Surface');
	var Transform = require('famous/core/Transform');
	var Modifier = require('famous/core/Modifier');
	var StateModifier = require('famous/modifiers/StateModifier');
	var Easing = require('famous/transitions/Easing');
	var Transitionable = require('famous/transitions/Transitionable');
	var View = require('famous/core/View');
	var GridLayout = require("famous/views/GridLayout");
	var ImageSurface = require("famous/surfaces/ImageSurface");
	var Transitionable	 = require('famous/transitions/Transitionable');
	var SpringTransition = require('famous/transitions/SpringTransition');
	var FlexibleLayout = require('famous/views/FlexibleLayout');
	var ScrollSync = require("famous/inputs/ScrollSync");

	var mCenter = new Modifier({
		origin: [0.5,0.5],
		align: [0.5,0.5],
	});
	
	function Button() {
		View.apply(this, arguments);

		_createRootModifier.call(this);
		
		_createTitleView.call(this);
		_createButton.call(this);
		_createClock.call(this);
		_createWatch.call(this);
		//_createDescriptionView.call(this);
		//_createDiagramView.call(this);
		_createBackground.call(this);
	}

	Button.DEFAULT_OPTIONS = {
		textColor: '#fff',
		size: [800, 600],
		duration: 300,
		tick: 300,
		border: '0px solid white'
	};

	Button.DEFAULT_OPTIONS.transition = {
		duration: Button.DEFAULT_OPTIONS.duration,
		//		curve: 'easeOut'
		curve: Easing.outBack
	};

	Button.prototype = Object.create(View.prototype);
	Button.prototype.constructor = Button;

	function _createBackground() {
		var sBackground = new Surface({
			transform: Transform.translate(0, 0, -100)
		});
		this.add(sBackground);
		sBackground.on('click', function() {
			this._eventOutput.emit('click');
		}.bind(this));
	}
	
	function _createRootModifier() {
		// create views
		var mCenter = new Modifier({
			origin: [0.5, 0.5],
			align: [0.5, 0.5],
			size: this.options.size
		});
		this.rootModifier = this.add(mCenter);
	}
	
	function _createTitleView() {
		var sTitle = new Surface({
			content: 'Combination with Inputs',
			properties: {
				fontSize: (this.options.size[0]*0.04) + 'px',
				color: this.options.textColor,
				border: this.options.border,
				pointerEvents: 'none',
				textAlign: 'center'
			}
		});
		
		var smInsert = new StateModifier({
			opacity: 0,
			transform: Transform.translate(0, 0, -100)
		});

		setTimeout(function() {
			smInsert.setOpacity(1, Button.DEFAULT_OPTIONS.transition);
			smInsert.setTransform(Transform.translate(0, 0, 0), Button.DEFAULT_OPTIONS.transition);
		}, this.options.tick);

		this.rootModifier.add(smInsert).add(sTitle);
	}

	function _createButton() {
		var tState = new Transitionable(0);
		var isToggled = false;

		const HEIGHT = this.options.size[0]*0.1;
		const WIDTH = HEIGHT*1.5;
		const TRANSITION = {duration: 400, curve: Easing.outBack};
		
		var sSlider = new Surface({
			size: [HEIGHT - 1, HEIGHT - 1],
			content: 'click me',
			properties: {
				color: '#666',
				backgroundColor: '#eee',
				border: '1px solid #888',
				borderRadius: (HEIGHT - 2) + 'px',
				cursor: 'pointer',
				textAlign: 'center',
				lineHeight: (HEIGHT - 2) + 'px',
				zIndex: 3
			}
		});

		sSlider.on('click', switchButton);
		
		var sGray = new Surface({
			size: [WIDTH, HEIGHT],
			properties: {
				backgroundColor: '#888',
				border: '1px solid #666',
				borderRadius: HEIGHT + 'px',
				zIndex: 1
			}
		});
		
		var sGreen = new Surface({
			size: [WIDTH, HEIGHT],
			properties: {
				backgroundColor: '#5e8',
				border: '1px solid #666',
				borderRadius: HEIGHT + 'px',
				zIndex: 2
			}
		});
		
		var mGreen = new Modifier({
			opacity: function() {
				return tState.get();
			}
		});

		var mSlider = new Modifier({
			transform: function() {
				return Transform.translate(tState.get()*(WIDTH - HEIGHT ) + 1, 0, 0);
			}
		});

		function switchButton() {
			isToggled = !isToggled;
			
			if (isToggled)
				tState.set(1, TRANSITION);
			else
				tState.set(0, TRANSITION);
		}

		var smInsert = new StateModifier({
			size: [WIDTH, HEIGHT],
			origin: [0.5, 0.5],
			align: [0.5, 0.5],
			transform: Transform.translate(0, 100, 0),
			opacity: 0
		})

		setTimeout(function() {
			smInsert.setTransform(Transform.translate(0, 0, 0), Button.DEFAULT_OPTIONS.transition);
			smInsert.setOpacity(1, Button.DEFAULT_OPTIONS.transition);
		}, 800);

		var nButton = this.rootModifier.add(smInsert);

		nButton.add(mGreen).add(sGreen);
		nButton.add(sGray);
		nButton.add(mSlider).add(sSlider);
	}
	
	function _createClock() {
		const HEIGHT = this.options.size[0]*0.2;
		const TRANSITION = {duration: 400, curve: Easing.outBack};

		var tState = new Transitionable(0);

		var sClock = new Surface({
			content: 'click me',
			size: [HEIGHT, HEIGHT],
			properties: {
				color: '#666',
				backgroundColor: '#8af',
				zIndex: 1,
				lineHeight: HEIGHT + 'px',
				textAlign: 'center'
			}
		});

		var smInsert = new StateModifier({
			transform: Transform.translate(0, 100, 0),
			opacity: 0
		});

		var mClock = new Modifier({
			origin: [0.5, 0.5],
			align: [0.2, 0.5],
			transform: function() {
				return Transform.rotate(0, 0, tState.get());
			}
		});

		sClock.on('click', rotateClock);

		function rotateClock() {
			tState.halt();
			tState.set(tState.get() + 1, TRANSITION);
		}

		setTimeout(function() {
			smInsert.setTransform(Transform.translate(0, 0, 0), Button.DEFAULT_OPTIONS.transition);
			smInsert.setOpacity(1, Button.DEFAULT_OPTIONS.transition);
		}, 1000);
		
		this.rootModifier.add(smInsert).add(mClock).add(sClock);
	}
	
	function _createWatch() {
		const SIZE = this.options.size[0]*.14;//120;
		const NR_NUMBER = 6;
		const RADIUS = this.options.size[0]*.12;//100;

		var watchRadian = 2;
		var watchRotate;

		var smInsert = new StateModifier({
			transform: Transform.translate(0, 100, 0),
			opacity: 0
		});

		var scrollSync = new ScrollSync();

		scrollSync.on("update", function(data) {
			watchRadian += data.delta[1] * 0.003;
			watchRotate.setTransform(Transform.rotateX(watchRadian));
		});

		watchRotate = new Modifier({
			opacity: 1.0,
			transform: Transform.rotateX(watchRadian)
		});

		this.watchModifier = this.rootModifier.add(smInsert).add(watchRotate);

		setTimeout(function() {
			smInsert.setOpacity(1, Button.DEFAULT_OPTIONS.transition);
			smInsert.setTransform(Transform.translate(0, 0, 0), Button.DEFAULT_OPTIONS.transition);
		}, 1200);

		for (var i = 0; i < NR_NUMBER; i++) {
			var mRadius = new Modifier({
				origin: [0.5, 0.5],
				align: [0.78, 0.5],
				size: [SIZE, SIZE],
				transform: Transform.translate(0, 0, RADIUS)
			});
			
			var sNumber = new Surface({
				origin: [0.5, 0.5],
				align: [0.5, 0.5],
				content: 'scroll on me',
				transform: Transform.translate(0, 0, 0),
				properties: {
					color: 'white',
					fontSize: (SIZE*.125) + 'px',
					textAlign: 'center',
					lineHeight: SIZE + 'px',
					backgroundColor: '#f6b',
					border: '1px solid #444',
					//backgroundBlendMode: 'screen',
					//textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #f0d,' +
					//	'0 0 70px #0fd, 0 0 80px #0fd, 0 0 100px #0fd, 0 0 150px #0fd'
				},
				classes: ['double-sided'],
			});

			var mRotate = new Modifier({
				transform: Transform.rotateX(i*Math.PI*2/NR_NUMBER),
			});

			this.watchModifier.add(mRotate).add(mRadius).add(sNumber);

			sNumber.pipe(scrollSync);
		}
	}

	module.exports = Button;
});

