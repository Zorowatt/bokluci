app.controller('RecoverCtrl',['$scope','$location', 'auth', function ($scope, $location, auth) {

    $scope.user={};
    $scope.user.id = $location.search().id;
    $scope.passwordConfirm='';
    $scope.clearpass = function () {
        document.getElementsByClassName('pass')[0].innerHTML = '';
    };
    $scope.clearconf = function () {
    document.getElementsByClassName('conf')[0].innerHTML = '';
    };

    //validates pass input
    $('#pass').on('input', function() {
        var j = $(this).val();// get the current value of the input field.
        var reg = j.replace(/[^a-zA-Z0-9_<>?]/g, "");
        var last = j.slice(-1);
        if (j != reg){
            if (last == ' '){
                $scope.popSymbol = 'Space - is not allowed!';
            }else{
                $scope.popSymbol = "' "+last+" '" + ' - is not allowed!';
            }
            //Warning popover for forbidden symbols - first in app.js we have extended the Tooltip triggers as app.config
            $("#wrongSymbol").trigger('show');
            //Close the info again
            setTimeout(function () {
                $("#wrongSymbol").trigger('hide');
            }, 2000);
            //remove the symbol
            $(this).val(j = j.substring(0, j.length - 1))
        }
    });
    //validates passconfirm input
    $('#passconfirm').on('input', function() {
        var j = $(this).val();// get the current value of the input field.
        var reg = j.replace(/[^a-zA-Z0-9_<>?]/g, "");

        if (j != reg){
            //remove the symbol
            $(this).val(j = j.substring(0, j.length - 1))
        }
    });


    $scope.recover = function () {

//TODO password validate for strength and length

        if (!$scope.user.password){
            document.getElementsByClassName('pass')[0].innerHTML = 'Enter password!';
            return;
        }
        if ($scope.user.password.length>15){
            document.getElementsByClassName('pass')[0].innerHTML = 'Less than 15 symbols!';
            return;
        }
        if (!$scope.passwordConfirm){
            document.getElementsByClassName('conf')[0].innerHTML = 'Retype password!';
            return;
        }
        if ($scope.user.password != $scope.passwordConfirm){
            document.getElementsByClassName('conf')[0].innerHTML = 'Passwords not much!';
            return;
        }


            auth.passrecover($scope.user).then(
                //if POST payload has been received
                function (payload) {
                    if (payload.data.success) {
                        alert('Done!');
                        $location.path('/');
                        //$modalInstance.close(payload.data.user);
                    }
                    else {
                        $scope.user.password = '';
                        alert(payload.data.reason);
                    }
                },
                //if something wrong with the POST
                function (err) {
                    console.log('something else is wrong: ' + err)
                });

    };

//    $scope.cancel = function () {
//        $modalInstance.dismiss('cancel');
//    };
}]);