#pragma strict

var tankScript :String = "Tank";
private var serialCnt : int;
private var finish :boolean;

function Start () {
	serialCnt = 0;
	finish = false;
	
	var tanks = GameObject.FindGameObjectsWithTag("Player");
	for( var tank in tanks){
	}
}

function Update () {
	if(finish){
	}
}

function getSerial():int{
	return serialCnt++;
}