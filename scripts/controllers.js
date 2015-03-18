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

            function Sort_CI(a, b) {
                return (a.toUpperCase() > b.toUpperCase()) ? -1 : 1;
            }

            xhr.onreadystatechange = function() {
                if (xhr.status == 200 && xhr.readyState >= 3) {
                    buffer = xhr.responseText.substr(len, xhr.responseText.length - len);
                    len = xhr.responseText.length;
                    if (!msgToken && /Batepapo.query_str/.test(buffer)) {
                        msgtoken = buffer.match(/Batepapo.query_str\s=\s\x22([^\x22]+)/)[1];
                        buffer = '';
                    }
                    if (/<div class=\x22msgContentBox/.test(buffer)) {
                        //parse message
                    }
                    if (/Load_Combo.\x22re/.test(buffer)) {
                        var lista = buffer.match(/Load_Combo.\x22re\x22,\s\x22([^\x22]+)/)[1];
                        $scope.$apply(function() {
                            $scope.users = lista.split(">").concat().sort(Sort_CI).concat(["Todos"]).reverse();
                        })
                    }
                    buffer = '';
                }
            };

            xhr.open('GET', BOL.getListen(), true);
            xhr.send();

        }
    ])
