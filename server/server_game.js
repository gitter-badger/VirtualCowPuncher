var State = require("../client/javascript/common/game-state");
var Cow = require("../client/javascript/common/objects/cow");
var BBox = require("../client/javascript/common/bbox");
var Vector2 = require("../client/javascript/common/vector2");
var GameLogic = require("../client/javascript/common/game-logic");


function randomLocation(bbox) {
	var x = bbox.min.x + Math.random() * (bbox.max.x - bbox.min.x);
	var y = bbox.min.y + Math.random() * (bbox.max.y - bbox.min.y);
	//console.log('****');
	//console.log(bbox);
	//console.log(x);
	//console.log(y);
	return new Vector2(x, y);
}

function new_uuid(state){
	var temp_id = null;
	while(temp_id === null || temp_id in state.objects){
		temp_id = random_id(6);
	}
	return temp_id;
}

function random_id(token_length) {
	var length = token_length || 6;
	var alphabet = '0123456789abcdef';
	var token = 'o_';
	for (var i = 0; i < length; i++) {
		token += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
	}
	return token;
}


exports.initialize = function initialize(io) {

	var game_state = new State();

	var number_of_cows = 20;
	//for (var q = 0; q < number_of_cows; q++) {
	//	game_state.addObject(new_uuid(game_state), 'cow', randomLocation(game_state.bbox));
	//}


	io.on('connection', function (socket) {
		var clientID = new_uuid(game_state);
		console.log('User ' + clientID + ' connected');
		socket.emit('assign_id', {'id': clientID});
		game_state.addObject(clientID, 'player', {'x': game_state.bbox.min.x, 'y': game_state.bbox.min.y});

		socket.on('disconnect', function () {
			console.log('User ' + clientID + ' disconnected');
			game_state.removeObject(clientID);
		});


		socket.on('player_moved', function (location) {
			if(!game_state.objects[location['id']]){
				console.log("player not registered: " + location['id']);
			}else {
				//console.log(location);
				//console.log(Object.keys(game_state.objects).length);
				game_state.moveObject(location['id'], {'x': location['x'], 'y': location['y']});
				if (Object.keys(game_state.objects).length < number_of_cows) {
					//for (var q = 0; q < number_of_cows; q++) {
					game_state.addObject(new_uuid(game_state), 'cow', randomLocation(game_state.bbox));
					//}
				}
				io.emit('game_state', game_state.to_json());
			}
		});


	});


};
