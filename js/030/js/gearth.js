var ge;
var pos = {x:40.730682, y:-73.997695};
var heading = 0;
var keyUp = false;
var keyDown = false;
var keyLeft = false;
var keyRight = false;

google.load("earth", "1", {"other_params":"sensor=true_or_false"});

function init() {
    google.earth.createInstance('map3d', initCB, failureCB);
}

function initCB(instance) {
    ge = instance;

    ////////////////////////////// placemark
    // Create the placemark.
    var placemark = ge.createPlacemark('');
    placemark.setName("placemark");
    
    // Set the placemark's location.  
    var point = ge.createPoint('');
    point.setLatitude(pos.x);
    point.setLongitude(pos.y);
    placemark.setGeometry(point);
    ge.getFeatures().appendChild(placemark);

    ////////////////////////////// lookat
    var lookAt = ge.createLookAt('');
    lookAt.setLatitude(pos.x);
    lookAt.setLongitude(pos.y);
    lookAt.setAltitude(30);
    lookAt.setRange(200.0);
    lookAt.setTilt(75.0);
    ge.getView().setAbstractView(lookAt);
    
    ////////////////////////////// layer
    ge.getOptions().setFlyToSpeed(3);

//    google.earth.addEventListener(ge, "frameend", update);

    document.onkeydown = onKeyDown;
    document.onkeyup = onKeyUp;

    ////////////////////////////// set building on
    ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true);

    ////////////////////////////// time
    ge.getTime().getControl().setVisibility(ge.VISIBILITY_SHOW);
//    ge.getTime().setRate(60*60);

    ////////////////////////////// enable navigation
    ge.getNavigationControl().setVisibility(ge.VISIBILITY_SHOW);
    
    ////////////////////////////// show
    ge.getWindow().setVisibility(true);
}

function failureCB(errorCode) {
}

function update() {
    ge.getOptions().setFlyToSpeed(5);

    var la = ge.getView().copyAsLookAt(ge.ALTITUDE_ABSOLUTE);
    updatePosition(la);
    la.set(pos.x, pos.y, 60, ge.ALTITUDE_ABSOLUTE,
           heading, //la.getHeading(),
           80, //tilt,
           0 //range);
          );
    ge.getView().setAbstractView(la);
}

function updatePosition(lookAt) {
    var incY = 0.000001;
    var incX = incY / Math.cos(pos.y);
    var rad = Math.PI * 2 * heading / 360;
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    var turnSpeed = 6;
    
    if (keyUp) {
        pos.y += incY * cos;
        pos.x += incX * sin;
    }
    if (keyDown) {
        pos.y -= incY * cos;
        pos.x -= incX * sin;
    }
    if (keyLeft) {
        heading -= turnSpeed;
    }
    if (keyRight) {
        heading += turnSpeed;
    }
}

function onKeyDown(e){
    switch (e.keyCode) {
    case 87: // up
        keyUp = true;
        break;
    case 83: // down
        keyDown = true;
        break;
    case 65: // left
        keyLeft = true;
        break;
    case 68: // right
        keyRight = true;
        break;
    }
}

function onKeyUp(e){
    switch (e.keyCode) {
    case 87: // up
        keyUp = false;
        break;
    case 83: // down
        keyDown = false;
        break;
    case 65: // left
        keyLeft = false;
        break;
    case 68: // right
        keyRight = false;
        break;
    }
}

google.setOnLoadCallback(init);
