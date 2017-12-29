

var socket = io();
var players = {};
var cow_locations = [];

socket.on("locations", function(locations){
	console.log(locations);
	players = locations;
	render();
});

socket.on("cow_locations", function(c_locations){
	console.log(c_locations);
	cow_locations = c_locations;
	render();
});


var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var squareSize = 20;
var boardSize = 600;
var squaresAcross = boardSize / squareSize;


var x = randomCoordinate();
var y = randomCoordinate();

var id = Math.round(Math.random() * 1000000);
console.log(id);

render();

function randomCoordinate() {
	return Math.floor((Math.random() * squaresAcross));
}

function myKeyPress(e) {
	var keynum;

	if (window.event) { // IE
		keynum = e.keyCode;
	} else if (e.which) { // Netscape/Firefox/Opera
		keynum = e.which;
	}

	var input = String.fromCharCode(keynum);


	if (input == "w") {
		y--;
	} else if (input == "a") {
		x--;
	} else if (input == "s") {
		y++;
	} else if (input == "d") {
		x++;
	}

	socket.emit("move", {"id": id, "x": x, "y": y});

	render();


}

function render() {
	for (var i = 0; i < 50; i++) {
		for (var j = 0; j < 50; j++) {
			if ((i % 2 == 0 && j % 2 == 1) || (i % 2 == 1 && j % 2 == 0)) {
				ctx.fillStyle = "grey";
				ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
			} else {
				ctx.fillStyle = "white";
				ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
			}
		}
	}

	ctx.fillStyle = "#ff9900";
	for (var i3 in players) {
		if(parseInt(i3) === id){
			continue;
		}
		ctx.beginPath();
		ctx.arc((players[i3]['x'] + 0.5) * (squareSize), (players[i3]['y'] + 0.5) * (squareSize), squareSize / 2, 0, 2 * Math.PI);
		ctx.fill();
	}

	ctx.fillStyle = "green";
	for (var i4 = 0; i4 < cow_locations.length; i4++) {
		ctx.fillRect(cow_locations[i4][0] * squareSize, cow_locations[i4][1] * squareSize, squareSize, squareSize);
	}


	ctx.beginPath();
	ctx.arc((x + 0.5) * (squareSize), (y + 0.5) * (squareSize), squareSize / 2, 0, 2 * Math.PI);
	ctx.fillStyle = "blue";
	ctx.fill();

}