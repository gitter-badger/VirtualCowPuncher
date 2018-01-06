
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function (require) {

	var CPObject = require("./cp-object");
	var FleeBehavior = require("./behaviors/flee-behavior");

	function Cow (fleeDistance) {
		CPObject.call(this);

		this.fleeDistance = 5;
		this.behaviors.push(new FleeBehavior(this.fleeDistance));

	}

	Cow.prototype = Object.create(CPObject.prototype);
	Cow.constructor = Cow;

	Cow.prototype.write = function () {
		var obj = { };
		obj.b = CPObject.prototype.write.call(this);		// base class
		obj.fd = this.fleeDistance;

		return obj;
	};

	Cow.prototype.read = function (saveObj) {
		Cow.read(saveObj, this);
	};

	Cow.read = function (saveObj, context) {
		if (!context)
			context = new Cow();
		
		CPObject.read(saveObj.b, context);
		this.fleeDistance = saveObj.fd;
		return context;
	};


	Cow.prototype.draw = function (canvas) {
		canvas.drawCircle(this.position.x, this.position.y, canvas.pixelsToUnits(10) /* radius */, 'rgb(60, 60, 255)', 'rgb(150, 150, 150)');
	};


	return Cow;
});
