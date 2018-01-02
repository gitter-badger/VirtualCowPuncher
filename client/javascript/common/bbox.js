// Copyright 2017 VCP
// bbox.js
// A simple 2 dimensional bounding box.

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function (require) {

	var Vector2 = require("./vector2");

	function BBox(p1, p2) {
		this.min = { x: 1e8, y: 1e8};
		this.max = { x: -1e8, y: -1e8};
        
		if (p1 != null)
			this.addPoint(p1);
		if (p2 != null)
			this.addPoint(p2);
	}

	BBox.prototype.isValid = function () {
		return this.min.x <= this.max.x;
	}

	BBox.prototype.addPoint = function (p /* Vector2 */) {
		if (p.x < this.min.x) this.min.x = p.x;
		if (p.x > this.max.x) this.max.x = p.x;
		if (p.y < this.min.y) this.min.y = p.y;
		if (p.y > this.max.y) this.max.y = p.y;
		
	};

	BBox.prototype.addPoint2 = function (x, y) {
		if (x < this.min.x) this.min.x = x;
		if (x > this.max.x) this.max.x = x;
		if (y < this.min.y) this.min.y = y;
		if (y > this.max.y) this.max.y = y;
	};

	BBox.prototype.getSize = function () {
		return new Vector2(this.max.x - this.min.x,
								this.max.y - this.min.y);
	};

	BBox.prototype.contains = function (p /* Vector2/3 */) {
		return p.x >= this.min.x
			 && p.x <= this.max.x
			 && p.y >= this.min.y
			 && p.y <= this.max.y
	}

	BBox.prototype.clear = function() {
		this.min.x = this.min.y = 1e8;
		this.max.x = this.max.y = -1e8;
	}

	//var il_range1 = new Range();    // Because this function will be called often, it can save time by declaring these as global.
	//var il_range2 = new Range();
	//var il_range3 = new Range();

	//BBox.prototype.intersectsLine = function (Line3 /* Line3 */) {
	//	var p1 = Line3.p1;
	//	var p2 = Line3.p2;
    
	//	var delta = p2.x - p1.x;
	//	il_range1.set((this.min.x - p1.x) / delta, (this.max.x - p1.x) / delta);
	//	if (!il_range1.isWithin(0, 1))
	//		return false;

	//	delta = p2.y - p1.y;
	//	il_range2.set((this.min.y - p1.y) / delta, (this.max.y - p1.y) / delta);
	//	il_range1.union(il_range2);
	//	if (!il_range1.isWithin(0, 1))
	//		return false;

	//	delta = p2.z - p1.z;
	//	il_range2.set((this.min.z - p1.z) / delta, (this.max.z - p1.z) / delta);
	//	il_range1.union(il_range2);
    
	//	return il_range1.isWithin(0, 1);
	//}

	return BBox;
});	