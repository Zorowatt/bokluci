app.controller('ModalLoginCtrl',['$scope','$modalInstance','auth', function ($scope, $modalInstance, auth) {
    $scope.user={username:'',password:''};
    $('body').keyup( function (e) {

        if(event.keyCode == 13 && e.currentTarget.className== "modal-open"){
            console.log(e);
            if($scope.user.username.length>0 && $scope.user.password.length>0) {
                $scope.ok();
            }else{
                if($scope.user.password.length>0 && !!document.getElementById("username")) {
                    document.getElementById("username").focus();
                }
                else{
                    if($scope.user.username.length>0 && !!document.getElementById("pass") ){
                       document.getElementById("pass").focus();
                    }
                }
            }
        }
    });


    $scope.clear = function () {
        document.getElementById('redAlert').innerHTML = '';
    };

    $scope.forgottenPass = function () {
        //$modalInstance.dismiss('cancel');
        $modalInstance.close('s');
    };

    $scope.ok = function () {
        if ($scope.user) {
            if (!$scope.user.username){
                document.getElementById('redAlert').innerHTML = 'Enter Username!';
                document.getElementById("username").focus();
                return;
            }
            if (!$scope.user.password){
                document.getElementById('redAlert').innerHTML = 'Enter Password!';
                document.getElementById("pass").focus();
                return;
            }
            auth.login($scope.user).then(
                //if POST payload has been received
                function (payload) {
                    if (payload.data.success) {
                        $modalInstance.close(payload.data.user);
                    }
                    else {
                        $scope.user.username = '';
                        $scope.user.password = '';
                        document.getElementById('redAlert').innerHTML = 'Wrong username or password!';
                        document.getElementById("username").focus();
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


    $scope.signUp = function () {
        $modalInstance.close('signUp');

    };

}]);