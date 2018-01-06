// Copyright 2017 VCP
// bounded-area.js
// - Defines a region bounded by points


if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function (require) {

	var Vector2 = require('./vector2');
	var Line = require('./Line');
	var BBox = require('./BBox');

	function BoundedArea() {
		this.points = [];			// Vector2[]

		// Data derived from the points.
		this.needsProcessing = false;
		this.lines = [];		// The convex lines connecting the points.
		this.bbox = new BBox();		// BBox.	For convienence when creating random points.
	};

	BoundedArea.prototype.getPoints = function () { 
		return this.points;
	};

	BoundedArea.prototype.addPoint = function (p /* Vector2 */) {
		this.points.push(p);
		this.needsProcessing = true;
	};

	BoundedArea.prototype.removeLast = function () {
		this.points.pop();
	};

	BoundedArea.prototype.getBBox = function () {
		if (!this.bbox.isValid())
			this.process();
		return this.bbox;
	};
	
	BoundedArea.prototype.process = function () {
		this.lines = [];
		this.bbox.clear();
		
		// TODO: Take care of straight lines and convex points.
		var numPoints = this.points.length;
		for (var i = 0; i < numPoints; i++) {
			this.bbox.addPoint(this.points[i]);
			var line = new Line(this.points[i], this.points[(i+1)%numPoints]);
			line.setNormalSide(this.points[(i+2)%numPoints]);	// Set the normal of the line so it points in.
			this.lines.push(line);
		}

		this.needsProcessing = false;
	};

	// Get a random point within the bounded area.
	BoundedArea.prototype.getRandomPoint = function () {
		if (this.needsProcessing)
			this.process();

		var p, i = 0;
		do {
			p = this.bbox.getRandomPoint();
		} while (!this.isWithin(p) && ++i < 500);
		return p;
	}

	// Does the point lie within this bounded area.
	BoundedArea.prototype.isWithin = function (p /* Vector2 */) {
		if (this.needsProcessing)
			this.process();
		for (var i = 0; i < this.lines.length; i++)  {
			if (!this.lines[i].isNormalSide(p))
				return false;
		}
		return true;
	}

	BoundedArea.prototype.write = function () {
		var obj = {};
		obj.p = Vector2.writeArray(this.points);
		return obj;
	};

	BoundedArea.prototype.read = function (obj) {
		BoundedArea.read(obj, this);
	};

	BoundedArea.read = function (obj, context) {
		if (!context)
			context = new Boundary();

		context.points = Vector2.readArray(obj.p);
		context.process();
	};


	return BoundedArea;
});