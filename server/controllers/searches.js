'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Search = mongoose.model('Search'),
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
    var search = new Search();
    search.name = req.body.name;
    search.user = req.user;
    if (req.body.users) {
        search.users = req.body.users.split(',');
    }
    if (req.body.keywords) {
        search.keywords = req.body.keywords.split(',');
    }

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