
var conn = {}; // namespace

(function($){
    conn.socket = new io.connect("http://183.181.8.119:8028");
    
    conn.init = function() {
        socket.on("connect", function(){
            $("#transportName").text("connect via " + socket.socket.transport.name);
        });
        
        socket.on('user connected', function (data) {
            jQuery('#member_count').html(data);
        });
        
        socket.on('user disconnected', function (data) {
            jQuery('#member_count').html(data);
        });
    };

    
})(jQuery);
