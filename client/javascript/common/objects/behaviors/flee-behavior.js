
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function (require) {

	//var MathExt = require("common/math-ext");

	function FleeBehavior(fleeDistance) {
		this.fleeDistance = fleeDistance;
	}

	FleeBehavior.prototype.behave = function () {

	};


	return FleeBehavior;
});
