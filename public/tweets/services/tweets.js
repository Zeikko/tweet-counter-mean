'use strict';

//Articles service used for tweets REST endpoint
angular.module('mean.tweets').factory('Tweets', ['$resource', function($resource) {
    return $resource('tweets/:tweetId', {
        tweetId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);