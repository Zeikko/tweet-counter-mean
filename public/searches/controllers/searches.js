'use strict';

angular.module('mean.searches').controller('SearchesController', ['$scope', '$stateParams', '$location', 'Global', 'Searches',
    function($scope, $stateParams, $location, Global, Searches) {
        $scope.global = Global;

        $scope.create = function() {
            var search = new Searches({
                name: this.name,
                users: this.users,
                keywords: this.keywords
            });
            search.$save(function(response) {
                $location.path('searches/' + response._id);
            });

            this.name = '';
            this.users = '';
            this.keywords = '';
        };

        $scope.remove = function(search) {
            if (search) {
                search.$remove();

                for (var i in $scope.searches) {
                    if ($scope.searches[i] === search) {
                        $scope.searches.splice(i, 1);
                    }
                }
            } else {
                $scope.search.$remove();
                $location.path('searches');
            }
        };

        $scope.update = function() {
            var search = $scope.search;
            if (!search.updated) {
                search.updated = [];
            }
            search.updated.push(new Date().getTime());

            search.$update(function() {
                $location.path('searches/' + search._id);
            });
        };

        $scope.find = function() {
            Searches.query(function(searches) {
                $scope.searches = searches;
            });
        };

        $scope.findOne = function() {
            Searches.get({
                searchId: $stateParams.searchId
            }, function(search) {
                $scope.search = search;
            });
        };
    }
]);