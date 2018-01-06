// Copyright VCP 2017
// GameController.js
// - Contains all drawing a objects in a GameController.

define(function (require) {

	var Vector2 = require('common/vector2');
	var MathExt = require('common/math-ext');
	var GameState = require('common/game-state');
	var GameDisplay = require('game-display');
	var Location = require('location');

	var Player = require('common/objects/player');
	var Cow = require('common/objects/cow');

	function GameController(canvasElement /* DOMElement */, outputElement /* opt, DOMElement */) {

		this.my_id = -1;// = Math.round(Math.random() * 1000000); // TODO: Change this to be unique
		this.output = outputElement;

		this.gameState = new GameState();
		this.gameDisplay = new GameDisplay(canvasElement);

		var self = this;

		this.socket = io();

		var player = new Player();
		player.setPosition(new Vector2(20, 30));
		this.gameState.addObject(player);

		var cow = new Cow();
		cow.setPosition(new Vector2(-10, -19));
		cow.fleeDistance = 12;
		this.gameState.addObject(cow);

		var json = this.gameState.toJSON();

		this.gameState.removeObject(cow.id);

		this.gameState.updateFromJSON(json);


		// Sent when the server recieves a connection from this client.
		this.socket.on('assign_id', function(assigned_id){
			self.my_id = assigned_id["id"];
		});

		// Sent periodically from the server so the game state is syncronized with all clients.
		this.socket.on("game_state", function (state) {
			//console.log("state: " + state);
			self.gameState.updateFromJSON(state);
		});

		//Location.startPolling(function() { self._onLocationChange(); });		// use this to update location when it has changed.
		Location.startForcePolling(function() { self._onLocationChange(); }, 3);		// use this to update location x times a second.

		this.drawTimerID = setInterval(function () {
			self._onDraw();
		}, 33);
	}

	var queries = 0;	// debugging.
	GameController.prototype._onLocationChange = function () {
		var xyLoc = Location.getXYLocation();
		
		// Update the game state
		this.gameState.moveObject(this.my_id, xyLoc); 
		
		// Inform the server of this change
		this.socket.emit("player_moved", { id: this.my_id, x: xyLoc.x, y: xyLoc.y});
				
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