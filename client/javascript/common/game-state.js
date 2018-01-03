// Copyright VCP 2017
// GameState.js

if (typeof define !== 'function') {
	var define = require('amdefine')(module)
}

define(function (require) {

		var BBox = require('./bbox');
		var Vector2 = require('./vector2');
		var Cow = require('./objects/cow');
		var Player = require('./objects/player');

		function GameState() {

			this.objects = {};
			this.walls = [];

			new Vector2();

			this.bbox = new BBox();

		}

		// TODO: Move all functionality to GameLogic

		GameState.prototype.addObject = function (object_id, type, position /* Vector2 */) {

			this.objects[object_id] = {"type": type, "position": position};
			//this.objects[object_id] = {"type": type, "position": {'x': position.x, 'y': position.y}};
		};

		GameState.prototype.moveObject = function (object_id, position /* Vector2 */) {
			//console.log(position);
			//console.log(position.constructor.name);
			if (position.constructor.name === 'Vector2') {
				//console.log("you got a Vector here bro");
			} else {
				console.log("you fucked up!");
			}
			if (this.objects[object_id]) {
				this.objects[object_id]["position"] = position;
				this.bbox.addPoint2(position.x - 100, position.y - 100);
				this.bbox.addPoint2(position.x + 100, position.y + 100);
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
				this.objects = {};
				for (var i in newState["objects"]) {
					var o = newState["objects"][i];
					this.objects[i] = {"type": o.type, "position": new Vector2(o.position.x, o.position.y)};
					//console.log(newState["objects"][i]);
				}
				this.objects = newState["objects"];
			}
			if (newState["walls"]) {
				this.walls = newState["walls"];
			}
		};


		GameState.prototype.to_json = function () {
			//return JSON.stringify(this);
			var jsonState = {"objects": {}, "walls": this.walls, "bbox": this.bbox};
			for (var i in this.objects) {
				var o = this.objects[i]
				jsonState.objects[i] = {"type": o.type, "position": {"x": o.position.x, "y": o.position.y}}
			}
			return JSON.stringify(jsonState);
		};


		return GameState;
	}
);


