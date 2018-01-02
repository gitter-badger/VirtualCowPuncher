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
		this.locationTimerID = setInterval(function() {
			Location.getXYLocation(function(pos, errMsg)  { self._onLocation(pos, errMsg); });
		}, 100);

		this.drawTimerID = setInterval(function() { self._onDraw(); }, 33);
   }

	// Callback for the location services.  Coord is an xy coord with a z of altitude.
	GameController.prototype._onLocation = function (pos /* Vector2 */, errMsg) {
		if (errMsg) {
			if (this.output)
				this.output.innerHTML = errMsg;
			clearInterval(this.locationTimerID);
			return;
		}
	
		this.gameState.setPlayerPosition(pos);
		if (this.output)
			this.output.innerHTML = "X: " + pos.x + ", Y: " + pos.y + ", Alt: " + pos.altitude; + ", Acc: " + Location.accuracy + "<br>";
	}

	GameController.prototype._onDraw = function () {
		this.gameDisplay.draw(this.gameState);
	};

	return GameController;
});