app.controller('ModalForgottenPassCtrl',['$scope','$modalInstance','auth', function ($scope, $modalInstance, auth) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.ok = function () {

    };
}]);