// Copyright VCP 2017
// GameDisplay.js


define(function (require) {

	var GameState = require('common/game-state');
	var Canvas2D = require('canvas2d');
	var Cow = require('common/objects/cow');
	var Player = require('common/objects/player');

	function GameDisplay(canvasElement) {
		this.canvas = new Canvas2D(canvasElement);
		this.canvas.setProjection(0, 0, 1 /*ppunit */, true /* invertY */);

	}

	GameDisplay.prototype.updateProjection = function (state) {
		// Set up the projection
		var bbox = state.bbox;
		var ppu = this.canvas.height / Math.max(0.01, Math.max(bbox.max.x - bbox.min.x, bbox.max.y - bbox.min.y));	// pixels per unit
		ppu *= 0.9;  // Zoom out to provide some margin in the view.
		this.canvas.setProjection((bbox.min.x + bbox.max.x) / 2, (bbox.min.y + bbox.max.y) / 2, ppu, true);
	};

	GameDisplay.prototype.draw = function (state /* GameState */) {
		this.updateProjection(state);

		// Clear the canvas
		this.canvas.clear('rgb(230, 230, 230)');

		// Draw all elements of the state.
		//var playerPos = state.playerPosition;
		//this.canvas.drawCircle(playerPos.x, playerPos.y, this.canvas.pixelsToUnits(10) /* radius */, 'rgb(0, 0, 255)', 'rgb(0, 0, 0)');
		for (var i in state.objects) {
			//if(state.objects[i]['position']) {
			if (state.objects[i] instanceof Cow) {
				this.canvas.drawCircle(state.objects[i].position['x'], state.objects[i].position['y'], this.canvas.pixelsToUnits(10) /* radius */, 'rgb(0, 0, 0)', 'rgb(255, 255, 255)');
			} else {
				this.canvas.drawCircle(state.objects[i].position['x'], state.objects[i].position['y'], this.canvas.pixelsToUnits(10) /* radius */, 'rgb(60, 60, 255)', 'rgb(150, 150, 150)');
			}
			//state.objects[i].draw(this.canvas);
		}

		// Draw the game boundary
		var points = state.gameBounds.getPoints();
		var fenceColor = 'rgb(150, 100, 100)';
		for (var i = 0; i < points.length; i++) {
			this.canvas.drawLineV(points[i], points[(i+1)%points.length], fenceColor);
		}
		for (var i = 0; i < points.length; i++) {
			this.canvas.drawCircle(points[i].x, points[i].y, this.canvas.pixelsToUnits(10), 'rgb(0, 0, 0)',  fenceColor);
		}
		//var validPoints = state.gameBounds.validPoints;
		//for (var i = 0; i < validPoints.length; i++) {
		//	this.canvas.drawCircle(validPoints[i].x, validPoints[i].y, this.canvas.pixelsToUnits(6), 'rgb(0, 200, 0)',  fenceColor);
		//}

		// Draw the test points
		for (var i = 0; i < state.testPoints.length; i++) {
			this.canvas.drawCircle(state.testPoints[i].x, state.testPoints[i].y, this.canvas.pixelsToUnits(4), 'rgb(30, 30, 100)');
		}

	};


	return GameDisplay;
});