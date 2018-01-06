// Copyright VCP 2017
// cp-object.js
// - A base class for all objects in the scene

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function (require)  {

	var Vector2 = require("../vector2");
    
	function CPObject () {
		this.position = new Vector2();		//  XY position of the object
		this.behaviors = [];
		this.id = null;				// For convienent use within the state.
	}

	// Convert to a JSON object that can be easily stringified.
	CPObject.prototype.write = function () {
		return {
			p: this.position.write(),
			id: this.id
		};
	};

	CPObject.prototype.read = function (saveObj) {
		CPObject.read(saveObj, this);
	};

	// Create a new CPObject from the saveObj, or append the data to an existing context,
	// as would be the case when reading in from an already allocated object or derived class.
	CPObject.read = function (saveObj, context /* opt */) {
		if (!context)
			context = new CPObject();
		context.position.read(saveObj.p);
		context.id = saveObj.id;
		return context;
	};

	CPObject.prototype.setPosition = function (position /* Vector2 */) {
		this.position.set(position);
	};

	CPObject.prototype.draw = function (canvas) {
		canvas.drawCircle(this.position.x, this.position.y, canvas.pixelsToUnits(10) /* radius */, 'rgb(0, 0, 255)', 'rgb(0, 0, 0)');
	};



	return CPObject;
});