// Copyright VCP 2017
// GameController.js
// - Contains all drawing a objects in a GameController.

define(function (require)  {
    
   var Canvas2D = require('canvas2d');
	var GCoord = require('common/gcoord');
	var Vector2 = require('common/vector2');
	var MathExt = require('common/math-ext');
	var GameState = require('common/game-state');
	var GameDisplay = require('game-display');

   function GameController (canvasElement /* DOMElement */, outputElement /* opt, DOMElement */) {
	   
		this.output = outputElement;

		this.gameState = new GameState();
		this.gameDisplay = new GameDisplay(canvasElement);
		
		this.currentLocation = new Vector2();		// In XY Coordinates.
		this.scale = 1.0;		// XY Units per foot.
	
		var self = this;
		this.gpsTimer = setInterval(function () { self.onGPSTimer(); }, 500);
   }

	/* --- GPS Functionality ----------  */
	var gCoordUtil = new GCoord();		// so it has something allocated already.

	
	GameController.prototype.gCoordToXY = function (gCoord /* GCoord */, result /* opt, out */) {
		return gCoord.toXYPoint(10000 /* mapHeight */);		// Do not change the map height from 10000.  It is the scale we will use for all.
	}

	GameController.prototype.gCoordToXY2 = function (lat, long, result /* opt, out */) {
		gCoordUtil.set(lat, long);
		return gCoordUtil.toXYPoint(10000 /* mapHeight */, result);   // Do not change the map height from 10000.  It is the scale we will use for all.
	}

	GameController.prototype.feetToXY = function (feet) {
		return feet * this.scale;
	}

	GameController.prototype.XYToFeet = function (xy) {
		return feet / this.scale;
	}

	// Finds the feet To XY conversion at this latitude.
	GameController.prototype.findScale = function (latitude) {
		var g1 = new GCoord(latitude - 0.01, 0);
		var g2 = new GCoord(latitude + 0.01, 0);
		var distance = MathExt.degToFeet(0.02);
		var p1 = this.gCoordToXY(g1);
		var p2 = this.gCoordToXY(g2);
		this.scale = p1.distance(p2) / distance;
	}


	GameController.prototype.onHavePosition = function (position) {
		var lat = position.coords.latitude;
		var long = position.coords.longitude;
		if (this.output)
			this.output.innerHTML = "Lat: " + lat + ", Long: " + long + ", Alt: " + position.coords.altitude + ", Acc: " + position.coords.accuracy + "<br>";

		var position = this.gCoordToXY2(lat, long);
		this.gameState.setPlayerPosition(position);
		
		//if (needsUpdate) {
			//var ppu = this.canvas.height / Math.max(this.feetToXY(30), Math.max(this.maxX - this.minX, this.maxY - this.minY));	// pixels per unit
			//	ppu *= 0.9;  // Provide some margin in the view.
		//	this.canvas.setProjection((this.minX + this.maxX)  / 2, (this.minY + this.maxY) / 2, ppu, true);
		//}
		this.gameDisplay.draw(this.gameState);
		
	}

	GameController.prototype.onPositionError = function (error) {
		var msg = null;
		switch(error.code) {
			case error.PERMISSION_DENIED:
				msg = "User denied the request for Geolocation."
				break;
			case error.POSITION_UNAVAILABLE:
				msg = "Location information is unavailable. " + error.message;
				break;
			case error.TIMEOUT:
				msg = "The request to get user location timed out."
				break;
			case error.UNKNOWN_ERROR:
				msg = "An unknown error occurred."
				break;
		}
		if (this.output)
			this.output.innerHTML = msg;
		console.log("Geolocation Error: " + msg);
	}

	GameController.prototype.onGPSTimer = function () {
		var self = this;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) { self.onHavePosition(position); },
																  function (error)    { self.onPositionError(error); },
																  { enableHighAccuracy: true });
		} 
		else {
			if (this.output) {
				console.log('Geolocation is not supported by this browser');
				this.output.innerHTML = 'Geolocation is not supported by this browser';
			}
			clearInterval(this.gpsTimer);
		}
	}

	GameController.prototype.drawState = function () {
		
	};

	return GameController;
});