'use strict';

angular.module('mean.system').directive('focusMe', function($timeout) {
    return {
        scope: {
            trigger: '@focusMe'
        },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if (value === "true") {
                    $timeout(function() {
                        var value = element[0].value;
                        element[0].value = '';
                        element[0].focus();
                        element[0].value = value;
                    });
                }
            });
        }
    };
});
