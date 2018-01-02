// Copyright VCP 2017
// GameState.js

if (typeof define !== 'function') {
	var define = require('amdefine')(module)
}

define(function (require) {

	var BBox = require('common/BBox');
	var Vector2 = require('common/Vector2');

	function GameState() {

		this.objects = [];
		this.walls = [];

		new Vector2();

		this.bbox = new BBox();

	}

	GameState.prototype.addObject = function (position /* Vector2 */) {
	};

	GameState.prototype.moveObject = function (position /* Vector2 */) {
	};

	GameState.prototype.addWall = function (position /* Vector2 */) {
	};


	GameState.prototype.updateFromJSON = function(stateJSON){
		var newState = JSON.parse(stateJSON);
		if(newState["objects"]) {
			this.objects = newState["objects"];
		}
		if(newState["walls"]) {
			this.walls = newState["walls"];
		}
	};


	//GameState.prototype.toJSON = function () {
	//	var json_state = {
	//		"objects": [
	//			{"id": 210, "type": "player", "position": {"x": 4, "y": 10}},
	//			{"id": 349, "type": "player", "position": {"x": 8, "y": 15}},
	//			{"id": 562, "type": "cow", "position": {"x": 6, "y": 20}}
	//		],
	//		"walls": []
	//	};
	//};


	return GameState;
});


