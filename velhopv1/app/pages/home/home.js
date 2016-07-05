import {Page, Platform, ViewController, NavParams, NavController, Modal, Component} from 'ionic-angular';
import {NgZone} from '@angular/core';
import {BaseRequestOptions, Http, Headers, Jsonp} from '@angular/http';
import 'rxjs/add/operator/map';
import {bottomSheet} from './bottomsheet';

@Page({
  directives: [bottomSheet],
  templateUrl: 'build/pages/home/home.html'
})

export class HomePage {
  static get parameters() {
    return [[Http],[Platform],[NavController],[NgZone]];
  }

  constructor(http, platform, nav, zone, doml) {
	this.bottomSheetOpen = false;
    this.heightCanvas = window.innerHeight;
	this.nav = nav;
	this.zone=zone;
	window.zoneImpl = this.zone;
	this.platform = platform;
	this.http = http;
	this.posts=null;
	this.initializeMap();
	this.state=0;
	this.list=[];
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;

	  if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) || userAgent.match( /Android/i ) )
	  {
		this.urlStatus = 'http://carto.strasmap.eu/remote.amf.json/Bike.status';
		this.urlStation = 'http://carto.strasmap.eu/remote.amf.json/Bike.geometry';
	  }
	  else
	  {
		this.urlStatus = "/status/";
		this.urlStation = "/geometry/";
	  }
  }
 
 resizeCanvas(bottomSheetHeight){
	this.heightCanvas = window.innerHeight - bottomSheetHeight;
 }
 
 onPageScroll(){
	console.log("pagescroll");
 }
 
 toLvl1Event(results){
	//var myLatLng = new google.maps.LatLng({lat: -34, lng: 151}); 
	console.log("toLvl1Event");
	//this.map.panTo(myLatLng);
 }
 
    toggleBounce(){
		console.log("click");
		//console.log(event);
		//let modal = Modal.create(ModalsContentPage);
		//this.nav.present(modal);
	}
  
  downState(){
	if(this.state>0){
		this.state=this.state-1;
	
	}
	
  }
  
  update(){
	console.log("-------update----");
	this.ok="ooo";
  }
  
  initializeMap() {
    this.platform.ready().then(() => {
        var minZoomLevel = 11;
		//var maxZoomLevel = 4;
        this.map = new google.maps.Map(document.getElementById('map_canvas'), {
            zoom: minZoomLevel,
			minZoom: minZoomLevel,
            center: new google.maps.LatLng(48.585144, 7.754263),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
		google.maps.event.addListener(this.map, 'click',(event) => {
			this.zone.run(()=>{
				this.title="null";
				this.bottomSheetOpen=false;
				console.log("clickMap");
			});	
		});

		this.http.get(this.urlStation).map(res => res.json()).subscribe(
			data => {
				this.posts = data.s;
				console.log("URLSTATION");
				console.log(this.posts);
				console.log("---");
				//SECOND AJAX
				this.http.get(this.urlStatus).map(res => res.json()).subscribe(
					data => {
						this.posta = data.s;
						console.log("URLSTATUS");
						console.log(this.posta);
						console.log("---");
						for(var i=0;i<this.posta.length;i++){
							//if (typeof this.list[this.posta[i].id] !== 'undefined') {
								this.list[this.posta[i].id].status=this.posta[i];
							//}
						}
					},
					err => {
						console.log("Oops!");
					}
				);
				//SECOND AJAX END
				
				for(var i=0;i<this.posts.length;i++){
					this.list[this.posts[i].id]=this.posts[i];
					let marker = new google.maps.Marker({
						map: this.map,
						position: new google.maps.LatLng(this.posts[i].go.y, this.posts[i].go.x),
						title: [this.posts[i].ln].join("\n"),
						snippet: "This plugin is awesome!"
					});
					if(this.posts[i].ty=="station"){
						marker.set('icon', "img/cycle.png");
					}
					else{
						marker.set('icon', "img/shop.png");
					}
					marker.set('id', this.posts[i].id);
					google.maps.event.addListener(marker, 'click',(event) => {
						this.zone.run(()=>{
							this.title=this.list[marker.id].ln;
							console.log("title="+this.list[marker.id].ln);
							console.log(this.list[marker.id]);
							if(this.list[marker.id].ad!=""){
								this.vEmplacement = this.list[marker.id].ad;
							}else{
								this.vEmplacement ="";
							}
							this.vType = this.list[marker.id].ty;
							if(this.list[marker.id].status.sa!=""){
								this.vDispo = this.list[marker.id].status.sa;
								this.pDispo = this.list[marker.id].status.sf;
								this.cbAvailable = this.list[marker.id].status.sc;
							}
							else{
								this.vDispo = "";
								this.pDispo = "";
								this.cbAvailable = "";							
							}
							this.bottomSheetOpen=true;
							console.log("click");
						});	
					});
					this.list[this.posts[i].id].marker=marker;
					marker.setMap( this.map );
				}
			},
			err => {
				console.log("Oops!");
			}
		);
		
		
		
		let options = {timeout: 10000, enableHighAccuracy: true};
		  navigator.geolocation.getCurrentPosition(
		 
			  (position) => {
				  let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					let marker = new google.maps.Marker({
						position: latLng,
						title: "here",
						snippet: "This plugin is awesome!",
						icon: "img/rec.png",
						map: this.map
					});
					marker.setMap( this.map );
			  },
		 
			  (error) => {
				  console.log(error);
			  }, options
		 
		  );
		
    });
} 
}



