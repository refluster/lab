(function($) {
    /* body onload process */
    $(window).load(function() {
        window.addEventListener('devicemotion', function(evt) {
            var ac = evt.acceleration;
            var temp = "ac_x:" + ac.x +"<br>";
            temp += "ac_y:" + ac.y +"<br>";
            temp += "ac_z:" + ac.z +"<br>";
            temp += "<br>";

            var acg = evt.accelerationIncludingGravity;
            temp += "acg_x:" + acg.x +"<br>";
            temp += "acg_y:" + acg.y +"<br>";
            temp += "acg_z:" + acg.z +"<br>";
            temp += "<br>";

            var rr = evt.rotationRate;
            temp += "rr_a:" + rr.alpha +"<br>";
            temp += "rr_b:" + rr.beta +"<br>";
            temp += "rr_g:" + rr.gamma +"<br>";

            document.getElementById("msg").innerHTML = temp;
        });
    });
})(jQuery);
