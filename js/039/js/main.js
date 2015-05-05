$(function(){
	var state = {
		offset_x: 0,
		last_margin_x: 0,
	};

	$('#sun').mousedown(function(e) {
		state.offset_x = e.pageX - state.last_margin_x;
		console.log('b ' , state);

		$('#sun').mousemove(function(e) {
			state.last_margin_x = e.pageX - state.offset_x;
			console.log('- ', state);
			$('#sun').css({'marginLeft': state.last_margin_x + 'px'});
		});

		$('#sun').mouseup(function(e) {
			console.log('e ', state);
			
			$('#sun').unbind('mousemove');
			$('#sun').unbind('mouseup');
		});
	});

	$('img').on('dragstart', function(event) {
		event.preventDefault();
	});
});
