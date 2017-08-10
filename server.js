/* USER VARIABLES */

var bulbIP = '';
var port = ;

/******************************************************/


var http = require('http');
var express = require('express');
var childProcess = require("child_process");
var bodyParser = require('body-parser');

const Bulb = require('tplink-lightbulb');
const light = new Bulb(bulbIP);

var app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());


app.use(express['static'](__dirname));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

/*scan for new bulbs*/
app.get('/light/scan', function (req, res) {
	const scan = Bulb.scan().on('light', light => {
		light.set(false).then(status => {
			scan.stop();
			res.status(200).send(status);
		});
	});
});
/*request & return current info*/
app.get('/light/info', function (req, res) {
	light.info().then(info => {
		res.status(200).send(info);
	}).catch(e => console.error(e));
});

/*turn power on/off*/
app.get('/light/power', function (req, res) {
	light.info().then(info => {
		var state = (info.light_state.on_off == 1 ? true : false);
		light.set(!state).then(status => {
			res.status(200).send(status);
		}).catch(err => {
			console.error(err);
			res.status(500).send('Oops, Something went wrong!');
		});
	});
});

/*set the light to the received mode*/
app.post('/light/mode', function (req, res) {
	if (!req.body) return res.status(500).send('Oops, Something went wrong!');
	var settings = req.body;
	light.set(true, 0, {
		"mode": settings.mode,
		"hue": parseInt(settings.hue),
		"saturation": parseInt(settings.saturation),
		"color_temp": parseInt(settings.color_temp),
		"brightness": parseInt(settings.brightness)
	}).then(status => {
		res.status(200).send(status);
	}).catch(err => {
		console.log(error);
		res.status(500).send('Oops, Something went wrong!');
	});
});

// Express route for any other unrecognised incoming requests
app.get('*', function (req, res) {
	res.status(404).send('Unrecognised API call');
});

// Express route to handle errors
app.use(function (err, req, res, next) {
	if (req.xhr) {
		res.status(500).send('Oops, Something went wrong!');
	} else {
		next(err);
	}
});
app.listen(port);
console.log('Server running at port ' + port + '.');
