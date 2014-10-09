app.controller('ModalSignupCtrl',['$scope','$modalInstance','auth', function ($scope, $modalInstance, auth) {


    $scope.signUp = function (user) {

        auth.signUp($scope.user).then(
            //if POST payload has been received
            function (payload) {
                if (payload.data.success) {

                    $modalInstance.close(payload.data.user);
                }
                else {
                    $scope.user.username = '';
                    $scope.user.password = '';
                    if (payload.data.reason.indexOf("duplicate key") !=-1) {
                        document.getElementById('redAlert').innerHTML = 'This Username Exists!';
                        return;
                    }
                    document.getElementById('redAlert').innerHTML = payload.data.reason;
                }
            },
            //if something wrong with the POST
            function (err) {
                console.log('something wrong: ' + err)
            });







    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);