'use strict';

// Tweets routes use searches controller
var searches = require('../controllers/searches');
var authorization = require('./middlewares/authorization');

// Tweet authorization helpers
var hasAuthorization = function(req, res, next) {
	if (req.search.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(app) {

    app.get('/searches', searches.all);
    app.post('/searches', authorization.requiresLogin, searches.create);
    app.get('/searches/:searchId', searches.show);
    app.put('/searches/:searchId', authorization.requiresLogin, hasAuthorization, searches.update);
    app.del('/searches/:searchId', authorization.requiresLogin, hasAuthorization, searches.destroy);

    // Finish with setting up the searchId param
    app.param('searchId', searches.search);

};