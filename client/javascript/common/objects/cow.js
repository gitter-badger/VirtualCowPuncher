
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function (require) {

	var CPObject = require("common/cp-object");
	var FleeBehavior = require("common/cp-object");

	function Cow(fleeDistance) {
		this.behaviors.push(new FleeBehavior(5));

	}

	Cow.prototype = new CPObject();

	Cow.prototype.draw = function (canvas) {
		canvas.drawCircle(this.position.x, this.position.y, canvas.pixelsToUnits(10) /* radius */, 'rgb(60, 60, 255)', 'rgb(150, 150, 150)');
	};



	return Vector2;
});
