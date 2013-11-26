var panelApl = {};

(function($) {
    panelApl.width;
    panelApl.height;
    panelApl.renderer;
    panelApl.camera;
    panelApl.scene;
    panelApl.light;
    panelApl.cube;

    panelApl.initThree = function() {
        panelApl.width = document.getElementById('canvas-frame').clientWidth;
        panelApl.height = document.getElementById('canvas-frame').clientHeight;
        panelApl.renderer = new THREE.WebGLRenderer({antialias: true});
        panelApl.renderer.setSize(panelApl.width, panelApl.height );
        document.getElementById('canvas-frame').appendChild(panelApl.renderer.domElement);
        panelApl.renderer.setClearColorHex(0x000000, 1.0);
    };

    panelApl.initCamera = function() {
        panelApl.camera = new THREE.PerspectiveCamera( 45 , panelApl.width / panelApl.height,
                                                       1 , 10000 );
        panelApl.camera.position.x = 100;
        panelApl.camera.position.y = 20;
        panelApl.camera.position.z = 50;
        panelApl.camera.up.x = 0;
        panelApl.camera.up.y = 0;
        panelApl.camera.up.z = 1;
        panelApl.camera.lookAt( {x:0, y:0, z:0 } );
    };

    panelApl.initScene = function() {
        panelApl.scene = new THREE.Scene();
    };

    panelApl.initLight = function() {
        panelApl.light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
        panelApl.light.position.set( 100, 100, 200 );
        panelApl.scene.add(panelApl.light);
    };
    
    panelApl.initObject = function(){
        panelApl.cube = new THREE.Mesh(
            new THREE.CubeGeometry(50,50,50), //形状の設定
            new THREE.MeshLambertMaterial({color: 0xff0000}) //材質の設定
        );
        panelApl.scene.add(panelApl.cube);
        panelApl.cube.position.set(0,0,0);
    };

    panelApl.baseTime = +new Date;
    panelApl.render = function() {
        requestAnimationFrame(panelApl.render);
        //    cube.position.x = 30*(+new Date - baseTime)/1000;
        panelApl.cube.rotation.z = 0.5*(+new Date - panelApl.baseTime)/1000;
        panelApl.renderer.render(panelApl.scene, panelApl.camera);
    };

    panelApl.threeStart = function() {
        panelApl.initThree();
        panelApl.initCamera();
        panelApl.initScene();
        panelApl.initLight();
        panelApl.initObject();
        panelApl.renderer.clear();
        panelApl.render();
    }
    
    $(window).load(function() {
        panelApl.threeStart();
    });

})(jQuery);
