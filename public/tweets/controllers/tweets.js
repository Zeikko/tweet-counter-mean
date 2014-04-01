'use strict';

angular.module('mean.tweets').controller('TweetsController', ['$scope', '$stateParams', '$location', 'Global', 'Tweets', function ($scope, $stateParams, $location, Global, Tweets) {
    $scope.global = Global;

    $scope.create = function() {
        var tweet = new Tweets({
            title: this.title,
            content: this.content
        });
        tweet.$save(function(response) {
            $location.path('tweets/' + response._id);
        });

        this.title = '';
        this.content = '';
    };

    $scope.remove = function(tweet) {
        if (tweet) {
            tweet.$remove();

            for (var i in $scope.tweets) {
                if ($scope.tweets[i] === tweet) {
                    $scope.tweets.splice(i, 1);
                }
            }
        }
        else {
            $scope.tweet.$remove();
            $location.path('tweets');
        }
    };

    $scope.update = function() {
        var tweet = $scope.tweet;
        if (!tweet.updated) {
            tweet.updated = [];
        }
        tweet.updated.push(new Date().getTime());

        tweet.$update(function() {
            $location.path('tweets/' + tweet._id);
        });
    };

    $scope.find = function() {
        Tweets.query(function(tweets) {
            $scope.tweets = tweets;
        });
    };

    $scope.findOne = function() {
        Tweets.get({
            tweetId: $stateParams.tweetId
        }, function(tweet) {
            $scope.tweet = tweet;
        });
    };
}]);