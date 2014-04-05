'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Search = mongoose.model('Search'),
    Tweet = mongoose.model('Tweet'),
    _ = require('lodash');


/**
 * Find search by id
 */
exports.search = function(req, res, next, id) {
    Search.load(id, function(err, search) {
        if (err) return next(err);
        if (!search) return next(new Error('Failed to load search ' + id));
        req.search = search;
        next();
    });
};

/**
 * Create an search
 */
exports.create = function(req, res) {
    var search = new Search(req.body);
    search.user = req.user;
    search.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                search: search
            });
        } else {
            res.jsonp(search);
        }
    });
};

/**
 * Update an search
 */
exports.update = function(req, res) {
    var search = req.search;

    search = _.extend(search, req.body);

    search.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                search: search
            });
        } else {
            res.jsonp(search);
        }
    });
};

/**
 * Delete an search
 */
exports.destroy = function(req, res) {
    var search = req.search;

    search.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                search: search
            });
        } else {
            res.jsonp(search);
        }
    });
};

/**
 * Show an search
 */
exports.show = function(req, res) {
    res.jsonp(req.search);
};

/**
 * List of Searchs
 */
exports.all = function(req, res) {
    Search.find().sort('-created').exec(function(err, searchs) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(searchs);
        }
    });
};

/**
 * All tweets of search
 */
exports.tweets = function(req, res) {
    Tweet.find({
        hashtags: {
            $in: req.search.hashtags
        }
    }).exec(function(err, tweets) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(tweets);
        }
    });
};

/**
 * All tweets of search
 */
exports.tweetCount = function(req, res) {
    Tweet.mapReduce({
        query: {
            hashtags: {
                $in: req.search.hashtags,
            },
        },
        map: function() {
            this.created_at.setMinutes(0);
            this.created_at.setSeconds(0);
            emit(this.created_at, 1);
        },
        reduce: function(key, values) {
            return Array.sum(values);
        }
    }, function(err, tweetCounts) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            if (tweetCounts.length == 0) {
                var time = req.search.created;
            } else {
                var time = new Date(tweetCounts[0]._id.getTime());
            }
            var finalTweetCounts = [];
            var tickLength = 60 * 60 * 1000;
            var i = 0;
            var endTime = new Date();
            endTime.setMinutes(0);
            endTime.setMilliseconds(0);

            while (time < endTime) {
                if (typeof tweetCounts[i] !== 'undefined' && time.getTime() == tweetCounts[i]._id.getTime()) {
                    finalTweetCounts.push({
                        time: tweetCounts[i]._id,
                        value: tweetCounts[i].value
                    });
                    i++;
                } else {
                    finalTweetCounts.push({
                        time: new Date(time.getTime()),
                        value: 0
                    });
                }
                time.setHours(time.getHours() + 1);
            }
            res.jsonp({
                history: finalTweetCounts
            });
        }
    });
};
