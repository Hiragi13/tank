#pragma strict

private var ownerName:String;
var bulletDamage:float = 10.0;
var bulletSpeed : float = 5.0;
var bulletLimitTime : float = 1.0;

function Start () {
	transform.rigidbody.velocity = transform.forward * bulletSpeed;
	Destroy(this.gameObject,bulletLimitTime);
}

function Update () {
	//transform.position += transform.forward * Time.deltaTime  * bulletSpeed;
}

function SetOwnerName(name:String){
	ownerName = name;
}

function GetOwnerName():String{
	return ownerName;
}

function GetBulletDamage():float{
	return this.bulletDamage;
}