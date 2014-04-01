'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Tweet Schema
 */
var TweetSchema = new Schema({
    created_at: {
        type: Date,
    },
    id: {
        type: String,
    },
    text: {
        type: String,
    }
});

mongoose.model('Tweet', TweetSchema);
