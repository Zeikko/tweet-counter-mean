'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Tweet = mongoose.model('Tweet'),
    _ = require('lodash');


/**
 * Find tweet by id
 */
exports.tweet = function(req, res, next, id) {
    Tweet.load(id, function(err, tweet) {
        if (err) return next(err);
        if (!tweet) return next(new Error('Failed to load tweet ' + id));
        req.tweet = tweet;
        next();
    });
};

/**
 * Create an tweet
 */
exports.create = function(req, res) {
    var tweet = new Tweet(req.body);
    tweet.user = req.user;

    tweet.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                tweet: tweet
            });
        } else {
            res.jsonp(tweet);
        }
    });
};

/**
 * Update an tweet
 */
exports.update = function(req, res) {
    var tweet = req.tweet;

    tweet = _.extend(tweet, req.body);

    tweet.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                tweet: tweet
            });
        } else {
            res.jsonp(tweet);
        }
    });
};

/**
 * Delete an tweet
 */
exports.destroy = function(req, res) {
    var tweet = req.tweet;

    tweet.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                tweet: tweet
            });
        } else {
            res.jsonp(tweet);
        }
    });
};

/**
 * Show an tweet
 */
exports.show = function(req, res) {
    res.jsonp(req.tweet);
};

/**
 * List of Tweets
 */
exports.all = function(req, res) {
    Tweet.find().sort('-created').exec(function(err, tweets) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(tweets);
        }
    });
};
