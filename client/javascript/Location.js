// Copyright VCP 2017
// Location.js
// - Functionality for recieving location information from the system.  May be GPS or something less accurate.

define(function (require)  {
	var GCoord = require("common/gcoord");
	var Vector2 = require("common/vector2");
	var MathExt = require("common/math-ext");
	
	var Location = {	
		_mapHeight: 1000,		// Size of the mercator projected map if it were the world.  So our world size is a small porition of that.
		accuracy: 999,			// The accuracy of the last returned position that was polled.
		
		// Returns the number of feet per XY at the passed latitude.
		getScale: function (latitude) {
			var g1 = new GCoord(latitude - 0.01, 0);
			var g2 = new GCoord(latitude + 0.01, 0);
			var distance = MathExt.degToFeet(0.02);
			var p1 = this.gCoordToXY(g1);
			var p2 = this.gCoordToXY(g2);
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
			var self = this;
			this.getLocation(function (position, errMsg) {
				if (!errMsg) {
					var gCoord = new GCoord(position.coords.latitude, position.coords.longitude);
					var xy = self.coordToXY(gCoord);
					xy.altitude = position.coords.altitude;
					callback(xy);
				}
				else {
					callback(null, errMsg);
				}
			});
		},

		// Get the current location services available on the device. 
		// position: { coords: { latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed }, timestamp }}
		getLocation: function (callback /* function (position, error) */) {
			if (navigator.geolocation) {
				var self = this;
				navigator.geolocation.getCurrentPosition(
					function (position) {  
						self.accuracy = position.coords.accuracy;
						callback(position);
					},
					function (error)    {
						var msg = null;
						switch(error.code) {
							case error.PERMISSION_DENIED:		msg = "User denied the request for Geolocation.";	break;
							case error.POSITION_UNAVAILABLE:	msg = "Location information is unavailable. " + error.message;	break;
							case error.TIMEOUT:					msg = "The request to get user location timed out.";	break;
							case error.UNKNOWN_ERROR:			msg = "An unknown error occurred.";			break;
						}
						console.log("Geolocation Error: " + msg);
						callback(null, msg);
					},
					{ enableHighAccuracy: true });		// Request high accuracy mode from the device, which the device generally does not use to save power.
			} 
			else {
				console.log('Geolocation is not supported by this browser');
			}
		}
	}

	return Location;
});
