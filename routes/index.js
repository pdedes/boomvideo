var express = require('express');
var router = express.Router();
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('G2nzjoyaFEgLbpJHi-Zslw');
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

		var address = 'http://localhost:3000/boomroom/';
		var roomNumber = '1';
		var html = '<html><head><title></title></head><body><h3><span style="font-family:arial,helvetica,sans-serif;">BoomVideo Invite</span></h3><p><span style="font-family:arial,helvetica,sans-serif;">You&#39;ve been invited to a video chat, join here: <a href="' + address + roomNumber + '">' + address + roomNumber + '</a></span></p><p><span style="font-family:arial,helvetica,sans-serif;">Sweet!</span></p></body></html>';
		var sender = 'dedes1821@gmail.com';
		// receive emails
		// build an email object for each message
		// insert object into the mandrill call
		// POST to mandrill API
		// handle response from mandrill

		// optional variables
		// 
		// var async = false;
		// var ip_pool = "Main Pool";
		// var send_at = "example send_at";

		// email:*
		var to = [{}];

		var message = {
		    "html": html,
		    "subject": "BoomVideo!",
		    "from_email": sender,
		    "from_name": "BoomVideo",
		    "to": to
		}

		// mandrill_client.messages.send({ "message": message }, function(result) {
		//     console.log(result);
		// }, function(e) {
		//     // Mandrill returns the error as an object with name and message keys
		//     console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
		// });

		res.json(message);
	});

	return router;
};













