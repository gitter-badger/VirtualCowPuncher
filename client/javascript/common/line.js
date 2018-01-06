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

	Line.prototype.distance = function (point) {
		var p = point.subc(this.p1);
		var distance = p.dot(this.normal());
		return Math.abs(distance);
	}

	// Sets the normal of the line to the side that point lies upon.
	Line.prototype.setNormalSide = function (point) {
		this.normal = this.direction().perpedicular();
		this.normal.normalize();
		var p = point.subc(this.p1);
		if (this.normal.dot(p) < 0.0)
			this.normal.reverse();
	}

	Line.prototype.isNormalSide = function (point) {
		var p = point.subc(this.p1);
		return this.normal.dot(p) >= 0.0;
	}

	// Get the intersection between 2 rays.
	Line.prototype.intersection = function (other /* Line */) {

		var direction = this.direction().normalize();
		var normal = other.normal();

		var dot = Math.abs(direction.dot(normal));	// Approach speed
		if (dot < 0.001)
			return null;		// Lines are parallel.
		var distance = other.distance(this.p1);
		var param = distance / dot;		// This could be checked against the length to ensure it's still on a Line3.
		var intersection = this.p1.addc(direction.mult(param));

		if (other.distance(intersection) > distance)
			return null;	// Rays are moving away from each other.
		return intersection;
	}

	return Line;
});