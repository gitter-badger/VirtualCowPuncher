// Copyright VCP 2017
// GameState.js

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function (require) {

	var BBox = require('common/BBox');
	var Vector2 = require('common/Vector2');

	function GameState() {
		
		this.playerPosition = new Vector2();

		this.bbox = new BBox();
	}


	GameState.prototype.setPlayerPosition = function (position /* Vector2 */) {
		this.playerPosition.set(position);
		this.bbox.addPoint(position);
	}


	return GameState;
});


