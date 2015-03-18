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

        var captcha_token = null,
            room_id = null,
            listen_url = null;

        return {
            getCategories: function() {
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
            },

            getSubCategories: function(id) {
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
            },

            getRooms: function(id) {
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
            },

            getCaptcha: function(id) {
                var def = $q.defer();
                if(!id) id = room_id;
                $http.get('http://bpbol.uol.com.br/goroom.html?nodeid=' + id)
                    .success(function(data) {
                        room_id = id;
                        captcha_token = data.match(/http:\/\/bpbol.captcha.uol.com.br\/([^\x22]+).jpg/)[1];
                        def.resolve(captcha_token);
                    })
                    .error(function() {
                        def.reject("Failed to get captcha");
                    });
                return def.promise;
            },

            postCaptcha: function(captcha_text) {
                var def = $q.defer(),
                    _this = this;
                $http({
                        method: 'POST',
                        url: 'http://bp2.bpbol.uol.com.br/room.html ',
                        data: this.serializeData({
                            nodeid: room_id,
                            mode: 'message',
                            th: 'bp2.bpbol.uol.com.br',
                            typePage: 'ROOM',
                            text: captcha_text,
                            key: captcha_token,
                            ni: 'Targa',
                            co: '#000000',
                            x: '12',
                            y: '11'
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                    .success(function(data) {
                        if(error = data.match(/top.location.replace.\x27.+goroom.html\?erro=(\d+)/))
                            return def.reject(_this.ErrorMensagem(error[1]));
                        listen_url = data.match(/listenURL\s=\s\x27([^\x27]+)/)[1];
                        def.resolve(listen_url);
                    })
                    .error(function() {
                        def.reject("Failed to post captcha");
                    });
                return def.promise;
            },
            getListen: function(){
                return listen_url;
            },
            serializeData: function(data) {
                if (!angular.isObject(data)) {
                    return ((data == null) ? "" : data.toString());
                }
                var buffer = [];
                for (var name in data) {
                    if (!data.hasOwnProperty(name)) {
                        continue;
                    }
                    var value = data[name];
                    buffer.push(encodeURIComponent(name) + "=" + encodeURIComponent((value == null) ? "" : value));
                }
                var source = buffer.join("&").replace(/%20/g, "+");
                return (source);
            },
            ErrorMensagem: function(n) {
                n = parseInt(n);
                switch (n) {
                    case 2:
                        var ErrorMsg = 'Apelido inválido para esta sala';
                        break;
                    case 3:
                        var ErrorMsg = 'Acesso negado';
                        break;
                    case 4:
                        var ErrorMsg = 'Não há lugares disponíveis na sala';
                        break;
                    case 5:
                        var ErrorMsg = 'As salas só podem ser criadas por usuários cadastrados no BOL';
                        break;
                    case 6:
                        var ErrorMsg = 'É possível criar apenas uma sala por e-mail';
                        break;
                    case 7:
                        var ErrorMsg = 'Não foi possível criar sala';
                        break;
                    case 8:
                        var ErrorMsg = 'O nome escolhido para a sala é inválido';
                        break;
                    case 9:
                        var ErrorMsg = 'Sala inválida';
                        break;
                    case 10:
                        var ErrorMsg = 'Sala inativa';
                        break;
                    case 11:
                        var ErrorMsg = 'Sala não encontrada';
                        break;
                    case 12:
                        var ErrorMsg = 'Este apelido já está sendo usado.';
                        break;
                    case 13:
                        var ErrorMsg = 'A sala que você escolheu está cheia';
                        break;
                    case 14:
                        var ErrorMsg = 'Usuário inválido';
                        break;
                    case 16:
                        var ErrorMsg = 'A palavra foi digitada incorretamente. Tente novamente.';
                        break;
                    default:
                        var ErrorMsg = 'Ocorreu um erro!';
                        break;
                }
                console.log('Error retornado:' + ErrorMsg);
                return ErrorMsg;
            }
        }
    });
