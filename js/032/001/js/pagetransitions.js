var PageTransitions = (function() {

	var $main = $( '#pt-main' );
	var $pages = $main.children( 'div.pt-page' );
	var $pageForward = $( '.page-forward' );
	var $pageBackward = $( '.page-backward' );
	var pagesCount = $pages.length;
	var current = 0;
	var currentPage;
	var isAnimating = false;
	var endCurrPage = false;
	var endNextPage = false;
	var animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
	};
	// animation end event name
	var animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];
	// support css animations
	var support = Modernizr.cssanimations;
	
	function init() {

		$pages.each( function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		} );

		currentPage = $pages.eq( 0 ).addClass( 'pt-page-current' );

		$pageForward.each( function() {
			$(this).on( 'click', function() {
				console.log();
				return nextPage( 1, $(this).attr('value') );
			} );
		});
		$pageBackward.each( function() {
			$(this).on( 'click', function() {
				return nextPage( 2, $(this).attr('value') );
			} );
		});
		
	}

	function nextPage(options, targetPageId ) {
		var animation = options;

		if( isAnimating ) {
			return false;
		}

		isAnimating = true;
		
		var $currPage = currentPage;
		var $nextPage = $main.find('#' + targetPageId).addClass( 'pt-page-current' );
		var outClass = '', inClass = '';

		currentPage = $nextPage;

		switch( animation ) {
			case 1:
				outClass = 'pt-page-moveToLeft';
				inClass = 'pt-page-moveFromRight';
				break;
			case 2:
				outClass = 'pt-page-moveToRight';
				inClass = 'pt-page-moveFromLeft';
				break;
		}

		$currPage.addClass( outClass ).on( animEndEventName, function() {
			$currPage.off( animEndEventName );
			endCurrPage = true;
			if( endNextPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		$nextPage.addClass( inClass ).on( animEndEventName, function() {
			$nextPage.off( animEndEventName );
			endNextPage = true;
			if( endCurrPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		if( !support ) {
			onEndAnimation( $currPage, $nextPage );
		}

		return true;
	}

	function onEndAnimation( $outpage, $inpage ) {
		endCurrPage = false;
		endNextPage = false;
		resetPage( $outpage, $inpage );
		isAnimating = false;
	}

	function resetPage( $outpage, $inpage ) {
		$outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
		$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current' );
	}

	init();

	return { 
		init : init,
		nextPage : nextPage,
	};

})();