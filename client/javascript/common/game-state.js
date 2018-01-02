// Copyright VCP 2017
// GameState.js

if (typeof define !== 'function') {
	var define = require('amdefine')(module)
}

define(function (require) {

	var BBox = require('./bbox');
	var Vector2 = require('./vector2');

	function GameState() {

		this.objects = {};
		this.walls = [];

		new Vector2();

		this.bbox = new BBox();

	}

	GameState.prototype.addObject = function (object_id, type, position /* Vector2 (not yet) */) {
		this.objects[object_id] = {"type": type, "position": position};
	};

	GameState.prototype.moveObject = function (object_id, position /* Vector2 (not yet) */) {
		if (this.objects[object_id]) {
			this.objects[object_id]["position"] = position;
			this.bbox.addPoint2(position['x']-100, position['y']-100);
			this.bbox.addPoint2(position['x']+100, position['y']+100);
		} else {
			console.log("object not found");
			console.log(object_id);
		}
	};

	GameState.prototype.removeObject = function (object_id) {
		delete this.objects[object_id];
	};


	GameState.prototype.addWall = function (position /* Vector2 */) {
	};


	GameState.prototype.updateFromJSON = function (stateJSON) {
		var newState = JSON.parse(stateJSON);
		if (newState["objects"]) {
			this.objects = newState["objects"];
		}
		if (newState["walls"]) {
			this.walls = newState["walls"];
		}
	};


	GameState.prototype.to_json = function () {
		return JSON.stringify({"objects": this.objects, "walls": this.walls, "bbox": this.bbox});
	};


	return GameState;
});


