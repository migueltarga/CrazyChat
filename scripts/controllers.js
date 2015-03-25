angular.module('CrazyChat.controllers', [])
    .controller('conectorCtrl', ['$scope', 'BOL', '$modal', '$location',
        function($scope, BOL, $modal, $location) {

            BOL.getCategories().then(function(cat) {
                $scope.categories = cat;
            })

            $scope.updateSubcategory = function() {
                BOL.getSubCategories($scope.category).then(function(subCategories) {
                    $scope.subCategories = subCategories;
                })
            }

            $scope.updateRooms = function() {
                BOL.getRooms($scope.subcategory).then(function(rooms) {
                    $scope.rooms = rooms;
                })
            }

            $scope.enterRoom = function(room) {
                BOL.getCaptcha(room.id).then(function(result) {
                    var modal = $modal.open({
                        templateUrl: 'views/modal_captcha.html',
                        size: 'sm',
                        backdrop: 'static',
                        controller: 'captchaCtrl',
                        resolve: {
                            token: function() {
                                return result;
                            }
                        }
                    });
                    modal.result.then(function(result) {
                        $location.path("/room");
                    });
                })
            }
        }
    ])
    .controller('captchaCtrl', ['$scope', '$modalInstance', '$sce', 'token', 'BOL',
        function($scope, $modalInstance, $sce, token, BOL) {
            $scope.error = false;
            $scope.captcha = $sce.trustAsResourceUrl('http://bpbol.captcha.uol.com.br/' + token + '.jpg');
            $scope.closeAlert = function() {
                $scope.error = false;
            }
            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
            $scope.submit = function() {
                $scope.error = false;
                if (!$scope.text_captcha) {
                    $scope.error = 'Digite o que você vê na imagem a cima.'
                    return;
                }
                BOL.postCaptcha($scope.text_captcha).then(function(result) {
                    $modalInstance.close(true);
                }, function(error) {
                    $scope.error = error;
                });
                //$modalInstance.close($scope.text_captcha);
            };
        }
    ])
    .controller('roomCtrl', ['$scope', 'BOL',
        function($scope, BOL) {
            var xhr = new XMLHttpRequest(),
                len = 0,
                msgToken = false;

            $scope.nick = BOL.getNick();

            $scope.users = [];
            $scope.messages = [];

            $scope.sendMsg = function(){
                console.log('Cliquei', msgToken);
                if(!msgToken) return;
                BOL.sendMessage(msgToken, 'Testando');
            }

            function Sort_CI(a, b) {
                return (a.toUpperCase() > b.toUpperCase()) ? -1 : 1;
            }

            xhr.onreadystatechange = function() {
                console.log(xhr.status, xhr.readyState);
                if (xhr.status == 200 && xhr.readyState >= 3) {
                    buffer = xhr.responseText.substr(len, xhr.responseText.length - len);
                    len = xhr.responseText.length;

                    if (!msgToken && /Batepapo.query_str/.test(buffer)) {
                        msgToken = buffer.match(/Batepapo.query_str\s=\s\x22([^\x22]+)/)[1];
                        buffer = '';
                    }
                    if (/<div class=\x22msgContentBox/.test(buffer)) {

                        var msg = buffer.match(/(tsPerfilBP,'([^\x27]+)'\);[\r\n\s]+<\/script>[\r\n\s]+)?<small>([^<]+)<\/small>\n.+color="(#[A-Fa-f\d]{6})">([^<]+).+[\r\n\s]+(<em>([^<]+)<\/em>[\r\n\s]+)?<i>([^<]+)<\/i>[\r\n\s]+(<b>([^<]+)<\/b>)?[\r\n\s]+([^<]+)(<img src="([^\x22]+))?/);
                        if(msg){
                            $scope.messages.push({
                                type: (msg[7]) ? 'join' : 'msg',
                                uolk: (msg[2]) ? 'http://'+msg[2]+'.avataruol.com.br/thumb_avatar.jpg' : '',
                                time : msg[3],
                                color : msg[4],
                                sender: msg[5],
                                pvt: (msg[7]) ? true : false,
                                action: (msg[8]) ? msg[8] : '',
                                receiver: (msg[10]) ? msg[10] : '',
                                message : (msg[11]) ? msg[11].trim() : '',
                                icon: (msg[12]) ? msg[12] : ''
                            });
                        }
                    }
                    if (/Load_Combo.\x22re/.test(buffer)) {
                        var lista = buffer.match(/Load_Combo.\x22re\x22,\s\x22([^\x22]+)/)[1];
                        $scope.$apply(function() {
                            $scope.users = lista.split(">").concat().sort(Sort_CI).concat(["Todos"]).reverse();
                        })
                    }
                    buffer = '';
                }else if (xhr.readyState == 4) {
                    if(error = xhr.responseText.match(/top.location.replace.\x27.+goroom.html\?erro=(\d+)/))
                        alert(BOL.ErrorMensagem(error));
                    console.log('DESCONECTOU');
                }
            };
            xhr.open('GET', BOL.getListen(), true);
            xhr.send();
        }
    ])
