'use strict';

//Setting up route
angular.module('mean.tweets').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        //================================================
        // Check if the user is connected
        //================================================
        var checkLoggedin = function($q, $timeout, $http, $location) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0')
                    $timeout(deferred.resolve, 0);

                // Not Authenticated
                else {
                    $timeout(function() {
                        deferred.reject();
                    }, 0);
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };
        //================================================
        // Check if the user is not conntect
        //================================================
        var checkLoggedOut = function($q, $timeout, $http, $location) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0') {
                    $timeout(function() {
                        deferred.reject();
                    }, 0);
                    $location.url('/login');

                }

                // Not Authenticated
                else {
                    $timeout(deferred.resolve, 0);

                }
            });

            return deferred.promise;
        };
        //================================================


        // states for my app
        $stateProvider
            .state('all tweets', {
                url: '/tweets',
                templateUrl: 'public/tweets/views/index.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('create tweet', {
                url: '/tweets/create',
                templateUrl: 'public/tweets/views/create.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('edit tweet', {
                url: '/tweets/:tweetId/edit',
                templateUrl: 'public/tweets/views/edit.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('tweet by id', {
                url: '/tweets/:tweetId',
                templateUrl: 'public/tweets/views/view.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
    }
])