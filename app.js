var express = require('express');
var helmet = require('helmet');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var session = require('express-session');
var flash = require('express-flash');
var fs = require('fs');
var url = require('url');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/cowPuncher');

var index_routes = require('./routes/index');

var app = express();

app.use(session({
	secret: 'it\'s a secret to everybody.',
	resave: false,
	saveUninitialized: true
}));

app.use(helmet());
app.use(flash());

// view engine setup
var hbs = exphbs.create({defaultLayout: 'main'
	//,helpers : handlebar_helpers
});
app.set('views', path.join(__dirname, 'views'));

app.use('/javascript', function (req, res) {
	var requestUrl = url.parse(req.url);
	var pathName = decodeURIComponent(requestUrl.pathname);
	var fileName = "./javascript/" + pathName;
	fs.readFile(fileName, function (err, data) {
		if (err)  { 
			res.writeHead(400);
		}
		else {
			//var headers = [];
			//headers['content-type'] = 'application/javascript';
			res.writeHead(200, { 'Content-Type' : 'application/javascript' });
			res.write(data);
		}
		res.end();
	});
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
hbs.getPartials();


//app.use(favicon(path.join(__dirname, 'public', 'static', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
	req.db = db;
	next();
});



app.use('/', index_routes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;

