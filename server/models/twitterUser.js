'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * TwitterUser Schema
 */
var TwitterUserSchema = new Schema({
    id: Number,
    name: String,
    screen_name: String,
    location: String,
    description: String,
    followers_count: Number,
    friends_count: Number,
    listed_count: Number,
    profile_image_url: String
});

mongoose.model('TwitterUser', TwitterUserSchema);
