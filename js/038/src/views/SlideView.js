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

	var mCenter = new Modifier({
		origin: [0.5,0.5],
		align: [0.5,0.5],
	});
	
	function SlideView() {
		View.apply(this, arguments);

		_layoutLandscape.call(this);
		_createTitleView.call(this);
		_createDescriptionView.call(this);
		_createDiagramView.call(this);
		_createBackground.call(this);
	}

	SlideView.DEFAULT_OPTIONS = {
		textColor: '#fff',
		size: [800, 600],
		duration: 300,
		tick: 300,
		border: '0px solid white'
	};

	SlideView.DEFAULT_OPTIONS.transition = {
		duration: SlideView.DEFAULT_OPTIONS.duration,
		curve: 'easeOut'
	};
	
	SlideView.prototype = Object.create(View.prototype);
	SlideView.prototype.constructor = SlideView;

	function _createBackground() {
		var sBackground = new Surface();
		this.add(sBackground);
		sBackground.on('click', function() {
			this._eventOutput.emit('click');
		}.bind(this));
	}
	
	function _layoutLandscape() {
		// create views
		this.vTitle = new View();
		this.vDescription = new View();
		this.vDiagram = new View();

		var layout = new FlexibleLayout({
			ratios: [1, 3],
			direction: 1
		});
		layout.sequenceFrom([this.vTitle, this.vDescription]);
		
		var centerModifier = new Modifier({
			origin: [0.5, 0.5],
			align: [0.5, 0.5],
			size: this.options.size
		});
		var layout2 = new FlexibleLayout({
			ratios: [3, 4]
		});
		layout2.sequenceFrom([layout, this.vDiagram]);
		this.add(centerModifier).add(layout2);
	}
	
	function _createTitleView() {
		var sTitle = new Surface({
			content: 'Flexible Animation',
			properties: {
				fontSize: (this.options.size[0]*0.04) + 'px',
				color: this.options.textColor,
				border: this.options.border,
				pointerEvents: 'none'
			}
		});
		
		var smInsert = new StateModifier({
			opacity: 0,
			transform: Transform.translate(0, 0, -100)
		});

		setTimeout(function() {
			smInsert.setOpacity(1, SlideView.DEFAULT_OPTIONS.transition);
			smInsert.setTransform(Transform.translate(0, 0, 0), SlideView.DEFAULT_OPTIONS.transition);
		}, this.options.tick);

		this.vTitle.add(smInsert).add(sTitle);
	}

	function _createDescriptionView() {
		var code =
			'<ul style="color: #fae">' +
			'<li>Tween Animation</li>' +
			'<li>Phisics Animation</li>' +
			'</ul><ul style="color: #aef">' +
			'<li>Position</li>' +
			'<li>Angle</li>' +
			'<li>Size</li>' +
			'<li>Style</li>' +
			'</ul>';

		var sDescription = new Surface({
			content: 'Contents can be animated smoothly with famo.us framework' + code,
			properties: {
				fontSize: (this.options.size[0]*0.02) + 'px',
				color: this.options.textColor,
				border: this.options.border,
				pointerEvents: 'none'
			}
		});
		
		var smInsert = new StateModifier({
			opacity: 0,
			transform: Transform.translate(0, 0, -100)
		});

		setTimeout(function() {
			smInsert.setOpacity(1, SlideView.DEFAULT_OPTIONS.transition)
			smInsert.setTransform(Transform.translate(0, 0, 0), SlideView.DEFAULT_OPTIONS.transition)
		}, this.options.tick*2);
		

		this.vDescription.add(smInsert).add(sDescription);
	}

	function _createDiagramView() {
		////////////////////////////////////////////////////////////
		// scheme-mono rotate
		var isLogo = new ImageSurface({
			size: [this.options.size[0]*0.42, true],
			content: 'img/scheme-mono.png',
			classes: ['double-sided']
		});

		var mCenterSpinY = new Modifier({
			origin: [0.5, 0.5],
			align: [0.5, 0.25],
		});

		var smInsert = new StateModifier({
			opacity: 0,
			transform: Transform.translate(100, 0, 0)
		});

		setTimeout(function() {
			initialTime = Date.now();
			smInsert.setOpacity(1, SlideView.DEFAULT_OPTIONS.transition);
			smInsert.setTransform(Transform.translate(0, 0, 0),
								  SlideView.DEFAULT_OPTIONS.transition,
								  function() {
									  var initialTime = Date.now();
									  mCenterSpinY.setTransform(
										  function() {
											  return Transform.rotateY(.002 * (Date.now() - initialTime));
										  });
								  }
								 );
		}, this.options.tick*2);
		
		this.vDiagram.add(smInsert).add(mCenterSpinY).add(isLogo);
		
		////////////////////////////////////////////////////////////
		// rest room
		var isLogo2 = new ImageSurface({
			size: [this.options.size[0]*0.1, true],
			content: 'http://illustcut.com/box/mark/iroiro1/mark01_20.png'
		});
		
		var smDamping = new StateModifier();

		var smInsert2 = new StateModifier({
			origin: [0.5, 0.5],
			align: [0.5, 0.75],
			opacity: 0,
			transform: Transform.translate(150, 0, 0)
		});

		Transitionable.registerMethod('spring', SpringTransition);
		
		setTimeout(function() {
			smInsert2.setOpacity(1, SlideView.DEFAULT_OPTIONS.transition);
			smInsert2.setTransform(Transform.translate(0, 0, 0), SlideView.DEFAULT_OPTIONS.transition,
								   function() {
									   smDamping.setTransform(
										   Transform.rotateX(-0.5),
										   { duration: 200, curve: 'easeOut' }
									   );
									   smDamping.setTransform(
										   Transform.identity,
										   { method: 'spring', period: 1100, dampingRatio: 0 }
									   );
								   }
								  );
		}, this.options.tick*3);
		
		this.vDiagram.add(smDamping).add(smInsert2).add(isLogo2);
	}
	
	module.exports = SlideView;
});

