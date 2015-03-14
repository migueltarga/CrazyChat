angular.module('CrazyChat.controllers', [])
    .controller('mainCtrl', ['$scope', function($scope) {}])
    .controller('conectorCtrl', ['$scope', 'BOL', '$modal', function($scope, BOL, $modal) {

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
                    controller: ['$scope', '$modalInstance', '$sce', function($scope, $modalInstance, $sce) {
                        $scope.loading = true;
                        $scope.captcha = $sce.trustAsResourceUrl('http://bpbol.captcha.uol.com.br/' + result + '.jpg');
                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel');
                        };
                        $scope.save = function() {
                            $modalInstance.close($scope.text_captcha);
                        };
                    }]
                });
                modalfirst_access.result.then(function(user) {

                }, function() {

                });
            })
        }
    }]);
