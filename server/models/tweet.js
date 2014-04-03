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
    created_at: Date,
    id: Number,
    text: String,
    in_reply_to_status_id: Number,
    in_reply_to_user_id: {
        type: Schema.ObjectId,
        ref: 'TwitterUser'
    },
    retweet_count: Number,
    favorite_count: Number,
    user: {
        type: Schema.ObjectId,
        ref: 'TwitterUser'
    },
    hashtags: [String],
    urls: [String],
    media: [String],
    lang: String
});

mongoose.model('Tweet', TweetSchema);
