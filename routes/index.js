var express = require('express');
var router = express.Router();
// var comm = require('/javascripts/ice');

var counter = 0;

router.all('/', function(req, res, next) {
	console.log("Middleware Counter", counter);
	counter += 1;
	next();
});

/* GET home page. */
router.get('/*', function(req, res, next) {
  // console.log(req);
  res.render('index', { title: 'BoomVideo' });
});

module.exports = router;
