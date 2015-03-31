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
    var Transitionable   = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');

	var mCenter = new Modifier({
		origin: [0.5,0.5],
		align: [0.5,0.5],
	});
	
    function SlideView() {
        View.apply(this, arguments);

		_layout.call(this);
		_createTitleView.call(this);
		_createDescriptionView.call(this);
		_createDiagramView.call(this);
		_createBackground.call(this);
    }

    SlideView.DEFAULT_OPTIONS = {
		textColor: '#fff',
		size: [800, 600],
		duration: 600,
		tick: 400,
    };

	SlideView.DEFAULT_OPTIONS.transition = {
		duration: SlideView.DEFAULT_OPTIONS.duration,
		curve: 'easeOut'
	};
	
    SlideView.prototype = Object.create(View.prototype);
    SlideView.prototype.constructor = SlideView;

	function _createBackground() {
		var sBackground = new Surface({
			properties: {
				//backgroundColor: this.options.backgroundColor,
				//textAlign: 'center',
				border: '1px solid green'
			}
		});
		
		this.add(sBackground);

		sBackground.on('click', function() {
            this._eventOutput.emit('click');
        }.bind(this));
	}
	
	function _layout() {
		// create views
		this.vTitle = new View();
		this.vDescription = new View();
		this.vDiagram = new View();

		var FlexibleLayout = require('famous/views/FlexibleLayout');
		var layout = new FlexibleLayout({
			ratios: [2, 3],
			direction: 1
		});
		layout.sequenceFrom([this.vTitle, this.vDescription]);
		
        var centerModifier = new Modifier({
			origin: [0.5, 0.5],
			align: [0.5, 0.5],
			size: this.options.size
        });
        var grid = new GridLayout({
            dimensions: [2, 1]
        });
        grid.sequenceFrom([layout, this.vDiagram]);
		
		this.add(centerModifier).add(grid);
	}
	
	function _createTitleView() {
		var sTitle = new Surface({
			content: 'Flexible Animation',
			properties: {
				fontSize: '40px',
				color: this.options.textColor,
				border: '1px solid white',
				lineHeight: '100px',
				//textAlign: 'center',
				pointerEvents: 'none'
			}
		});

		var smInsert = new StateModifier({
			transform: Transform.translate(0, 0, -100)
		});

		smInsert.setTransform(
			Transform.translate(0, 0, 0),
			{
				duration: this.options.duration,
				curve: 'easeInOut'
			}
		);

		this.vTitle.add(smInsert).add(sTitle);
	}

	function _createDescriptionView() {
		var sDescription = new Surface({
			content: 'Contents can be animated smoothly with famo.us framework',
			properties: {
				color: this.options.textColor,
				border: '1px solid white',
				pointerEvents: 'none'
			}
		});
		
		var smInsert = new StateModifier({
			transform: Transform.translate(0, 0, -100)
		});

		smInsert.setTransform(
			Transform.translate(0, 0, 0),
			{
				duration: this.options.duration,
				curve: 'easeInOut'
			}
		);

		this.vDescription.add(smInsert).add(sDescription);
	}

	function _createDiagramView() {
		var initialTime = Date.now();
		
		////////////////////////////////////////////////////////////
		// scheme-mono rotate
		var logo = new ImageSurface({
			size: [300, 100],
			content: 'img/scheme-mono.png',
			classes: ['double-sided']
		});

		var mCenterSpinY = new Modifier({
			origin: [0.5, 0.5],
			align: [0.5, 0.3],
			transform: function () {
				return Transform.rotateY(.002 * (Date.now() - initialTime));
			}
		});

		var smAppear = new StateModifier({
			opacity: 0,
			transform: Transform.translate(100, 0, 0)
		});

		setTimeout(function() {
			initialTime = Date.now();
			smAppear.setTransform(
				Transform.translate(0, 0, 0),
				SlideView.DEFAULT_OPTIONS.transition);
			smAppear.setOpacity(1, SlideView.DEFAULT_OPTIONS.transition);
		}, this.options.tick*4);

		this.vDiagram.add(smAppear).add(mCenterSpinY).add(logo);

		////////////////////////////////////////////////////////////
		// restroom
		var logo2 = new ImageSurface({
			size: [this.options.size[0]*0.1, true],
			content: 'http://illustcut.com/box/mark/iroiro1/mark01_20.png'
		});
		
		var smDamping = new StateModifier({
			origin: [0.5, 0],
			align: [0.5, 0.6],
			transform: Transform.translate(100, 0, 0)
		});

		Transitionable.registerMethod('spring', SpringTransition);
		
		smDamping.setTransform(
			Transform.rotateX(-0.5),
			{ duration: 200, curve: 'easeOut' }
		);
		
		smDamping.setTransform(
			Transform.identity,
			{ method: 'spring', period: 1100, dampingRatio: 0 }
		);
		
		setTimeout(function() {
			smDamping.setOpacity(1, SlideView.DEFAULT_OPTIONS.transition);
			smDamping.setTransform(Transform.translate(0, 0, 0), SlideView.DEFAULT_OPTIONS.transition);
		}, this.options.tick*6);
		
		this.vDiagram.add(smDamping).add(logo2);
	}
	
	module.exports = SlideView;
});

