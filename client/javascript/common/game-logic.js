
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function (require) {

	var Vector2 = require("./vector2");
	var GameState = require('./game-state');

	function GameLogic(x, y) {
		this.x = x;
		this.y = y;
	}

	GameLogic.prototype.suckIt = function () {
		return new Vector2(this.x, this.y);
	};

	return GameLogic;
});