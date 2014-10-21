(function($) {
    /* body onload process */
    $(window).load(function() {
        window.addEventListener('devicemotion', function(evt) {
            //加速度
            var ac = evt.acceleration;
            var temp = "ac_x:" + ac.x +"<br>"; //x方向の加速度
            temp += "ac_y:" + ac.y +"<br>";    //y方向の加速度
            temp += "ac_z:" + ac.z +"<br>";    //z方向の加速度
            temp += "<br>";
            
            //傾き
            var acg = evt.accelerationIncludingGravity;

            temp += "acg_x:" + acg.x +"<br>"; //x方向の加速度(重力込み)
            temp += "acg_y:" + acg.y +"<br>"; //y方向の加速度(重力込み)
            temp += "acg_z:" + acg.z +"<br>"; //z方向の加速度(重力込み)
            temp += "<br>";
            
            //回転加速度
            var rr = evt.rotationRate;
            temp += "rr_a:" + rr.alpha +"<br>"; //z軸の回転加速度
            temp += "rr_b:" + rr.beta +"<br>";  //x軸の回転加速度
            temp += "rr_g:" + rr.gamma +"<br>"; //y軸の回転加速度
            
            document.getElementById("msg").innerHTML = temp;
        });
    });
})(jQuery);
