// Copyright VCP 2017
// GameDisplay.js


define (function (require) {

	var GameState = require('common/game-state');

	function GameDisplay(canvasElement) {
		this.canvas = new Canvas2D(canvasElement);
		this.canvas.setProjection(0, 0, 1 /*ppunit */, true /* invertY */);
		
	}

	GameDisplay.prototype.draw = function (state /* GameState */) {
		this.canvas.clear('rgb(230, 230, 230)');

		var playerPos = state.playerPosition;
		canvas.drawCircle(playerPos.x, playerPos.y, canvas.pixelsToUnits(10) /* radius */, 'rgb(0, 0, 255)', 'rgb(0, 0, 0)');
	}


	return GameDisplay;
});