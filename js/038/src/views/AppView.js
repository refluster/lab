define(function(require, exports, module) {
	var Transform = require('famous/core/Transform');
	var Easing = require('famous/transitions/Easing');
    var Lightbox = require('famous/views/Lightbox');
    var View = require('famous/core/View');

    var SlideView = require('views/SlideView');

    function AppView() {
        View.apply(this, arguments);

        _createLightbox.call(this);
        this.showSlide();
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
		numSlide: 4,
        lightboxOpts: {
            //inOpacity: 0,
            outOpacity: 0,
            //inOrigin: [0, 0],
            //outOrigin: [0, 0],
            //showOrigin: [0, 0],
            //inTransform: Transform.thenMove(Transform.rotateX(0.9), [0, 300, 0]),
            //outTransform: Transform.thenMove(Transform.rotateZ(0.7), [0, window.innerHeight, 100]),
			//inTransform: Transform.thenMove(Transform.rotateX(0), [0, 0, -100]),
			inTransform: Transform.thenMove(Transform.rotateX(0), [0, 0, 0]),
			outTransform: Transform.thenMove(Transform.rotateZ(0), [0, 0, 100]),
            inTransition: { duration: 650, curve: 'easeOut' },
            outTransition: { duration: 300, curve: Easing.inCubic },
			overlap: false
        }
    };

    function _createLightbox() {
        this.lightbox = new Lightbox(this.options.lightboxOpts);
		//this.mainNode.add(this.lightbox);
		this.add(this.lightbox);
    }

	AppView.prototype.showSlide = function() {
        var slide = new SlideView({
			size: [window.innerWidth * 0.8, window.innerHeight * 0.8]
		});

		slide.on('click', this.showSlide.bind(this));

        this.ready = false;
        this.lightbox.show(slide, function() {
            this.ready = true;
        }.bind(this));
    };

    module.exports = AppView;
});

