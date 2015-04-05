define(function(require, exports, module) {
	var Transform = require('famous/core/Transform');
	var Easing = require('famous/transitions/Easing');
	var Lightbox = require('famous/views/Lightbox');
	var View = require('famous/core/View');

	var AnimationSlide = require('views/slides/Animation');
	var ButtonSlide = require('views/slides/Button');

	function AppView() {
		View.apply(this, arguments);
		
		_createLightbox.call(this);
		this.showSlide();
	}

	AppView.prototype = Object.create(View.prototype);
	AppView.prototype.constructor = AppView;

	AppView.DEFAULT_OPTIONS = {
		aspect: 2.5, // width / height
		numSlide: 4,
		lightboxOpts: {
			inOpacity: 1,
			outOpacity: 0,
			//inOrigin: [0, 0],
			//outOrigin: [0, 0],
			//showOrigin: [0, 0],
			//inTransform: Transform.thenMove(Transform.rotateX(0.9), [0, 300, 0]),
			//outTransform: Transform.thenMove(Transform.rotateZ(0.7), [0, window.innerHeight, 100]),
			//inTransform: Transform.thenMove(Transform.rotateX(0), [0, 0, -100]),
			//inTransform: Transform.thenMove(Transform.rotateX(0), [0, 0, 0]),
			inTransform: Transform.identity,
			outTransform: Transform.thenMove(Transform.rotateZ(0), [0, 0, 100]),
			//inTransition: { duration: 650, curve: 'easeOut' },
			outTransition: { duration: 600, curve: Easing.outCubic },
			overlap: false
		}
	};

	function _createLightbox() {
		this.lightbox = new Lightbox(this.options.lightboxOpts);
		//this.mainNode.add(this.lightbox);
		this.add(this.lightbox);
	}

	AppView.prototype.showSlide = function() {
		var slideWidth;
		if (window.innerHeight * this.options.aspect > window.innerWidth) {
			slideWidth = window.innerWidth * 0.8;
		} else {
			slideWidth = window.innerHeight * this.options.aspect * 0.8;
		}
		
		/*
		  var slide = new AnimationSlide({
		  size: [slideWidth, slideWidth / this.options.aspect]
		  });
		*/
		var slide = new ButtonSlide({
			size: [slideWidth, slideWidth / this.options.aspect]
		});

		slide.on('click', this.showSlide.bind(this));

		window.history.pushState(null, null, "#/test");

		this.ready = false;
		this.lightbox.show(slide, function() {
			this.ready = true;
		}.bind(this));
	};

	module.exports = AppView;
});

