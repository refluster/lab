#pragma strict

function Start () {
	
}

function Update () {
	var r = Input.GetKey("right");
	Debug.Log(r);
	if (r == true) {
		//transform.Translate(0.1, 0.0, 0.0);
		transform.Rotate(Vector3.up);
	}

}
