app.controller('ModalForgottenPassCtrl',['$scope','$modalInstance','auth', function ($scope, $modalInstance, auth) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.ok = function () {

        if ($scope.search.username.length==0) {
            return;
        }

        auth.forgotPass($scope.search).then(
            //if POST payload has been received
            function (payload) {
                if (payload.data.success) {
                    $modalInstance.close('Message was send to your email address!')
                }
                else {
                    $scope.search.username = '';
                    //$scope.user.email = '';
                    alert(payload.data.reason);
                    //document.getElementById('redAlert').innerHTML = 'Wrong username or password!';
                }
            },
            //if something wrong with the POST
            function (err) {
                console.log('something wrong: ' + err)
            });
    };
}]);