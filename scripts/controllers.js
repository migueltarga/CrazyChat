angular.module('CrazyChat.controllers', [])
    .controller('conectorCtrl', ['$scope', 'BOL', '$modal',
        function($scope, BOL, $modal) {

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
                    modal.result.then(function(user) {

                    }, function() {

                    });
                })
            }
        }
    ])
    .controller('captchaCtrl', ['$scope', '$modalInstance', '$sce', 'token', 'BOL',
        function($scope, $modalInstance, $sce, token, BOL) {
            $scope.error = false;
            $scope.captcha = $sce.trustAsResourceUrl('http://bpbol.captcha.uol.com.br/' + token + '.jpg');
            $scope.closeAlert = function(){
                $scope.error = false;
            }
            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
            $scope.submit = function() {
                $scope.error = false;
                if(!$scope.text_captcha){
                    $scope.error = 'Digite o que você vê na imagem a cima.'
                    return;
                }
                BOL.postCaptcha($scope.text_captcha).then(function(result){

                }, function(error){
                    $scope.error = error;
                });
                //$modalInstance.close($scope.text_captcha);
            };
        }
    ]);
