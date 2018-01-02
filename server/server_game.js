var State = require("../client/javascript/common/game-state");
//var Cow = require("../client/javascript/common/objects/cow");

exports.initialize = function initialize(io){
	//
	//var squareSize = 20;
	//var boardSize = 600;
	//var squaresAcross = boardSize / squareSize;
	//
	//function randomCoordinate() {
	//	return Math.floor((Math.random() * squaresAcross));
	//}

	var game_state = new State();

	//var number_of_cows = 20;
	//var cows = [];
	//var too_close = 5;
	//for (var q = 0; q < number_of_cows; q++) {
	//	cows.push([randomCoordinate(), randomCoordinate()]);
	//}
	//var locations = {};

	io.on('connection', function (socket) {
		console.log('a user connected');
		var clientID = Math.round(Math.random() * 1000000); // TODO: Change this to be unique
		socket.emit('assign_id', {'id':clientID});

		game_state.addObject(clientID, 'player');

		socket.on('disconnect', function () {
			console.log('user disconnected');
			game_state.removeObject(clientID);
		});


		socket.on('player_moved', function (location) {
			//this.socket.emit("player_moved", {'id': this.my_id, 'x': pos.x, 'y': pos.y});
			console.log("player_moved: ");
			console.log(location);
			//clientID = location['id'];

			game_state.moveObject(location['id'], {'x':location['x'], 'y':location['y']});
			//locations[location['id']] = {'y': location['x'], 'x': location['y']};
			//io.emit('locations', locations);

			console.log("state: ");
			console.log(game_state);

			io.emit('game_state', game_state.to_json());

			//for(var cow in cows){
			//	var this_cow = cows[cow];
			//	var x = movement['x'];
			//	var y = movement['y'];
			//	var diff_x = Math.abs(this_cow[0] - x);
			//	var diff_y = Math.abs(this_cow[1] - y);
			//	var diff = diff_x + diff_y;
			//	if(diff < too_close){
			//		if(diff_x > diff_y){
			//			if(this_cow[0] > x){
			//				this_cow[0] = this_cow[0] + 1;
			//			}else{
			//				this_cow[0] = this_cow[0] - 1;
			//			}
			//		}else{
			//			if(this_cow[1] > y){
			//				this_cow[1] = this_cow[1] + 1;
			//			}else{
			//				this_cow[1] = this_cow[1] - 1;
			//			}
			//		}
			//	}
			//io.emit('cow_locations', cows);
		});


		//socket.on('move', function (movement) {
		//	console.log(movement);
		//	clientID = movement['id'];
		//	locations[movement['id']] = {'x': movement['x'], 'y': movement['y']};
		//	io.emit('locations', locations);
		//
		//	for(var cow in cows){
		//		var this_cow = cows[cow];
		//		var x = movement['x'];
		//		var y = movement['y'];
		//		var diff_x = Math.abs(this_cow[0] - x);
		//		var diff_y = Math.abs(this_cow[1] - y);
		//		var diff = diff_x + diff_y;
		//		if(diff < too_close){
		//			if(diff_x > diff_y){
		//				if(this_cow[0] > x){
		//					this_cow[0] = this_cow[0] + 1;
		//				}else{
		//					this_cow[0] = this_cow[0] - 1;
		//				}
		//			}else{
		//				if(this_cow[1] > y){
		//					this_cow[1] = this_cow[1] + 1;
		//				}else{
		//					this_cow[1] = this_cow[1] - 1;
		//				}
		//			}
		//		}
		//	}
		//
		//	io.emit('cow_locations', cows);
		//
		//
		//});

	});


};
