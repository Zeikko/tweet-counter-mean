'use strict';

// Tweets routes use tweets controller
var tweets = require('../controllers/tweets');
var authorization = require('./middlewares/authorization');

// Tweet authorization helpers
var hasAuthorization = function(req, res, next) {
	if (req.tweet.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(app) {

    app.get('/tweets', tweets.all);
    //app.post('/tweets', authorization.requiresLogin, tweets.create);
    //app.get('/tweets/:tweetId', tweets.show);
    //app.put('/tweets/:tweetId', authorization.requiresLogin, hasAuthorization, tweets.update);
    //app.del('/tweets/:tweetId', authorization.requiresLogin, hasAuthorization, tweets.destroy);

    // Finish with setting up the tweetId param
    app.param('tweetId', tweets.tweet);

};