var express = require('express');
var router = express.Router();

var accountSid = 'AC8560357f48263fe15eeda62836a7cbe3'; 
var authToken = '1f78c02c844b3a9ad5414489d2248edd'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 

var counter = 0;

router.all('/', function(req, res, next) {
	console.log("Middleware Counter", counter);
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
  // console.log(req);
  res.render('index', { title: 'BoomVideo' });

});

router.post('/sms', function(req, res, next) {

	console.log('sms route hit');

	client.messages.create({ 
		to: "+12016931006", 
		from: "+15005550006", 
		body: "Invitation to the BoomRoom", 
		mediaUrl: "http://localhost:3000/boomroom/1",  
	}, function(err, message) { 
		if(!err) {
			console.log("Twilio Sent: ", message.sid); 
			console.log("message: ", message)
		} else {
			console.log("error: ", err);
		}
		res.sendStatus(200).end();
	});

});

module.exports = router;
