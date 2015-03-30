define(function(require, exports, module) {
	var Engine = require('famous/core/Engine');
	var Surface = require('famous/core/Surface');
	var Transform = require('famous/core/Transform');
	var Modifier = require('famous/core/Modifier');
	var StateModifier = require('famous/modifiers/StateModifier');
	var Easing = require('famous/transitions/Easing');
	var Transitionable = require('famous/transitions/Transitionable');
    var Lightbox = require('famous/views/Lightbox');
    var View = require('famous/core/View');
	var GridLayout = require("famous/views/GridLayout");
    var HeaderFooterLayout = require("famous/views/HeaderFooterLayout");
	var ImageSurface = require("famous/surfaces/ImageSurface");


	var mCenter = new Modifier({
		origin: [0.5,0.5],
		align: [0.5,0.5],
	});
	
    function SlideView() {
        View.apply(this, arguments);

		this.vTitle = new View();
		this.vDescription = new View();
		this.vDiagram = new View();

		_layout.call(this);
		_createTitleView.call(this);
		_createDescriptionView.call(this);
		_createDiagramView.call(this);
		_createBackground.call(this);
    }

    SlideView.DEFAULT_OPTIONS = {
		textColor: '#fff',
		size: [800, 600]
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

		this.vTitle.add(sTitle);
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
		
		this.vDescription.add(sDescription);
	}

	function _createDiagramView() {
		// your app here
		var logo = new ImageSurface({
			size: [300, 100],
			//content: 'http://code.famo.us/assets/famous_logo.png',
			content: 'img/scheme-mono.jpg',
			classes: ['double-sided']
		});

		var initialTime = Date.now();
		var centerSpinModifier = new Modifier({
			origin: [0.5, 0.5],
			align: [0.5, 0.5],
			transform : function () {
				//return Transform.rotateZ(.002 * (Date.now() - initialTime));
			}
		});

		this.vDiagram.add(centerSpinModifier).add(logo);
		
		var smInsert = new StateModifier({
			transform: Transform.translate(50, 100, 0)
		});

		var sContent = new Surface({
			content: 'Right view',
			size: [undefined, 100],
			properties: {
				color: this.options.textColor,
				border: '1px solid white',
				pointerEvents: 'none'
			}
		});

		smInsert.setTransform(
			Transform.translate(0, 100, 0),
			{
				duration: 800,
				curve: 'easeInOut'
			}
		);

		this.vDiagram.add(smInsert).add(sContent);
	}
	
	SlideView.prototype.fadeIn = function() {
/*
		var sContent = new Surface({
			content: 'Right view',
			size: [undefined, 100],
			properties: {
				color: this.options.textColor,
				border: '1px solid white',
				pointerEvents: 'none'
			}
		});

		this.add(sContent);
*/
	}

	module.exports = SlideView;
});

