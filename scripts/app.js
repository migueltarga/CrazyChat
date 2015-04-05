angular.module('CrazyChat', [
    'ngRoute',
    'ui.bootstrap',
    'luegg.directives',
    'CrazyChat.controllers',
    'CrazyChat.services',
    'CrazyChat.directives'
]).
config(['$compileProvider', '$routeProvider', function($compileProvider, $routeProvider) {
        var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
        newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0, -1) + '|chrome-extension:|filesystem:chrome-extension:|blob:chrome-extension%3A' + currentImgSrcSanitizationWhitelist.toString().slice(-1);
        $compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);

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
