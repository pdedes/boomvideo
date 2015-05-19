var express = require('express');
var router = express.Router();
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('G2nzjoyaFEgLbpJHi-Zslw');
var accountSid = 'ACcecf026102b3249f9f1d6fc93b2f6cc3'; 
var authToken = '75d8be630a484ac69be7da81b29aecc4'; 
var q = require('q');
 
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

		res.render('guest', { title: 'BoomRoom', room: room, invites: [1, 2, 3] });
	});


	/* GET home page. */
	router.get('/*', function(req, res, next) {	
	  console.log('/* route');
	  res.render('index', { title: 'BoomVideo', invites: [1, 2, 3] });
	});

	////////////////////////
	/* POST to TWILIO API */
	////////////////////////
	
	router.post('/sms', function(req, res, next) {

		console.log('sms route hit');

		var address = req.body.location.toString();
		var phonesNumbers = req.body.phones;
		var room = req.body.room;
		var body = "You've been invited to a BoomRoom @ " + address + "boomroom/"+ room;

		var smsPromises = [];

		// phonesNumbers.forEach(function(number, index) {
		// 	smsPromises[index] = client.sms.messages.create({ 
		// 		to: number,
		// 		from: "+18622518420", 
		// 		body: body
		// 	});
		// });

		// console.log("Here are the Promises: ", smsPromises[0]);

		// q.all(smsPromises)
		// 	.then(function(results) {
		// 		// console.log("smsPromises Results: ", results);
		// 		results.forEach(function(result) {
		// 			console.log("Twilio Sent: ", result.sid); 
		// 		});
		// 		res.sendStatus(200).end();
		// 	}).then(null, function(err) {
		// 		console.log("Twilio error: ", err);
		// 	});

		// For Testing Purposes
		res.sendStatus(200).end();

		// smsPromise.then(function(message) { 
		// 	// if(!err) {
		// 		console.log("Twilio Sent: ", message.sid); 
		// 		console.log("message: ", message);
		// 		res.sendStatus(200).end();
		// 	// } else {
				
		// 	// }
		// }).catch(function(err) {
		// 	console.log("Twilio error: ", err);
		// 	res.sendStatus(500).end();
		// });

	});

	//////////////////////////
	/* POST to MANDRILL API */
	//////////////////////////

	router.post('/email', function(req, res, next) {
		
		var emailAddresses = req.body.email;

		var address = req.body.location.toString();
		var roomNumber = req.body.room;
		var html = '<html><head><title></title></head><body><h3><span style="font-family:arial,helvetica,sans-serif;">BoomVideo Invite</span></h3><p><span style="font-family:arial,helvetica,sans-serif;">You&#39;ve been invited to a video chat, join here: <a href="' + address + 'boomroom/' + roomNumber + '">' + address + 'boomroom/' + roomNumber + '</a></span></p><p><span style="font-family:arial,helvetica,sans-serif;">Sweet!</span></p></body></html>';
		var sender = 'dedes1821@gmail.com';

		// Load e-mail recipients into the 'to' array of objects
		var to = [];
		emailAddresses.forEach(function(email, index) {
			to[index] = {
				email: email
			};
		});

		var message = {
		    "html": html,
		    "subject": "BoomVideo!",
		    "from_email": sender,
		    "from_name": "BoomVideo",
		    "to": to
		};

		// console.log(message);

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













