'use strict';

//Searches service used for searches REST endpoint
angular.module('mean.searches').factory('TweetCount', ['$resource', function($resource) {
    return $resource('searches/:searchId/tweetcount', {
        searchId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);