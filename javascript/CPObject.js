﻿// Copywrite VCP 2017
// CPObject.js
// - A base class for all objects in the scene

define(function (require)  {

	var Vector2 = require("Vector2");
    
	function CPObject () {
		this.position = new Vector2();		//  XY position of the object


	}

	CPObject.prototype.draw = function (canvas) {
		canvas.drawCircle(this.position.x, this.position.y, canvas.pixelsToUnits(10) /* radius */, 'rgb(0, 0, 255)', 'rgb(0, 0, 0)');
	}

	return CPObject;
});