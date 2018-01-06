
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function (require) {

	var CPObject = require("./cp-object");

	function Player() {
		CPObject.call(this);	
	}

	Player.prototype = Object.create(CPObject.prototype);
	Player.constructor = Player;

	Player.prototype.write = function () {
		var obj = { };
		obj.b = CPObject.prototype.write.call(this);		// write base class

		// Player specific data goes here
		return obj;
	};

	Player.prototype.read = function (saveObj) {
		Player.read(saveObj, this);
	};

	Player.read = function (saveObj, context) {
		if (!context)
			context = new Player();
		
		CPObject.read(saveObj.b, context);

		// Player specific data goes here
		return context;
	};


	Player.prototype.draw = function (canvas) {
		canvas.drawCircle(this.position.x, this.position.y, canvas.pixelsToUnits(10) /* radius */, 'rgb(160, 160, 255)', 'rgb(50, 50, 50)');
	};

	return Player;
});
