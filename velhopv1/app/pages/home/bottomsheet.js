import {Component, EventEmitter, OnChanges, SimpleChange} from '@angular/core';
import {TimerWrapper} from '@angular/core/src/facade/async';

@Component({
  selector: 'bottom-sheet',
  inputs : ['title','useState','vDispo','pDispo','cbAvailable','emplacement','type'],
  outputs : ['setLvl1','canvasResize'],
  templateUrl : 'build/pages/home/bottomsheet.html'
})
export class bottomSheet {

  constructor() {
	this.setLvl1 = new EventEmitter();
	this.canvasResize = new EventEmitter();
	this.photoHeight=230;
	this.screenHeight= window.innerHeight;
	this.lvl0height = 90;
	this.lvl1height = window.innerHeight - this.photoHeight +10; //450
	this.height=0;
	this.topPhoto = this.screenHeight;
	this.valueGoToBot=160;
	this.move=false;
	this.movePhoto=false;
	this.counter=0;
	this.titleDivClass="lvl0class";
	this.classheight="lvltest";
	this.photoclass="photo";
	this.btnVisibility="hidden";
  }
  
  tapEvent(event){
	this.classheight="lvlfreeheight";
	this.photoclass="photofree";
	//console.log(event);
	if(window.innerHeight - event.changedPointers[0].clientY < this.lvl1height && this.move==false && this.height>0){
		if(window.innerHeight - event.changedPointers[0].clientY >=this.lvl0height){
			if(this.height>this.lvl0height+1){
				this.titleDivClass="lvl1class";
			}
			/*if(this.height<=this.lvl0height+5){
				this.titleDivClass="lvl0class";
			}*/
			this.height = ( window.innerHeight - event.changedPointers[0].clientY ) ;
			this.setPhoto();
		}
		else{
			this.height = this.lvl0height;
			this.titleDivClass="lvl0class";
		}
	}
	if(event.changedPointers[0].clientY < window.innerHeight-this.height){
		this.classheight="lvltest";
		this.photoclass="photo";
		this.setEtape1();
	}
	
	if(event.isFinal==true){
		if(this.height<this.valueGoToBot){
			//this.height = this.lvl0height;
			this.photoclass="photo";
			this.classheight="lvltest";
			this.setEtape0();
		}
		else{
			this.photoclass="photo";
			this.classheight="lvltest";
			this.setEtape1();
		}
			console.log("---- swipe up end -----");
	}
 }
 
 close(){
	this.height = "0";
	this.topPhoto= this.screenHeight;
	this.titleDivClass="lvl0class";
	this.btnVisibility="hidden";
	this.canvasResize.next({ bottomSheetHeight: this.height });
 }
 
 setEtape0(){
	this.height = "90";
	this.topPhoto= this.screenHeight;
	this.titleDivClass="lvl0class";
	this.btnVisibility="visible";
	this.canvasResize.next({ bottomSheetHeight: this.height });
 }
 
 setEtape1(){
	this.height=this.lvl1height;
	this.topPhoto= 0;
	this.btnVisibility="visible";
	this.titleDivClass="lvl1class";
 }
 
 setPhoto(){
	var topValuePhoto = this.screenHeight - Math.round(((this.height-this.lvl0height)/(this.lvl1height-this.lvl0height))* this.screenHeight );
	//console.log(topValuePhoto+ "%");
	this.topPhoto= topValuePhoto;
 }
 
  ngOnChanges(value) {
	//console.log(value);
	if("useState" in value){
		if(value.useState.currentValue=="true"){
			this.setEtape0();
		}
		if(value.useState.currentValue=="false"){
			this.close();
		}
	}
  }
 

}