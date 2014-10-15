app.controller('ModalLoginCtrl',['$scope','$modalInstance','auth', function ($scope, $modalInstance, auth) {

    $scope.clear = function () {
        document.getElementById('redAlert').innerHTML = '';
    };

    $scope.ok = function () {
        if ($scope.user) {
            if (!$scope.user.username){
                document.getElementById('redAlert').innerHTML = 'Enter Username!';
                return;
            }
            if (!$scope.user.password){
                document.getElementById('redAlert').innerHTML = 'Enter Password!';
                return;
            }
            auth.login($scope.user).then(
                //if POST payload has been received
                function (payload) {
                    if (payload.data.success) {
                        console.log(payload.data.ip);
                        console.log(payload.data.host);
                        $modalInstance.close(payload.data.user);
                    }
                    else {
                        $scope.user.username = '';
                        $scope.user.password = '';
                        document.getElementById('redAlert').innerHTML = 'Wrong username or password!';
                    }
                },
                //if something wrong with the POST
                function (err) {
                    console.log('something wrong: ' + err)
                });
        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);