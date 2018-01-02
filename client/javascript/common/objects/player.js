
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function (require) {

	var CPObject = require("common/cp-object");
	var FleeBehavior = require("common/cp-object");

	function Player() {

	}

	Player.prototype = new CPObject();

	Player.prototype.draw = function (canvas) {
		canvas.drawCircle(this.position.x, this.position.y, canvas.pixelsToUnits(10) /* radius */, 'rgb(160, 160, 255)', 'rgb(50, 50, 50)');
	};



	return Player;
});
