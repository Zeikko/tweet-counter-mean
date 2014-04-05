'use strict';

angular.module('mean.system').directive('timeserieschart', function() {
    return {
        restrict: 'E',
        scope: {
            'data': '='
        },
        link: function(scope, element, attributes) {

            var chart = null,
                options = {
                    xaxis: {
                        mode: 'time'
                    }
                };

            $(element.append('<div></div>'));
            var plotContainer = $(element.children()[0]);
            plotContainer.css({
                width: element[0].clientWidth,
                height: element[0].clientHeight
            });

            scope.$watch('data', function(data) {
                console.log(data);
                if (data) {
                    if (!chart) {
                        chart = $.plot(plotContainer, data, options);
                    } else {
                        chart.setData(data);
                        chart.setupGrid();
                        chart.draw();
                    }
                }
            }, true);
        }
    };
});
