// Copyright VCP 2017
// GameState.js

if (typeof define !== 'function') {
	var define = require('amdefine')(module)
}

define(function (require) {

	var BBox = require('./bbox');
	var Vector2 = require('./vector2');
	//var Cow = require('./objects/cow');
	//var Player = require('./objects/player');
	var Serialize = require('./serialize');

	function GameState() {

		this.objects = {};
		this.walls = [];

		this.bbox = new BBox();
	}

	// TODO: Move all functionality to GameLogic

	GameState.prototype._generateID = function (token_length) {
		var new_id = null;
		var length = token_length || 6;
		while (new_id === null || new_id in this.objects) {
			var alphabet = '0123456789abcdef';
			new_id = 'o_';
			for (var i = 0; i < length; i++) {
				new_id += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
			}
		}
		return new_id;
	};

	GameState.prototype.addObject = function (object /* CPObject */) {
		if (!object.id)
			object.id = this._generateID();
		this.objects[object.id] = object;
	};

	GameState.prototype.moveObject = function (object_id, position /* Vector2 */) {
		if (position.constructor.name !== 'Vector2') {
			console.log("position must be of type Vector2");
			return;
		}
			
		if (!this.objects[object_id]) {
			console.log("object_id " + object_id + " not found.");
			return;
		}
			
		this.objects[object_id].setPosition(position);
		this.bbox.addPoint2(position.x - 100, position.y - 100);
		this.bbox.addPoint2(position.x + 100, position.y + 100);
	};

	GameState.prototype.removeObject = function (object_id) {
		delete this.objects[object_id];
	};


	GameState.prototype.addWall = function (position /* Vector2 */) {

	};
	
	GameState.prototype.updateFromJSON = function (stateJSON) {
		var newState = JSON.parse(stateJSON);

		var newObjList = {};
		if (newState.objs) {
			for (var id in newState.objs) {
				if (id in this.objects) {
					newObjList[id] = this.objects[id];	// Move the object into the new list.
					Serialize.read(newState.objs[id], newObjList[id]);	// Just update existing object.  Prevents having to deallocate and allocate a new object which can slow down performance.
				}
				else {
					newObjList[id] = Serialize.read(newState.objs[id]);	// New object that we didn't know about before.
				}
			}
		}
		this.objects = newObjList;
		if (newState.walls) {
			this.walls = newState.walls;
		}
		this.bbox.read(newState.bbox);
	};

	GameState.prototype.toJSON = function () {
		
		var jsonState = { };
		jsonState.objs = {};
		for (var i in this.objects) {
			var saveObj = Serialize.write(this.objects[i]);
			jsonState.objs[i] = saveObj;			// Save as ID->object keys.
		}

		jsonState.walls = this.walls;
		jsonState.bbox = this.bbox.write();

		return JSON.stringify(jsonState);
	};

	return GameState;
});


