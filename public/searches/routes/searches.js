'use strict';

//Setting up route
angular.module('mean.searches').config(['$stateProvider', '$urlRouterProvider',
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
            .state('all searches', {
                url: '/searches',
                templateUrl: 'public/searches/views/list.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('create search', {
                url: '/searches/create',
                templateUrl: 'public/searches/views/create.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('edit search', {
                url: '/searches/:searchId/edit',
                templateUrl: 'public/searches/views/edit.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('search by id', {
                url: '/searches/:searchId',
                templateUrl: 'public/searches/views/view.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
    }
])