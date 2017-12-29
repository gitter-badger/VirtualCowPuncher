var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.redirect('/cowPuncher');
});

router.get('/cowPuncher', function (req, res) {
	res.render("home", {"message": "Cow Puncher!!"});
});

router.get('/gps', function (req, res) {
	res.render("gps", {"message": "GPS Test!"});
});

router.get('/admin', function (req, res) {
	res.render("admin", {"message": "Cowpuncher admin page!"});
});

module.exports = router;
