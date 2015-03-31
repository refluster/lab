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
		tick: 200,
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
		// your app here
		var logo = new ImageSurface({
			size: [300, 100],
			content: 'img/scheme-mono.png',
			classes: ['double-sided']
		});

		var initialTime = Date.now();
		var centerSpinModifier = new Modifier({
			origin: [0.5, 0.5],
			align: [0.5, 0.5],
			transform : function () {
				return Transform.rotateY(.002 * (Date.now() - initialTime));
			}
		});

		this.vDiagram.add(centerSpinModifier).add(logo);
		
		var sContent = new Surface({
			content: 'Right view',
			size: [undefined, 100],
			properties: {
				color: this.options.textColor,
				border: '1px solid white',
				pointerEvents: 'none'
			}
		});

		var smInsert = new StateModifier({
			opacity: 0,
			origin: [0.5, 0.5],
			align: [0.5, 0.5],
			transform: Transform.translate(50, 0, -100)
		});

		setInterval(function() {
			smInsert.setOpacity(1, SlideView.DEFAULT_OPTIONS.transition);
			smInsert.setTransform(
				Transform.translate(0, 0, 0),
				SlideView.DEFAULT_OPTIONS.transition);},
			this.options.tick);

		this.vDiagram.add(smInsert).add(sContent);
	}
	
	module.exports = SlideView;
});

