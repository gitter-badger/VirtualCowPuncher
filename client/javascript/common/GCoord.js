
////////////////////////////////////////////////////////////////
// GCoord 

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function (require) {

	var Vector2 = require("common/Vector2");
	var Vector3 = require("common/Vector3");
	var MathExt = require("common/MathExt");

	function GCoord(lat, long) {
		this.lat = lat;
		this.long = long;
	};

	GCoord.prototype.clone = function () {
		return new GCoord(this.lat, this.long);
	};

	GCoord.prototype.set = function (lat, long) {
		this.lat = lat;
		this.long = long;
	};

	GCoord.prototype.toJSON = function (precision) {
		return {  x: MathExt.round(this.lat, precision), y: MathExt.round(this.long, precision)  };
	};

	GCoord.FromJSON = function (json) {
		var coord = new GCoord(json.x, json.y);
		return coord;
	};

	// Returns a point on a sphere with the given radius.
	GCoord.prototype.toVec3 = function (radius /* def: 1.0 */) {
		var result = new Vector3();
		var lat = MathExt.degToRad(this.lat);
		var long = MathExt.degToRad(this.long);
		result.x = Math.cos(long) * Math.cos(lat);
		result.y = Math.sin(long) * Math.cos(lat);	//// Negate so positive longitude is ccw
		result.z = Math.sin(lat);
		if (radius)
			result.setLength(radius);
		return result;
	};

	// Return the angle in radians between this coord and the passed one.
	GCoord.prototype.angle = function (other /* GCoord */) {
		var p1 = this.toVec3();
		var p2 = other.toVec3();
		var a = p1.angle(p2);
		return a;
	};

	// Returns a point on a 360 image the gcoord would lie on.  360 image rations are 2:1
	GCoord.prototype.to360Point = function (height, bias /* opt, 'left' || 'right' */) {
		var long = this.long < 0 ? this.long + 360 : this.long % 360;
		
		if (bias && bias == 'left' && long >= 300)
			long -= 360;		// This will be a negative longitude off the left side of the map.  This prevents the wrapping problem that will occur on some pieces.
		if (bias && bias == 'right' && long < 60)
			long += 360;		// This will result in a longitude greater than 360.

		var vec = new Vector3();
		vec.x = long / 360 * height * 2;
		vec.y = (this.lat + 90) / 180.0 * height;
		vec.z = 0.0;
		
		// center it
		vec.x -= height;
		vec.y -= height / 2.0;
	
		return vec;
	};

	// Convert to a standardized xy point.  Uses mercator projection.
	// .https://stackoverflow.com/questions/14329691/convert-latitude-longitude-point-to-a-pixels-x-y-on-mercator-projection
	GCoord.prototype.toXYPoint = function (mapHeight, result /* opt out */) {
		var vec = result ? result : new Vector2();
		var mapWidth = mapHeight * 2.0;

		vec.x = (this.long + 360 % 360) / 360 * mapWidth;	// 0 - 2.
		var mercLat = Math.log(Math.tan(Math.PI / 4.0 + (MathExt.degToRad(this.lat) / 2.0)));
		vec.y = (mapHeight * 0.5) - (mapWidth * mercLat / (2.0 * Math.PI)); // 0 - 1.
		
		return vec;
	}

	// returns Vec2 of the mapping to a polar coordinate where the center is the north pole.
	// .https://en.wikipedia.org/wiki/Azimuthal_equidistant_projection
	// degOfArc: -1 and 1 will map to this number of latitude from the pole.  In degrees.
	GCoord.prototype.toPolar = function (degOfArc) {
		var theta = MathExt.degToRad(this.long);
		var distanceToPole = Math.PI / 2 - MathExt.degToRad(this.lat);
		distanceToPole *= (degOfArc / 90.0);

		var result = new Vector2();
		result.x = distanceToPole * Math.sin(theta);
		result.y = -distanceToPole * Math.cos(theta);
		return result;
	};

	GCoord.prototype.set = function (gCoordOrLat, long) {
		if (gCoordOrLat.lat !== undefined) {
			this.lat = gCoordOrLat.lat;
			this.long = gCoordOrLat.long;
		}
		else {
			this.lat = gCoordOrLat;
			this.long = long;
		}
	};

	GCoord.prototype.addScalar = function (scalar) {
		this.lat += scalar;
		this.long += scalar;
		return this;
	};

	GCoord.prototype.add = function (lat, long) {
		this.lat += lat;
		this.long += long;
		return this;
	};

	GCoord.prototype.addc = function (lat, long) {
		return new GCoord(this.lat + lat, this.long + long);
	};

	GCoord.prototype.toString = function (longOffset, useWest /*opt (true) */) {
		var long = this.long + (longOffset ? longOffset : 0);

		if ((useWest || useWest === undefined) && long > 180.0)
			long = -(180.0 - (long - 180.0));
			
		return Math.abs(this.lat.toFixed(2)) + String.fromCharCode(176) + (this.lat > 0 ? " N, " : " S, ") +
				Math.abs(long.toFixed(2)) + String.fromCharCode(176) + (long > 0 ? " E" : " W");
	}
	
	// Returns a GCoord that lies between this coordinate and the passed one.
	GCoord.prototype.getMidpoint = function (other /* GCoord */) {
		var p1 = this.toVec3();
		var p2 = other.toVec3();
		p1.set((p1.x + p2.x) / 2.0, (p1.y + p2.y) / 2.0, (p1.z + p2.z) / 2.0);
		var result = GCoord.FromVec3(p1);
		return result;
	};
	
	// static
	GCoord.FromVec3 = function (vert /* Vector3 */) {
		var result = new GCoord();
		var vec = vert.normalized();
		var latRadians = Math.asin(vec.z);
		result.lat = MathExt.radToDeg(latRadians);

		if (Math.abs(result.lat) > 89.995) {
			result.long = 0.0;	// Remove ambiguity of longitude very near the poles.
		}
		else {
			result.long = MathExt.radToDeg(Math.acos(Math.min(1.0, Math.max(-1.0, vec.x / Math.cos(latRadians)))));
			if (vec.y < 0)
				result.long = -result.long;
		}
		return result;
	}

	// static
	GCoord.ToVec3 = function (lat, long, radius) {
		radius = radius == null ? 1.0 : radius;
		var result = new Vector3();
		var latr = MathExt.degToRad(lat);
		var longr = MathExt.degToRad(long);
		result.x = Math.cos(longr) * Math.cos(latr);
		result.y = Math.sin(longr) * Math.cos(latr);
		result.z = Math.sin(latr);
		result.mult(radius)
		return result;
	}

	return GCoord;
});
