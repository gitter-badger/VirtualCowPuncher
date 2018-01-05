// Copyright VCP 2017
// GameController.js
// - Contains all drawing a objects in a GameController.

define(function (require) {

	var Vector2 = require('common/vector2');
	var MathExt = require('common/math-ext');
	var GameState = require('common/game-state');
	var GameDisplay = require('game-display');
	var Location = require('location');

	function GameController(canvasElement /* DOMElement */, outputElement /* opt, DOMElement */) {

		this.my_id = -1;// = Math.round(Math.random() * 1000000); // TODO: Change this to be unique
		this.output = outputElement;

		this.gameState = new GameState();
		this.gameDisplay = new GameDisplay(canvasElement);

		var self = this;

		this.socket = io();

		this.socket.on('assign_id', function(assigned_id){
			self.my_id = assigned_id["id"];
		});

		this.socket.on("game_state", function (state) {
			//console.log("state: ");
			//console.log(state);
			self.gameState.updateFromJSON(state);
		});

		//Location.startPolling(function() { self.displayLocation(); });		// use this to update location when it has changed.
		Location.startForcePolling(function() { self._onLocation(); }, 10);		// use this to update location x times a second.

		this.drawTimerID = setInterval(function () {
			self._onDraw();
		}, 33);
	}

	var queries = 0;
	GameController.prototype._onLocation = function () {
		
		var xyLoc = Location.getXYLocation();
		if (!xyLoc)
			return;

		this.socket.emit("player_moved", {'id': this.my_id, 'x': xyLoc.x, 'y': xyLoc.y});

		this.gameState.moveObject(this.my_id, xyLoc); // TODO
		
		if (this.output) {
			this.output.innerHTML = "queries: " + ++queries +
				"<br>X: " + xyLoc.x +
				"<br>Y: " + xyLoc.y + 
				"<br>Alt: " + xyLoc.altitude +
				"<br>Heading: " + Location.getHeading() + 
				"<br>Speed: " + Location.getSpeed() + 
				"<br>Scale: " + Location.getScale() +
				"<br>Acc: " + Location.getAccuracy() + "<br>";
		}

	};


	GameController.prototype._onDraw = function () {
		this.gameDisplay.draw(this.gameState);
	};

	return GameController;
})
;