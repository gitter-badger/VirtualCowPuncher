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
		this.needsProcessing = false;
				
		// Do not consider points that form straight lines.  They're redundant and would only mess things up.
		var vps = this.points.slice(0);		// valid points.  Clone the array so the original is not affected.
		for (var i = 0; i < vps.length; i++) {
			var line = new Line(vps[i], vps[(i+2) % vps.length]);
			if (line.distance(vps[(i+1) % vps.length]) < line.length() / 100) {
				vps.splice((i+1) % vps.length, 1);		// Remove the center point.  It's on the line containing its two neighbors.
				i--;	// Test this point again.
			}
		}

		if (vps.length < 3)
			return;
				
		// Create the lines from the points.
		var np = vps.length;
		for (var i = 0; i < np; i++) {
			this.bbox.addPoint(vps[i]);
			var line = new Line(vps[i], vps[(i+1)%np]);
	
			this.lines.push(line);
		}
		return;
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
		var testLine = new Line(p, new Vector2(p.x + this.bbox.getWidth() * 1000 + 1000, p.y));
		var intersects = 0;
		for (var i = 0; i < this.lines.length; i++)  {
			if (testLine.doesIntersect(this.lines[i]))
				intersects++;
		}
		return intersects % 2 == 1;
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