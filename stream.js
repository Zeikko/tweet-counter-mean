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
	logger = require('mean-logger'),
	async = require('async'),
	Twit = require('twit');



// Initializing system variables
var config = require('./server/config/config');
var db = mongoose.connect(config.db);

// Bootstrap Models, Dependencies, Routes and the app as an express app
var app = require('./server/config/system/bootstrap')(passport, db);

//Models
var Tweet = mongoose.model('Tweet');
var TwitterUser = mongoose.model('TwitterUser');
var Search = mongoose.model('Search');

//Twit
var twitter = new Twit({
	consumer_key: 'znAT5LmnWOtYmIBHrKMA',
	consumer_secret: '2BFM9uE4ybzU6i74V5mwknnRiv9Ln7Gbzmc9cUy8v8',
	access_token: '38498935-wVKuKvY3mdloeOwhpIcehHEtStebrGJnqm5ELqClF',
	access_token_secret: 'uGIG2ctouSROcNqCMN3xH1L846vDILVSmHUAgJB17FllA'
});

/**
 * Streaming thread
 */
var startStream = function(keywords) {
	if (typeof stream !== 'undefined') {
		stream.stop();
	}
	stream = twitter.stream('statuses/filter', {
		track: keywords.join(',')
	});

	stream.on('tweet', function(tweet) {
		console.log(tweet.entities);
		//TODO ADD ENTITIES
		async.parallel({
				//User posting
				twitterUser: function(callback) {
					TwitterUser.findOne({
						id: tweet.user.id
					}).exec(function(err, twitterUser) {
						if (!twitterUser) {
							var twitterUser = new TwitterUser(tweet.user);
							twitterUser.save();
						}
						callback(err, twitterUser._id);

					});
				},
				//User replied to
				userRepliedTo: function(callback) {
					if (!tweet.in_reply_to_user_id) {
						callback(null, null);
					} else {
						TwitterUser.findOne({
							id: tweet.in_reply_to_user_id
						}).exec(function(err, twitterUser) {
							if (!twitterUser) {
								var twitterUser = new TwitterUser(tweet.user);
								twitterUser.save();
							}
							callback(err, twitterUser._id);

						});
					}
				},
			},
			function(err, results) {
				//Tweet
				tweet.in_reply_to_user_id = results.userRepliedTo;
				tweet.user = results.twitterUser;

				//Hashtags
				var hashtags = [];
				for (i in tweet.entities.hashtags) {
					hashtags.push(tweet.entities.hashtags[i].text);
				}
				tweet.hashtags = hashtags;

				//Urls
				var urls = [];
				for (i in tweet.entities.urls) {
					urls.push(tweet.entities.urls[i].expanded_url);
				}
				tweet.urls = urls;

				//Media
				var media = [];
				for (i in tweet.entities.media) {
					media.push(tweet.entities.media[i].media_url);
				}
				tweet.media = media;

				tweet = new Tweet(tweet);
				if (typeof tweet.retweeted_status !== 'undefined') {
					Tweet.findOne({
						id: tweet.retweeted_status
					}, function(err, originalTweet) {
						if (typeof originalTweet !== 'undefined') {
							originalTweet.retweet_count++;
							originalTweet.save();
						}
					});
				} else {
					tweet.save();
				}
			});
	});
}

var updateKeywords = function(keywords) {
	Search.find().sort('-created').exec(function(err, searches) {
		if (err) {
			res.render('error', {
				status: 500
			});
		} else {
			var newKeywords = [];
			for (i in searches) {
				newKeywords.push(searches[i].keywords);
			}
			console.log(newKeywords.join(','));
			if (newKeywords != keywords) {
				keywords = newKeywords;
				startStream(keywords);
			}
		}
	});
}

var keywords = [];
var stream;

updateKeywords(keywords);
setInterval(function() {
	updateKeywords(keywords);
}, 60 * 1000);