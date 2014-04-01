/**
 *  Mean container for dependency injection
 */
var mean = require('meanio');
mean.app('Mean Demo App', {});

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	passport = require('passport'),
	logger = require('mean-logger');

/**
 * Streaming thread
 */

// Initializing system variables
var config = require('./server/config/config');
var db = mongoose.connect(config.db);

// Bootstrap Models, Dependencies, Routes and the app as an express app
var app = require('./server/config/system/bootstrap')(passport, db);

var Tweet = mongoose.model('Tweet');

var Twit = require('twit');

var twitter = new Twit({
	consumer_key: 'znAT5LmnWOtYmIBHrKMA',
	consumer_secret: '2BFM9uE4ybzU6i74V5mwknnRiv9Ln7Gbzmc9cUy8v8',
	access_token: '38498935-wVKuKvY3mdloeOwhpIcehHEtStebrGJnqm5ELqClF',
	access_token_secret: 'uGIG2ctouSROcNqCMN3xH1L846vDILVSmHUAgJB17FllA'
});

var Search = mongoose.model('Search');

Search.find().sort('-created').exec(function(err, searches) {
	if (err) {
		res.render('error', {
			status: 500
		});
	} else {
		var keywords = [];
		for (i in searches) {
			keywords.push(searches[i].keywords);
		}
		console.log(keywords.join(','));
		var stream = twitter.stream('statuses/filter', {
			track: keywords.join(',')
		})

		stream.on('tweet', function(tweet) {
			console.log(tweet)
			var tweet = new Tweet(tweet);
			tweet.save();
		})
	}
});