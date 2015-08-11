/**
 * Created by ?????? on ????/??/??.
 */

$(document).ready(function () {
    // const
    const APIKEY = 'c2faf848-199f-4217-a3a5-803528a68adf';
    const TURNSERVERHOST = '';
    const TURNUSERNAME = '';
    const TURNPASS = '';

    // var
    var userList = [];
    var myPeerid = '';
    var myStream = null;
    var peer = null;

    // compatibile getUserMedia
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
		|| navigator.mozGetUserMedia;

    // create Peer object
	peer = new Peer({key: APIKEY, debug: 3});

    // handle open event
	peer.on('open', function(id) {
		myPeerid = id;
		console.log({myPeerid: myPeerid});

		// get local video/audio data
		_getUserMedia(function(stream) {
			$('#myStream').prop('src', URL.createObjectURL(stream));
			$('#myStream').css('width', '100%');
			myStream = stream;

			// handle call event
			peer.on('call', function(call) {
				// reply stream when called from the peer
				call.answer(stream);

				// set event for call object
				_callEvents(call);
				
				// add call object for each communicator
				_addUserList(call);
			});

			_createConnections();
		});
	});

    // handle error
	peer.on('error', function(e) {
		console.log(e);
	});

	// getUserMedia
    function _getUserMedia(callback) {
		navigator.getUserMedia({
			audio: true,
			video: {
				mandatory: {
					maxWidth: 200,
					maxHeight: 200
				},
				optional: [
					{
						maxFrameRate: 5
					}
				]
			}
		}, function(stream) {
			callback(stream);
		}, function() {
			console.log('getUserMedia error');
		});
				
    }

    // connect to users in user list
    function _createConnections() {
		peer.listAllPeers(function(list) {
			for (var i = 0; i < list.length; i++) {
				if (myPeerid == list[i])
					continue;
				var _call = peer.call(list[i], myStream);
				_callEvents(_call);
				_addUserList(_call);
			}
		});
    }

    // set call event handler
    function _callEvents(call){
		call.on('stream', function(stream) {
			_addVideoDom(call, stream);
		});

		call.on('close', function() {
			_call.close();
			_removeUserList(call);
			_removeVideoDom(call);
		});
    }

    // insert into userlist
    function _addUserList(call) {
		userList.push(call);
    }

    // delete from userlist
    function _removeUserList(call) {
		var idx = userList.indexOf(call);
		if (idx > 0) {
			userList.splice(idx, 1);
		}
    }

    // add video element
    function _addVideoDom(call,stream) {
		var $video = $('<video>');
		$video.attr('id', call.peer);
		$video.prop('src', URL.createObjectURL(stream));
		$video.prop('autoplay', true);
		$video.addClass('video');

		$('.videosContainer').append($video);
		_resizeDom();
    }

    // remove video element
    function _removeVideoDom(call) {
		$('#' + call.peer).remove();
		_resizeDom();
    }

    // optimize size of video element
    function _resizeDom() {
		var baseW = 100;
		var baseH = 100;
		var width = 100;
		var height = 100;

		var nodes = $('.videosContainer').children();
		var width = baseW / nodes.length;
		var height = baseH / nodes.length;

		for (var i = 0; i < nodes.length; i++) {
			if (width >= 25) {
				$(nodes[i]).css('width', width + '%');
			} else {
				$(nodes[i]).css('width', '25%');
			}
		}
	}

});
