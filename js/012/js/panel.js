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
        panelApl.camera = new THREE.PerspectiveCamera( 15 , panelApl.width / panelApl.height,
                                                       1 , 10000 );
        panelApl.camera.position.x = 0;
        panelApl.camera.position.y = 40;
        panelApl.camera.position.z = 80;
        panelApl.camera.lookAt( {x:0, y:1, z:0 } );
    };

    panelApl.initScene = function() {
        panelApl.scene = new THREE.Scene();
    };

    panelApl.initLight = function() {
        panelApl.light = new THREE.DirectionalLight(0xcccccc, 1.0, 0);
        panelApl.light.position.set( 0.577, 0.577, 0.577 );
        panelApl.ambient = new THREE.AmbientLight(0x333333);

        panelApl.scene.add(panelApl.light);
        panelApl.scene.add(panelApl.ambient);
    };
    
    panelApl.initObject = function(){
        panelApl.mesh = new THREE.Object3D();
        var loader = new THREE.JSONLoader();
        loader.load('./js/monkey.js', function(geometry) {
            panelApl.mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial);
            panelApl.mesh = new THREE.Mesh(geometry,
                                           new THREE.MeshLambertMaterial({color: 0x444444}));
            panelApl.mesh.scale = new THREE.Vector3(2, 2, 2);
            panelApl.scene.add(panelApl.mesh);
        });
    };

    panelApl.baseTime = +new Date;
    panelApl.render = function() {
        requestAnimationFrame(panelApl.render);
        panelApl.mesh.rotation.y = 0.3 * (+new Date - panelApl.baseTime) / 1000;
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
