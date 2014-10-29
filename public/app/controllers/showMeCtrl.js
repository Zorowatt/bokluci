app.controller('ShowMeCtrl',['$scope','$modalInstance','message'
    , function ($scope,$modalInstance,message) {

$scope.message = message;

        $scope.closeMe = function () {
            $modalInstance.dismiss('close');

        };
}]);