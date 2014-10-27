app.controller('ConfirmMessageCtrl',['$scope','$modalInstance','message', function ($scope,$modalInstance,message) {
    $scope.message = message;
    $scope.close = function () {
        $modalInstance.close('close');
    };
    $scope.no = function () {
        $modalInstance.dismiss();
    };
}]);