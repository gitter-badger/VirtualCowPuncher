// Copywrite VCP 2017
// Scene.js
// - Contains all drawing a objects in a scene.

define(function (require)  {
    
   var Canvas2D = require('Canvas2D');
	var GCoord = require('GCoord');
	var Vector2 = require('Vector2');
	var MathExt = require('MathExt');

   function Scene (canvasElement /* DOMElement */, outputElement /* opt, DOMElement */) {
	   
		this.scale = 1.0;		// XY Units per foot.

		this.canvas = new Canvas2D(canvasElement);
		this.canvas.setProjection(0, 0, 1 /*ppunit */, true /* invertY */);
		
		this.output = outputElement;

		this.maxX = -9999, this.maxY = -9999, this.minX = 9999, this.minY = 9999;	// bounds for the canvas space.
		this.playerPosition = new Vector2();

		var self = this;
		this.gpsTimer = setInterval(function () { self.onGPSTimer(); }, 500);
   }

	/* --- GPS Functionality ----------  */
	var gCoordUtil = new GCoord();		// so it has something allocated already.

	
	Scene.prototype.gCoordToXY = function (gCoord /* GCoord */, result /* opt, out */) {
		return gCoord.toXYPoint(10000 /* mapHeight */);		// Do not change the map height from 10000.  It is the scale we will use for all.
	}

	Scene.prototype.gCoordToXY2 = function (lat, long, result /* opt, out */) {
		gCoordUtil.set(lat, long);
		return gCoordUtil.toXYPoint(10000 /* mapHeight */, result);   // Do not change the map height from 10000.  It is the scale we will use for all.
	}

	Scene.prototype.feetToXY = function (feet) {
		return feet * this.scale;
	}

	Scene.prototype.XYToFeet = function (xy) {
		return feet / this.scale;
	}

	// Finds the feet To XY conversion at this latitude.
	Scene.prototype.findScale = function (latitude) {
		var g1 = new GCoord(latitude - 0.01, 0);
		var g2 = new GCoord(latitude + 0.01, 0);
		var distance = MathExt.degToFeet(0.02);
		var p1 = this.gCoordToXY(g1);
		var p2 = this.gCoordToXY(g2);
		this.scale = p1.distance(p2) / distance;
	}


	Scene.prototype.onHavePosition = function (position) {
		var lat = position.coords.latitude;
		var long = position.coords.longitude;
		if (this.output)
			this.output.innerHTML = "Lat: " + lat + ", Long: " + long + ", Alt: " + position.coords.altitude + ", Acc: " + position.coords.accuracy + "<br>";

		this.gCoordToXY2(lat, long, this.playerPosition);

		var needsUpdate = false;
		if (this.maxX < this.playerPosition.x) { this.maxX = this.playerPosition.x;  needsUpdate = true; }
		if (this.maxY < this.playerPosition.y) { this.maxY = this.playerPosition.y;  needsUpdate = true; }
		if (this.minX > this.playerPosition.x) { this.minX = this.playerPosition.x;  needsUpdate = true; }
		if (this.minY > this.playerPosition.x) { this.minY = this.playerPosition.y;  needsUpdate = true; }
	
		if (needsUpdate) {
			var ppu = this.canvas.height / Math.max(this.feetToXY(30), Math.max(this.maxX - this.minX, this.maxY - this.minY));	// pixels per unit
			ppu *= 0.9;  // Provide some margin in the view.
			this.canvas.setProjection((this.minX + this.maxX)  / 2, (this.minY + this.maxY) / 2, ppu, true);
		}
		
		this.redraw();
	}

	Scene.prototype.onPositionError = function (error) {
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

	Scene.prototype.onGPSTimer = function () {
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

	Scene.prototype.redraw = function () {
		this.canvas.clear('rgb(230, 230, 230)');
		this.canvas.drawCircle(this.playerPosition.x, this.playerPosition.y, this.canvas.pixelsToUnits(10) /* radius */, 'rgb(0, 0, 255)', 'rgb(0, 0, 0)');
	}

	return Scene;
});