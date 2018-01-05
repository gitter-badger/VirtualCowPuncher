// Copyright VCP 2017
// GameController.js
// - Contains all drawing a objects in a GameController.

define(function (require)  {
    
	var Vector2 = require('common/vector2');
	var MathExt = require('common/math-ext');
	var GameState = require('common/game-state');
	var GameDisplay = require('game-display');
	var Location = require('location');

   function GameController (canvasElement /* DOMElement */, outputElement /* opt, DOMElement */) {
	   
		this.output = outputElement;

		this.gameState = new GameState();
		this.gameDisplay = new GameDisplay(canvasElement);
		
		this.scale = 1.0;		// XY Units per foot.

		var self = this;
		Location.startPolling(function() { self.displayLocation(); });
		//Location.startForcePolling(function() { self.displayLocation(); }, 10);		// use this to update location x times a second.

		this.drawTimerID = setInterval(function() { self._onDraw(); }, 33);
   }

	var queries = 0;
	GameController.prototype.displayLocation = function () {
		if (!this.output)
			return;

		var xyPosition = Location.getXYLocation();
		if (!xyPosition)
			return;

		this.output.innerHTML = "queries: " + ++queries + 
										"<br>X: " + xyPosition.x + 
										"<br>Y: " + xyPosition.y + "<br>Alt: " + xyPosition.altitude + 
										"<br>Scale: " + Location.getScale() +
										"<br>Acc: " + Location.accuracy + "<br>";
	}

	GameController.prototype._onDraw = function () {
		this.gameDisplay.draw(this.gameState);
	};

	return GameController;
});