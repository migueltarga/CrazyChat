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
    }])
    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter, {
                            'event': event
                        });
                    });
                    event.preventDefault();
                }
            });
        };
    })
    .directive('focusMe', function($timeout) {
        return {
            link: function(scope, element, attrs, model) {
                $timeout(function() {
                    element[0].focus();
                });
            }
        };
    });
