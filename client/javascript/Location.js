// Copyright VCP 2017
// Location.js
// - Functionality for recieving location information from the system.  May be GPS or something less accurate.

define(function (require)  {
	var GCoord = require("common/gcoord");
	var Vector2 = require("common/vector2");
	var MathExt = require("common/math-ext");
	
	var Location = {	
		// Size of the mercator projected map if it were the world.  So our world size is a small porition of that.
		// A map height of 15,000,000 results in approximately 1xy in 1 meter at 42 degrees north.
		_mapHeight: 15000000,
		position: null,		// The last recieved position

		startPolling: function (callback) {
			var self = this;
			navigator.geolocation.watchPosition(
				function (position) {	self.position = position;  if (callback) callback(); },		// successCallback
				function (error)    {	console.log("Geolocation error: " + self.translateErrorMessage(error)); },
				{ enableHighAccuracy: true,
				  timeout: 100,
				  maximumAge: 0 });		// Request high accuracy mode from the device, which the device generally does not use to save power.
		},

		stopPolling: function () {
			navigator.geolocation.clearWatch();
		},

		getAccuracy: function () {
			return position ? position.coords.accuracy : null;
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

		// Get the current location services available on the device. 
		// position: { coords: { latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed }, timestamp }}
		getLocation: function (callback /* function (position, error) */) {
			return this.position;
			//if (navigator.geolocation) {
			//	var self = this;
			//	navigator.geolocation.getCurrentPosition(
			//		function (position) {  
			//			self.accuracy = position.coords.accuracy;
			//			self.latitude = position.coords.latitude;
			//			callback(position);
			//		},
			//		function (error)    {
			//			var msg = self.translateErrorMessage(error);
			//			callback(null, msg);
			//		},
			//		{ enableHighAccuracy: true });		// Request high accuracy mode from the device, which the device generally does not use to save power.
			//} 
			//else {
			//	console.log('Geolocation is not supported by this browser');
			//}
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
