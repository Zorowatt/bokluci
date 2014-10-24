app.controller('ModalLoginCtrl',['$scope','$modalInstance','auth', function ($scope, $modalInstance, auth) {
    $scope.user={username:'',password:''};


    //validates username & password input
    $scope.valid = function() {
        $scope.proppername = '';
        $scope.propperpass = '';
        if ($scope.user.username !== $scope.user.username.replace(/[^a-zA-Z0-9.]/g,"")){
            $scope.user.username = $scope.user.username.replace(/[^a-zA-Z0-9.]/g,"");
            $scope.proppername = 'Моля, използвайте само букви (a-z), цифри и точки.';
        }
        if ($scope.user.password !== $scope.user.password.replace(/[^a-zA-Z0-9.]/g,"")){
            $scope.user.password = $scope.user.password.replace(/[^a-zA-Z0-9.]/g,"");
            $scope.propperpass = 'Моля, използвайте само букви (a-z), цифри и точки.';
        }

        document.getElementById('redAlert').innerHTML = '';
    };


    //Action when Enter button has being pressed
    $scope.ent = function () {
        if($scope.user.username.length>0 && $scope.user.password.length>0){
            $scope.ok();
            return;
        }
        if($scope.user.username.length>0){
            angular.element('#password').focus();
            $scope.propperpass = 'Моля, въведете парола си!';
            //document.getElementById('redAlert').innerHTML = 'Въведи парола!';
            return;
        }
        if($scope.user.password.length>0) {
            if(document.getElementById("username")){
                angular.element('#username').focus();}
            $scope.proppername = 'Моля, въведете потребителското си име!';
            //document.getElementById('redAlert').innerHTML = 'Въведи име!';
        }
    };





    $scope.forgottenPass = function () {
        //$modalInstance.dismiss('cancel');
        $modalInstance.close('s');
    };

    $scope.ok = function () {
        if ($scope.user) {
            if (!$scope.user.username){
                $scope.proppername = 'Моля, въведете потребителското си име!';
                angular.element('#username').focus();
                return;
            }
            if (!$scope.user.password){
                $scope.propperpass = 'Моля, въведете парола си!';
                angular.element('#password').focus();
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
                        document.getElementById('redAlert').innerHTML = 'Сгрешили сте паролата или името си!';
                        angular.element('#username').focus();
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