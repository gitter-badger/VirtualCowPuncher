// Copyright VCP 2017
// GameDisplay.js


define (function (require) {

	var GameState = require('common/game-state');
	var Canvas2D = require('canvas2d');

	function GameDisplay(canvasElement) {
		this.canvas = new Canvas2D(canvasElement);
		this.canvas.setProjection(0, 0, 1 /*ppunit */, true /* invertY */);
		
	}

	GameDisplay.prototype.updateProjection = function (state) {
		// Set up the projection
		var bbox = state.bbox;
		var ppu = this.canvas.height / Math.max(0.01, Math.max(bbox.max.x - bbox.min.x, bbox.max.y - bbox.min.y));	// pixels per unit
		ppu *= 0.9;  // Zoom out to provide some margin in the view.
		this.canvas.setProjection((bbox.min.x + bbox.max.x)  / 2, (bbox.min.y + bbox.max.y) / 2, ppu, true);
	},

	GameDisplay.prototype.draw = function (state /* GameState */) {
		this.updateProjection(state);

		// Clear the canvas
		this.canvas.clear('rgb(230, 230, 230)');

		// Draw all elements of the state.
		//var playerPos = state.playerPosition;
		//this.canvas.drawCircle(playerPos.x, playerPos.y, this.canvas.pixelsToUnits(10) /* radius */, 'rgb(0, 0, 255)', 'rgb(0, 0, 0)');
		for(var i in state.objects){
			state.objects[i].draw(this.canvas);
		}

		//for(var i in state.walls){
		//	state.walls[i].draw(this.canvas);
		//}

	};


	return GameDisplay;
});