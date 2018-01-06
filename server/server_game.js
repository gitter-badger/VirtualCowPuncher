var State = require("../client/javascript/common/game-state");
var Player = require("../client/javascript/common/objects/player");
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

exports.initialize = function initialize(io) {

	var game_state = new State();
	var game_logic = new GameLogic(); // doesn't need to be an object. All state will go in game state

	var number_of_cows = 20;
	//for (var q = 0; q < number_of_cows; q++) {
	//	game_state.addObject(new_uuid(game_state), 'cow', randomLocation(game_state.bbox));
	//}


	io.on('connection', function (socket) {
		
		var player = new Player();
		player.setPosition(game_state.bbox.min);
		game_state.addObject(player);
		var clientID = player.id;
		console.log('User ' + clientID + ' connected');
		socket.emit('assign_id', { 'id': clientID });

		socket.on('disconnect', function () {
			console.log('User ' + clientID + ' disconnected');
			game_state.removeObject(clientID);
		});

		socket.on('player_moved', function (location) {
			if (!game_state.objects[location.id]) {
				console.log("player not registered: " + location.id);
			} else {
				//console.log(location);
				//console.log(Object.keys(game_state.objects).length);
				var vectorLocation = new Vector2(location.x, location.y);
				game_state.bbox.addCircle(vectorLocation, 5 /* radius */);
				game_state.moveObject(location.id, vectorLocation);
				if (Object.keys(game_state.objects).length < number_of_cows) {
					for (var q = 0; q < number_of_cows; q++) {
						var newCow = new Cow();
						newCow.setPosition(randomLocation(game_state.bbox));
						game_state.addObject(newCow);
					}
				}
				game_logic.update(game_state);
				io.emit('game_state', game_state.toJSON());
			}
		});

		socket.on('add_game_bound', function (saveObj /* Vector2 */) {
			bound = Vector2.read(saveObj);
			game_state.addGameBound(bound);
			console.log("bound added: " + bound.toString());
			io.emit('game_state', game_state.toJSON());
		});

		socket.on('add_test_points', function () {
			//game_state.
		
		});

	});


};
