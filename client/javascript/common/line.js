// Copyright VCP 2017
// line.js
// - A simple line class.

if (typeof define !== 'function') {		var define = require('amdefine')(module)	}

define(function (require) {

	var Vector2 = require("./vector2");

	function Line(p1 /* Vector2 */, p2 /* Vector2 */) {
		this.p1 = p1;
		this.p2 = p2;
		this.normal = null;
	}
	
	Line.prototype.direction = function () {
		return this.p2.subc(this.p1);
	}

	Line.prototype.length = function () {
		var x2 = (this.p2.x - this.p1.x) * (this.p2.x - this.p1.x);
		var y2 = (this.p2.y - this.p1.y) * (this.p2.y - this.p1.y);
		return Math.sqrt(x2 + y2);
	};

	// Returns the distance the passed point is from the line.
	Line.prototype.distance = function (point) {
		var p = point.subc(this.p1);
		var distance = p.dot(this.getNormal());
		return Math.abs(distance);
	}

	Line.prototype.getNormal = function () {
		if (!this.normal) {
			this.normal = this.direction().perpedicular();
			this.normal.normalize();
		}
		return this.normal;
	}

	// Sets the normal of the line to the side that point lies upon.
	Line.prototype.setNormalSide = function (point) {
		var normal = this.getNormal();
		var p = point.subc(this.p1);
		if (normal.dot(p) < 0.0)
			this.normal.reverse();
	}

	Line.prototype.isNormalSide = function (point) {
		var p = point.subc(this.p1);
		return this.normal.dot(p) >= 0.0;
	}

	// Do the line segments intersect?
	// -http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
	Line.prototype.doesIntersect = function (other /* Line */) {
		//var direction = this.direction().normalize();
		//var normal = other.getNormal();
		var d1 = this.direction();
		var d2 = other.direction();

		var denominator, a, b, numerator1, numerator2;
		denominator = ((d2.y * d1.x) - (d2.x * d1.y));
		if (denominator == 0) {
			return false;
		}
		a = this.p1.y - other.p1.y;
		b = this.p1.x - other.p1.x;
		numerator1 = (d2.x * a) - (d2.y * b);
		numerator2 = (d1.x * a) - (d1.y * b);
		a = numerator1 / denominator;		// intersect param on this
		b = numerator2 / denominator;		// intersect param on other

		return a > 0 && a < 1 && b > 0 && b < 1;		
	};

	// Get the intersection between 2 rays.
	Line.prototype.intersection = function (other /* Line */) {
		var d1 = this.direction();
		var d2 = other.direction();

		var denominator, a, b, numerator1, numerator2;
		denominator = ((d2.y * d1.x) - (d2.x * d1.y));
		if (denominator == 0) {
			return false;
		}
		a = this.p1.y - other.p1.y;
		b = this.p1.x - other.p1.x;
		numerator1 = (d2.x * a) - (d2.y * b);
		numerator2 = (d1.x * a) - (d1.y * b);
		a = numerator1 / denominator;		// intersect param on this
		b = numerator2 / denominator;		// intersect param on other

		if (a < 0 || a > 1 || b < 0 && b > 1)
			return null;	

		var intersect = new Vector2();
		intersect.x = this.p1.x + (a * d1.x);
		intersect.y = this.p1.y + (a * d1.y);

		return intersect;
	}

	return Line;
});