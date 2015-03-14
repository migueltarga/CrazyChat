angular.module('CrazyChat.services', [])
    .factory('imageLoader', ['$http', function($http) {
        return {
            load: function(url) {
                return $http.get(url, {
                    cache: true,
                    responseType: 'blob'
                }).then(function(response) {
                    return URL.createObjectURL(response.data);
                });
            },

            unload: function(blob) {
                blob && URL.revokeObjectURL(blob);
            }
        };
    }])
    .factory('BOL', function($http, $q) {

        var chatAPI = {};
        var lastCaptcha = '';

        chatAPI.getCategories = function() {
            var def = $q.defer();
            $http.get('http://bpbol.uol.com.br/')
                .success(function(data) {
                    var sub = /bpb_menu[\d]{1,2}&u=http:\/\/bpbol.uol.com.br\/bytheme.html\?nodeid=(\d+)\x22>([^<]+)/g.execAll(data);
                    var result = [];
                    angular.forEach(sub, function(value, key) {
                        result.push({
                            id: value[1],
                            name: value[2]
                        })
                    });
                    def.resolve(result);
                })
                .error(function() {
                    def.reject("Failed to get categries");
                });
            return def.promise;
        }

        chatAPI.getSubCategories = function(id) {
            var def = $q.defer();
            $http.get('http://bpbol.uol.com.br/bytheme.html?nodeid=' + id)
                .success(function(data) {
                    var sub = /\x22http:\/\/bpbol.uol.com.br\/bytheme.html\?nodeid=(\d+)\x22>([^<]+)/g.execAll(data);
                    var result = [];
                    angular.forEach(sub, function(value, key) {
                        result.push({
                            id: value[1],
                            name: value[2]
                        })
                    });
                    def.resolve(result);
                })
                .error(function() {
                    def.reject("Failed to get subcategries");
                });
            return def.promise;
        }

        chatAPI.getRooms = function(id) {
            var def = $q.defer();
            $http.get('http://bpbol.uol.com.br/bytheme.html?nodeid=' + id)
                .success(function(data) {
                    var sub = /goroom.html\?nodeid=(\d+)">([^<]+)(.+[\r\n]){3}.+<td>(\d+)/g.execAll(data);
                    var result = [];
                    angular.forEach(sub, function(value, key) {
                        result.push({
                            id: value[1],
                            name: value[2],
                            people: value[4]
                        })
                    });
                    def.resolve(result);
                })
                .error(function() {
                    def.reject("Failed to get rooms");
                });
            return def.promise;
        }

        chatAPI.getCaptcha = function(id) {
            var def = $q.defer();
            $http.get('http://bpbol.uol.com.br/goroom.html?nodeid=' + id)
                .success(function(data) {
                    lastCaptcha = data.match(/http:\/\/bpbol.captcha.uol.com.br\/([^\x22]+).jpg/)[1];
                    def.resolve(lastCaptcha);
                })
                .error(function() {
                    def.reject("Failed to get rooms");
                });
            return def.promise;
        }
        return chatAPI;
    });
