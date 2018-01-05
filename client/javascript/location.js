// Copyright VCP 2017
// location.js
// - Functionality for recieving location information from the system.  May be GPS or something less accurate.

define(function (require)  {
	var GCoord = require("common/gcoord");
	var Vector2 = require("common/vector2");
	var MathExt = require("common/math-ext");
	
	var Location = {	
		// Size of the mercator projected map if it were the world.  So our world size is a small porition of that.
		// A map height of 15,000,000 results in approximately 1xy = 1 meter at 42 degrees north.
		_mapHeight: 15000000,
		_pollTimerId: null,

		// position: The last recieved position from the geolocation service.
		// { coords: { latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed }, timestamp }}
		position: null,		
				
		getLatitude: function () {
			return this.position ? this.position.coords.latitude : null;
		},

		getLongitude: function () {
			return this.position ? this.position.coords.longitude : null;
		},

		// Returns the altitude, in meters.
		getAltitude: function () {
			return this.position ? this.position.coords.altitude : null;
		},

		// Returns the accuracy, in meters.
		getAccuracy: function () {
			return this.position ? this.position.coords.accuracy : null;
		},

		// Returns the altitude accuracy, in meters.
		getAltitudeAccuracy: function () {
			return this.position ? this.position.coords.altitudeAccuracy : null;
		},

		// Returns the current heading, in degrees.  N = 0, E = 90.... 
		// If speed is 0, this returns NaN.
		getHeading: function () {
			return this.position ? this.position.coords.heading : null;
		},

		// Returns the current speed, in m/s.  May be null.
		getSpeed: function () {
			return this.position ? this.position.coords.speed : null;
		},

		// Returns the altitude accuracy, in meters.
		getAltitudeAccuracy: function () {
			return this.position ? this.position.coords.altitudeAccuracy : null;
		},

		// Get the current location services available on the device. 
		getLocation: function (callback /* function (position, error) */) {
			return this.position;
		},
		
		// Returns the number of feet per XY at the passed latitude.
		getScale: function (latitude) {
			if (!latitude) latitude = (this.position ? this.position.coords.latitude : null);
			if (!latitude) return;
			var g1 = new GCoord(latitude - 0.01, 0);
			var g2 = new GCoord(latitude + 0.01, 0);
			var distance = MathExt.degToFeet(0.02);
			var p1 = this.coordToXY(g1);
			var p2 = this.coordToXY(g2);
			var scale = p1.distance(p2) / distance;
			return scale;
		},

		// Convert to a standardized xy point using a mercator projection.
		// .https://stackoverflow.com/questions/14329691/convert-latitude-longitude-point-to-a-pixels-x-y-on-mercator-projection
		coordToXY: function (coord /* GCoord */, result /* opt out */) {
			var vec = result ? result : new Vector2();
			var mapWidth = this._mapHeight * 2.0;

			vec.x = (coord.long + 360 % 360) / 360 * mapWidth;	// 0 - 2.
			var mercLat = Math.log(Math.tan(Math.PI / 4.0 + (MathExt.degToRad(coord.lat) / 2.0)));
			vec.y = (this._mapHeight * 0.5) - (mapWidth * mercLat / (2.0 * Math.PI)); // 0 - 1.
		
			return vec;
		},

		// Get the location from the device as an XY coordinate with an altitude value.
		getXYLocation: function (callback /* function (vector2, errMsg) */) {
			if (!this.position)
				return null;

			var gCoord = new GCoord(this.position.coords.latitude, this.position.coords.longitude);
			var xy = this.coordToXY(gCoord);
			xy.altitude = this.position.coords.altitude;
			return xy;
		},
		
		/* -- Geolocation functionality ------------------------  */

		// Start polling the geolocation.  The position will be updated when a new position is available.  
		startPolling: function (callback) {
			if (!navigator.geolocation) {
				console.log("Browser does not support geolocation");
			}

			var self = this;
			navigator.geolocation.watchPosition(
				function (position) {	self.position = position;  if (callback) callback(); },		// successCallback
				function (error)    {	console.log("Geolocation error: " + self.translateErrorMessage(error)); },
				{ enableHighAccuracy: true,	// Request high accuracy mode from the device, which the device generally does not use to save power.
				  timeout: 100,
				  maximumAge: 0 });		
		},

		stopPolling: function () {
			navigator.geolocation.clearWatch();
		},

		// Start polling the geolocation at a specific interval.  
		startForcePolling: function (callback, freqPerSec) {
			if (!navigator.geolocation) {
				console.log("Browser does not support geolocation");
			}
			var self = this;
			this._pollTimerId = setInterval(function() {
				navigator.geolocation.getCurrentPosition(
					function (position) {  self.position = position;  if (callback) callback(); },		// successCallback
					function (error)    {  console.log("Geolocation error: " + self.translateErrorMessage(error));    },
					{ enableHighAccuracy: true,
					  timeout: 100,
					  maximumAge: 0 
					});
				}, 1000 / freqPerSec);
		},

		stopForcePolling: function () {
			clearInterval(this._pollTimerId);
		
		},

		translateErrorMessage: function (error) {
			switch(error.code) {
				case error.PERMISSION_DENIED:		return "User denied the request for Geolocation.";	
				case error.POSITION_UNAVAILABLE:	return "Location information is unavailable. " + error.message;
				case error.TIMEOUT:					return "The request to get user location timed out.";
				case error.UNKNOWN_ERROR:			return "An unknown error occurred.";			
			}
			return "Unknown error code.";
		}


	}

	return Location;
});
