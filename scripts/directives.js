'use strict';

/* Directives */


angular.module('CrazyChat.directives', [])
    .directive('cspSrc', ['imageLoader', function(imageLoader) {
        return {
            restrict: 'A',
            priority: 99,
            scope: {
                cspSrc: '@cspSrc'
            },
            link: function(scope, element, attributes) {
                scope.$watch('cspSrc', function(newValue) {
                    if (newValue !== undefined) {
                        imageLoader.load(newValue).then(function(blob) {
                            attributes.$set('src', blob);
                        });
                    }
                });
                scope.$on('$destroy', function() {
                    imageLoader.unload(attributes['src']);
                });
            }
        };
    }]);
