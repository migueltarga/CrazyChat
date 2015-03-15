angular.module('CrazyChat', [
    'ngRoute',
    'ui.bootstrap',
    'CrazyChat.controllers',
    'CrazyChat.services',
    'CrazyChat.directives'
]).
config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'conectorCtrl'
            })
            .when('/room', {
                templateUrl: 'views/room.html',
                controller: 'roomCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    },

]);
RegExp.prototype.execAll = function(string) {
    var matches = [];
    var match = null;
    while ((match = this.exec(string)) != null) {
        var matchArray = [];
        for (var i in match) {
            if (parseInt(i) == i) {
                matchArray.push(match[i]);
            }
        }
        matches.push(matchArray);
    }
    return matches;
}
