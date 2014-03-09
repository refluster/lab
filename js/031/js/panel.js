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
        panelApl.renderer.setClearColorHex(0x000000, 1.0);
        panelApl.renderer.shadowMapEnabled = true;
        document.getElementById('canvas-frame').
            appendChild(panelApl.renderer.domElement);
    };
    
    panelApl.initCamera = function() {
        panelApl.camera = new THREE.PerspectiveCamera(
            45, panelApl.width/panelApl.height, 1, 10000);
        panelApl.camera.position.x = -80;
        panelApl.camera.position.y = 100;
        panelApl.camera.position.z = 200;
        panelApl.camera.up.x = 0;
        panelApl.camera.up.y = 0;
        panelApl.camera.up.z = 0;
        panelApl.camera.lookAt( {x:0, y:30, z:0 } );
    };

    panelApl.initScene = function() {
        panelApl.scene = new THREE.Scene();
    };

    panelApl.initLight = function() {
        panelApl.light1 = new THREE.SpotLight(0xd0a080, 1.0, 0);
        panelApl.light1.position.set( -10, 100, 200 );
        panelApl.light1.intensity = 0;
        panelApl.light1.castShadow = true;
        panelApl.scene.add(panelApl.light1);

        panelApl.light2 = new THREE.SpotLight(0xd0a080, 1.0, 0);
        panelApl.light2.position.set( -200, 100, 200 );
        panelApl.light2.intensity = 0;
        panelApl.light2.castShadow = true;
        panelApl.scene.add(panelApl.light2);

        panelApl.light3 = new THREE.SpotLight(0xd0a080, 1.0, 0);
        panelApl.light3.position.set( 0, 500, 0 );
        panelApl.light3.intensity = 0;
        panelApl.light3.castShadow = true;
        panelApl.scene.add(panelApl.light3);
    };
    
    panelApl.initObject = function(){
        // cube (rotate)
        panelApl.cube = new THREE.Mesh(
            new THREE.CubeGeometry(50,50,50), //形状の設定
            new THREE.MeshLambertMaterial({color: 0xffaa30}) //材質の設定
        );
        panelApl.cube.castShadow = true;
        panelApl.cube.position.set(0,30,-40);
        panelApl.scene.add(panelApl.cube);

        // sphere
        var sphere = new THREE.SphereGeometry(20);
        var material = new THREE.MeshLambertMaterial( { color: 0x8080f0 } )
        var mesh = new THREE.Mesh( sphere, material );
        mesh.position.set( 30, 30, 40 );
        mesh.castShadow = true;
        panelApl.scene.add( mesh );

        // plane, material for meshes
        var plane = new THREE.PlaneGeometry(500, 500, 10, 10);
        var material = new THREE.MeshLambertMaterial( { color: 0xffffff } )

        // mesh1 (floor)
        var mesh = new THREE.Mesh( plane, material );
        mesh.rotation.x = -0.25*2*Math.PI;
        mesh.position.set( 0, -20, 0 );
        mesh.receiveShadow = true;
        panelApl.scene.add( mesh );

        // mesh2
        var mesh = new THREE.Mesh( plane, material );
        mesh.position.set( 0, 0, -300 );
        mesh.receiveShadow = true;
        panelApl.scene.add( mesh );

        // mesh3
        var mesh = new THREE.Mesh( plane, material );
        mesh.rotation.y = -0.25*2*Math.PI;
        mesh.position.set( 200, 0, 0 );
        mesh.receiveShadow = true;
        panelApl.scene.add( mesh );

    };

    panelApl.fluctuation = function() {
        // fluctuation
        var rand = Math.random();
        var percent;
        if(rand < 0.5) {
            percent =  rand + 2*rand*rand;   
        } else {
            percent = rand - 2*(1 - rand)*(1 - rand);
        }
        return percent;
    };

    panelApl.baseTime = +new Date;
    panelApl.render = function() {
        requestAnimationFrame(panelApl.render);
        panelApl.cube.rotation.z = 0.5*(+new Date - panelApl.baseTime)/1000;

        // fluctuation light
        panelApl.light1.intensity = panelApl.fluctuation()*0.1 + 0.3;
        panelApl.light2.intensity = panelApl.fluctuation()*0.2 + 0.5;
        panelApl.light2.intensity = panelApl.fluctuation()*0.7 + 1.3;

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
