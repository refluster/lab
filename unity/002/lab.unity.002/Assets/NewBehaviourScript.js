#pragma strict

function Start () {
	
}

function Update () {
	if (Input.GetKey("right") == true) {
		//transform.Translate(0.1, 0.0, 0.0);
		transform.Rotate(1, 0.0, 0.0, Space.World);
	} else if (Input.GetKey("left") == true) {
		//transform.Translate(0.1, 0.0, 0.0);
		transform.Rotate(-1, 0.0, 0.0, Space.World);
	}

}
