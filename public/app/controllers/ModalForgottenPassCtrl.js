app.controller('ModalForgottenPassCtrl',['$scope','$modalInstance','auth', function ($scope, $modalInstance, auth) {
    $scope.search = {username:''};

    $('body').keyup( function (e) {
        if(event.keyCode == 13){
            if($scope.search.username.length>0) {
                $scope.ok();
            }
            else{
                if (!!document.getElementById("signUpUsername")) {
                    document.getElementById("signUpUsername").focus();
                }
            }
        }
    });

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.ok = function () {

        if ($scope.search.username.length==0) {
            document.getElementById("signUpUsername").focus();
            //$( "#username" ).focus();
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
                    //alert(payload.data.reason);
                    document.getElementById('redAlert').innerHTML = 'Wrong username or password!';
                    document.getElementById("signUpUsername").focus();
                }
            },
            //if something wrong with the POST
            function (err) {
                console.log('something wrong: ' + err)
            });
    };
}]);