// Copyright VCP 2018
// serialize.js
// - A class to handle the saving and loading of objects, especially when the type will not be known on load.

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define (function (require) {

	var Player = require("./objects/player");
	var Cow = require("./objects/cow");
	var Zombie = require("./objects/zombie");

	// Any object that is serializable must implement:
	// write(): returns an object containing all data necessary for serialization.
	// read(saveObj, context): reads the serialized object and returns a newly created object from the serialized information.

	var Serialize = {
		Player: 1,  	// Do not change these values.  They have been serialized to files.
		Cow: 2,
		
		// Returns an object with the minimum data needed to serialize this object.
		write: function (object) {
			if (!object.write) {
				console.log("Object is not serializable");
				return;
			}
			var saveObj = { };
			if (object instanceof Player)			saveObj.t = this.Player;
			else if (object instanceof Cow)		saveObj.t = this.Cow;
		
			saveObj.o = object.write();
			return saveObj;
		},
	
		// Returns a new object from the passed json object read from the saved data.
		read: function (saveObj, context /* opt */) {
			var type = saveObj.t;
			var obj = saveObj.o;
			switch (type) {
				case this.Player: 	return Player.read(obj, context);
				case this.Cow: 		return Cow.read(obj, context);
			}
			return null;	// Unable to read unknown object.
		}	
	
	}




	return Serialize;
});