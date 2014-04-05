'use strict';

angular.module('mean.searches').controller('SearchesController', ['$scope', '$stateParams', '$location', 'Global', 'Searches', 'TweetCount',
    function($scope, $stateParams, $location, Global, Searches, TweetCount) {
        $scope.global = Global;

        $scope.create = function() {
            var search = new Searches({
                name: this.name,
                users: this.users,
                hashtags: this.hashtags
            });
            search.$save(function(response) {
                $location.path('searches/' + response._id);
            });

            this.name = '';
            this.users = '';
            this.hashtags = '';
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
                $scope.hashtags = search.hashtags;
                $scope.users = search.users;
            });
            TweetCount.get({
                searchId: $stateParams.searchId
            }, function(tweetCount) {
                //TODO Move to somewhere else
                var serie = {
                    label: 'Tweets',
                    data: []
                };
                console.log(tweetCount.history);
                for (var i in tweetCount.history) {
                    console.log(tweetCount.history[i].time);
                    console.log(moment(tweetCount.history[i].time).valueOf())
                    serie.data.push([
                        moment(tweetCount.history[i].time).valueOf(),
                        tweetCount.history[i].value
                    ]);
                };
                tweetCount.history = [serie];

                $scope.tweetCount = tweetCount;
            })
        };

        $scope.hashtags = [];
        $scope.updateHashtagFields = function() {
            if ($scope.newHashtag) {
                $scope.hashtags.push($scope.newHashtag);
                $scope.newHashtag = '';
            }
            for (var i in $scope.hashtags) {
                if ($scope.hashtags[i].length === 0) {
                    $scope.hashtags.splice([i]);
                }
            }
        }

        $scope.users = [];
        $scope.updateUserFields = function() {
            if ($scope.newUser) {
                $scope.users.push($scope.newUser);
                $scope.newUser = '';
            }
            for (var i in $scope.users) {
                if ($scope.users[i].length === 0) {
                    $scope.users.splice([i]);
                }
            }
        }

    }
]);
