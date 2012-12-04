class Tank extends MonoBehaviour{
	var stageScript : String = "Stage";
	var bulletScript : String = "Bullet";
	var bulletTag :String = "bullet";
	var tankScript :String = "Tank";
	var ownerName : String = "";
	var life : float = 100;
	var serchEnemyRadius = 4;
	var serchBlockRadius = 20;
	var serial : int = -1;
			
	// move variables
	private var moveSpeed : float = 1.0;
	private var moveDistance: float = 0.0;
	private var movedDistance : float = 0.0;
	private var moveFlag : boolean = false;
	
	// rotate variables
	private var startRot : Quaternion;
	private var targetRot : Quaternion;
	private var rotateAngle : float;
	private var rotateSpeedPerSec : float = 90.0; // degree / sec
	private var rotateFlag : boolean = false;
	private var rotateTime : float;
	
	// bullet settings
	var bulletPrefab : GameObject;
	var shotObjectPath : String = "body/canon/shot";
	private var bulletChargedFlag : boolean = true;
	private var bulletChargeTime : float = 1.0;
	
	// search variables
	var enemies : Array = new Array();
	var searchRadarPath : String = "body/distanceRadar";
	
	private function Start () {
		RegisterSerial();
		this.InitializeTank();
	}

	private function Update () { 
		// move process
		if(moveFlag){
			transform.position += transform.forward * moveSpeed * Time.deltaTime;
			movedDistance += moveSpeed * Time.deltaTime;
			if(movedDistance >= moveDistance){
				MoveCancel();
			}
		}
		
		// rotate process
		if(rotateFlag){
			rotateTime += Time.deltaTime;
			var t = rotateSpeedPerSec/rotateAngle * rotateTime;
			if(t > 1) t = 1;
			transform.rotation = Quaternion.Slerp(startRot, targetRot, t);
			if(Quaternion.Angle(transform.rotation,targetRot) < 1){
				RotateCancel();
			}
		}
		
		SearchBlock();
		SearchEnemy();
		UpdateTank();
	}
	
	function OnCollisionEnter(collision : Collision) {
		if(collision.gameObject.tag == bulletTag){
			var damage = collision.gameObject.GetComponent(bulletScript).GetBulletDamage();
			life = life - damage;
			Destroy(collision.gameObject);
		}
	}
	
	// search and call 
	private function SearchBlock(){
		var radar = this.transform.Find(searchRadarPath );
		var hit : RaycastHit;
		if (Physics.Raycast (radar.position,  radar.TransformDirection (Vector3.forward), hit, serchBlockRadius)) {
			DiscoverdBlock(hit.distance);
		}
	}
	
	private function SearchEnemy(){
		enemies.Clear();
		var tanks = GameObject.FindGameObjectsWithTag("Player");
		for(var tank in tanks){
			if(tank.GetComponent(tankScript).GetOwnerName()  != ownerName){
				var dist = Vector3.Distance(transform.position, tank.transform.position);
				if( dist < serchEnemyRadius){
					var relative : Vector3  = transform.InverseTransformPoint(tank.transform.position);
    				var angle : float = Mathf.Atan2(relative.x, relative.z) * Mathf.Rad2Deg;
				
					var hash : Hashtable= new Hashtable();
					hash["angle"] = angle;
					hash["distance"] = dist;
					hash["serial"] = tank.GetComponent(tankScript).GetTankSerial();
					enemies.Add(hash);
				}
			} 
		} 
		if(enemies.length > 0){
			DiscoverdEnemy(enemies);
		}
	} 
	
	private function RegisterSerial(){
		var stage : GameObject = GameObject.FindWithTag("stage");
		if(stage == null){
			Debug.LogError("not find stage");
			return;
		}
		serial = stage.GetComponent(stageScript).getSerial();
	}
	
	function Rotation(angle:float){
		startRot = transform.rotation;
		targetRot = transform.rotation * Quaternion.AngleAxis(angle, transform.up); 
		rotateAngle = Quaternion.Angle(startRot, targetRot);
		rotateFlag = true;
		rotateTime = 0.0;
	}
	
	function RotateCancel(){
		rotateTime = 0.0;
		rotateFlag = false;
	}
	
	function GetRotateState():boolean{
		return rotateFlag;
	}
	
	function Move(distance:float){
		moveFlag = true;
		moveDistance = distance;
	}
	
	function MoveCancel(){
		movedDistance = 0.0;
		moveFlag = false;
	}
	
	function GetMoveFlag():boolean{
		return moveFlag;
	}
	
	function SetMoveSpeed(moveSpeed : float){
		
	}
	
	private function ChargeBullet(){
		yield WaitForSeconds(bulletChargeTime);
		bulletChargedFlag = true;
	}
	
	function Shot(){
		if(bulletChargedFlag){
			bulletChargedFlag = false;
			var shot = this.transform.Find(shotObjectPath);
			var obj = Instantiate(bulletPrefab,shot.position,shot.rotation);
			obj.gameObject.GetComponent(bulletScript).SetOwnerName(ownerName);
			ChargeBullet();
		}
	}
	
	function GetShotState(){
		return bulletChargedFlag;
	}
	
	function GetOwnerName():String{
		return ownerName;
	}
	
	function GetTankSerial():int{
		return serial;
	}
	
	function SetTankSerial(serial:int):void{
		this.serial = serial;
	}
	
	
	
	// implemets
	function InitializeTank():void{
	}
	
	function UpdateTank():void{
	}
	
	function DiscoverdEnemy(enemyInfo:Array):void{
	} 
	
	function DiscoverdBlock(distance : float):void{
	}
}