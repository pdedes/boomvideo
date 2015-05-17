var express = require('express');
var router = express.Router();
var accountSid = 'ACcecf026102b3249f9f1d6fc93b2f6cc3'; 
var authToken = '75d8be630a484ac69be7da81b29aecc4'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 

module.exports = function(io) {

	var counter = 0;

	router.all('/', function(req, res, next) {
		console.log("Room Counter", counter);
		counter += 1;
		next();
	});

	router.get('/counter', function(req, res, next) {
		res.json(counter);
	});

	router.get('/boomroom/:id', function(req, res, next) {
		var room = req.params.id;
		console.log('Room ID: ', room);

		res.render('guest', { title: 'BoomRoom', room: room });
	});


	/* GET home page. */
	router.get('/*', function(req, res, next) {	
	  console.log('/* route');
	  res.render('index', { title: 'BoomVideo', invites: [1, 2, 3, 4] });
	});

	router.post('/sms', function(req, res, next) {

		console.log('sms route hit');

		console.log('phones: ', req.body);

		client.sms.messages.create({ 
			to: "+12016931006", 
			from: "+18622518420", 
			body: "You've been invited to a BoomRoom @ http://localhost:3000/boomroom/1"
		}, function(err, message) { 
			if(!err) {
				console.log("Twilio Sent: ", message.sid); 
				console.log("message: ", message);
				res.sendStatus(200).end();
			} else {
				console.log("Twilio error: ", err);
			}
		});
	});

	router.post('/email', function(req, res, next) {
		console.log('email: ', req.body);
		res.status(200).end();
	});

	return router;
};













