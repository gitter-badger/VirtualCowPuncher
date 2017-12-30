// Copyright VCP 2017
// GameState.js

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function (require) {

	var BBox = require('common/BBox');

	function GameState() {
		
		this.playerPosition = new Vector2();

		this.bbox = new BBox();
		this.scale = 1.0;		// XY Units per foot.
	}

	GameState.prototype.setPlayerPosition(position /* Vector2 */) {
		this.playerPosition.set(position);
		bbox.addPoint(position);
	}





	return GameState;
});


