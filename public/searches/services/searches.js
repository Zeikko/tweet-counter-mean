'use strict';

//Searches service used for searches REST endpoint
angular.module('mean.searches').factory('Searches', ['$resource', function($resource) {
    return $resource('searches/:searchId', {
        searchId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);