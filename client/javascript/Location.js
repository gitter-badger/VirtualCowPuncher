// Copywrite VCP 2017
// Location.js
// - Functionality for recieving location information from the system.  May be GPS or something less accurate.

function Location (updatesPerSec, callback /* function */)  {
	this.updatesPerSec = updatesPerSec;
	this.callback = callback;

	var self = this;
	this.timerID = setInterval(function () { self.onGPSTimer(); }, 1000 / updatesPerSec);
}
