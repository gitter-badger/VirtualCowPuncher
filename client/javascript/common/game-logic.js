
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function (require) {

	var Vector2 = require("./vector2");
	var GameState = require('./game-state');

	function GameLogic() {
		// This might not need to be a prototype. All of the game state will be in
		// the game state object. If you're writing 'this' in this file it will need
		// justification
		// .. or maybe GameLogic should own a GameState instance
	}

	function splitObjectsByType(allObjects){
		var afterSplit = {};
		for(var i in allObjects){
			var type = allObjects[i]['type'];
			if(!(type in afterSplit)){
				afterSplit[type] = {};
			}
			afterSplit[type][i] = allObjects[i];
		}
		return afterSplit;
	}

	GameLogic.prototype.update = function (state) {
		var objectsByType = splitObjectsByType(state.objects);
		for(var i in objectsByType['cow']){
			var cow = objectsByType['cow'][i];
			for(var j in objectsByType['player']){
				var player = objectsByType['player'][j];

				//TODO: Make sure all locations are Vector2
				if (cow.position.constructor.name === 'Vector2') {
					//console.log("you got a Vector here bro");
				}else{
					console.log("you fucked up! cow");
				}
				if (player.position.constructor.name === 'Vector2') {
					//console.log("you got a Vector here bro");
				}else{
					console.log("you fucked up! player");
				}
				var distance = cow.position.distance(player.position);
				//console.log("distance: " + distance);

				var cowMovementSpeed = 0.2;
				if(distance < 20.0){
					var diff = cow.position.subc(player.position).normalize();
					var newCowPosition = cow.position.addc(diff.multc(cowMovementSpeed));
					state.moveObject(i, newCowPosition)
				}

				//TODO: compute distance and move cow away from player if too close

				//Future TODO: Move this behavior to the state system
			}
		}
	};

	return GameLogic;
});