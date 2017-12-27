

exports.initialize = function initialize(io){

	var squareSize = 20;
	var boardSize = 600;
	var squaresAcross = boardSize / squareSize;

	function randomCoordinate() {
		return Math.floor((Math.random() * squaresAcross));
	}

	var number_of_cows = 20;
	var cows = [];

	var too_close = 5;

	for (var q = 0; q < number_of_cows; q++) {
		cows.push([randomCoordinate(), randomCoordinate()]);
	}


	var locations = {};

	io.on('connection', function (socket) {
		console.log('a user connected');
		var clientID;

		socket.on('disconnect', function () {
			console.log('user disconnected');
			delete locations[clientID];
		});

		socket.on('click', function (socket) {
			console.log("clicked");
			io.emit('clicked', "sdgasfd");
		});


		socket.on('player_location', function (location) {
			console.log(location);
			clientID = location['id'];
			locations[location['id']] = {'y': location['latitude'], 'x': location['longitude']};
			io.emit('locations', locations);

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


		socket.on('move', function (movement) {
			console.log(movement);
			clientID = movement['id'];
			locations[movement['id']] = {'x': movement['x'], 'y': movement['y']};
			io.emit('locations', locations);

			for(var cow in cows){
				var this_cow = cows[cow];
				var x = movement['x'];
				var y = movement['y'];
				var diff_x = Math.abs(this_cow[0] - x);
				var diff_y = Math.abs(this_cow[1] - y);
				var diff = diff_x + diff_y;
				if(diff < too_close){
					if(diff_x > diff_y){
						if(this_cow[0] > x){
							this_cow[0] = this_cow[0] + 1;
						}else{
							this_cow[0] = this_cow[0] - 1;
						}
					}else{
						if(this_cow[1] > y){
							this_cow[1] = this_cow[1] + 1;
						}else{
							this_cow[1] = this_cow[1] - 1;
						}
					}
				}
			}

			io.emit('cow_locations', cows);
		});

	});


};
