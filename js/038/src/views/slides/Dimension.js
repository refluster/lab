define(function(require, exports, module) {
	var Surface = require('famous/core/Surface');
	var Transform = require('famous/core/Transform');
	var Modifier = require('famous/core/Modifier');
	var StateModifier = require('famous/modifiers/StateModifier');
	var Easing = require('famous/transitions/Easing');
	var Transitionable = require('famous/transitions/Transitionable');
	var View = require('famous/core/View');
	var ImageSurface = require("famous/surfaces/ImageSurface");
	var Transitionable	 = require('famous/transitions/Transitionable');
	var SpringTransition = require('famous/transitions/SpringTransition');
	var FlexibleLayout = require('famous/views/FlexibleLayout');

	var mCenter = new Modifier({
		origin: [0.5,0.5],
		align: [0.5,0.5],
	});
	
	function Dimension() {
		View.apply(this, arguments);

		_createRootModifier.call(this);
		
		_createTitleView.call(this);
		_createDimension.call(this);
		_createBackground.call(this);
		_setTransfer.call(this);
		_setTransfer.call(this);
		_setTransfer.call(this);
		_setTransfer.call(this);
		_setTransfer.call(this);
		_setTransfer.call(this);
		_setTransfer.call(this);
		_setTransfer.call(this);
		_setTransfer.call(this);
		_setTransfer.call(this);
	}

	Dimension.DEFAULT_OPTIONS = {
		textColor: '#fff',
		size: [800, 600],
		duration: 300,
		tick: 300,
		border: '0px solid white',
		grid: 40,
		floorLength: 2000,
		numBox: 100,
	};

	Dimension.DEFAULT_OPTIONS.transition = {
		duration: Dimension.DEFAULT_OPTIONS.duration,
		//		curve: 'easeOut'
		curve: Easing.easeIn
	};
	Dimension.DEFAULT_OPTIONS.insTransition = {
		duration: 5000,
		curve: Easing.outQuad
	};
	Dimension.DEFAULT_OPTIONS.boxTransition = {
		duration: Dimension.DEFAULT_OPTIONS.duration * 3,
		//		curve: 'easeOut'
		curve: Easing.easeOut
	};

	Dimension.prototype = Object.create(View.prototype);
	Dimension.prototype.constructor = Dimension;

	function _createBackground() {
		var sBackground = new Surface({
			transform: Transform.translate(0, 0, -100),
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
			content: 'Simple 3D',
			properties: {
				fontSize: (this.options.size[0]*0.04) + 'px',
				color: this.options.textColor,
				border: this.options.border,
				pointerEvents: 'none',
				textAlign: 'center',
				zIndex: '1000',
			}
		});
		
		var smInsert = new StateModifier({
			opacity: 0,
			transform: Transform.translate(0, 0, -100)
		});

		setTimeout(function() {
			smInsert.setOpacity(1, Dimension.DEFAULT_OPTIONS.transition);
			smInsert.setTransform(Transform.translate(0, 0, 0), Dimension.DEFAULT_OPTIONS.transition);
		}, this.options.tick);

		this.rootModifier.add(smInsert).add(sTitle);
	}

	function _createDimension() {
		var mRotate = new Modifier({
			origin: [0.5, 0.5],
			align: [0.5, 0.5],
			size: [this.options.floorLength, this.options.floorLength],
			transform: function() {
				var date = Date.now();
				return Transform.thenMove(
					Transform.rotate(.0005 * date + 1.2,
									 .00022 * date,
									 0),
					[0, 0, 500]
				);
			}
		});

		var smInsert = new StateModifier({
			opacity: 0,
			transform: Transform.translate(0, 0, 400)
		});

		setTimeout(function() {
			smInsert.setOpacity(1, Dimension.DEFAULT_OPTIONS.insTransition);
			smInsert.setTransform(Transform.translate(0, 0, -800), Dimension.DEFAULT_OPTIONS.insTransition);
		}, this.options.tick);

		//this.rotateModifier = this.rootModifier.add(mRotate);
		this.rotateModifier = this.rootModifier.add(smInsert).add(mRotate);
		this.boxes = [];

		for (var i = 0; i < this.options.numBox; i++) {
			var rand = Math.random();
			var randGrid = Math.floor(rand * this.options.grid * this.options.grid);

			var gridX = randGrid % this.options.grid;
			var gridY = Math.floor(randGrid / this.options.grid);

			var sBox = new Surface({
				classes: ['double-sided'],
				properties: {
//					backgroundColor: '#fff',
//					pointerEvents: 'none',

					fontSize: (8) + 'px',
					textAlign: 'center',
					lineHeight: 8 + 'px',
					color: 'white',
					textAlign: 'center',
//					backgroundColor: '#f6b',
//					border: '1px solid #444',
					backgroundBlendMode: 'screen',
					boxShadow: '0 0 1px #0fd, 0 0 3px #fff, 0 0 5px #fff,' +
						'0 0 7px #fff, 0 0 9px #0fd'
				}
			});

			var mBox = new StateModifier({
				origin: [0, 0],
				size: [this.options.floorLength / this.options.grid,
					   this.options.floorLength / this.options.grid],
				transform: Transform.translate(
					gridX * this.options.floorLength / this.options.grid,
					gridY * this.options.floorLength / this.options.grid,
					0)
			});
			
			this.rotateModifier.add(mBox).add(sBox);

			this.boxes.push({
				surface: sBox,
				modifier: mBox,
				position: [gridX * this.options.floorLength / this.options.grid,
						   gridY * this.options.floorLength / this.options.grid],
			});
		}

	}

	function _setTransfer() {
		var rand = Math.random();
		var boxIndex = Math.floor(rand * this.options.numBox);
		var minTransferGrid = Math.floor(this.options.grid * .4);
		var moveGridDistance = Math.floor(rand * (this.options.grid - minTransferGrid)) + minTransferGrid;
		var direction = rand > 0.5 ? 0: 1;

		this.boxes[boxIndex].position[direction] += moveGridDistance *
			this.options.floorLength / this.options.grid;
		if (this.boxes[boxIndex].position[direction] >= this.options.floorLength) {
			this.boxes[boxIndex].position[direction] -= this.options.floorLength;
		}

		this.boxes[boxIndex].modifier.setTransform(
			Transform.translate(
				this.boxes[boxIndex].position[0],
				this.boxes[boxIndex].position[1],
				0),
			this.options.boxTransition,
			_setTransfer.bind(this)
		);
	}
	
	module.exports = Dimension;
});

