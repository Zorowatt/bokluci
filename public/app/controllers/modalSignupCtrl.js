app.controller('ModalSignupCtrl',['$scope','$modalInstance','auth', function ($scope, $modalInstance, auth) {

// one good way for validation

    //should be converted for my app
//    $('form').validate({
//        rules: {
//            firstname: {
//                minlength: 3,
//                maxlength: 15,
//                required: true
//            },
//            lastname: {
//                minlength: 3,
//                maxlength: 15,
//                required: true
//            }
//        },
//        highlight: function(element) {
//            $(element).closest('.form-group').addClass('has-error');
//        },
//        unhighlight: function(element) {
//            $(element).closest('.form-group').removeClass('has-error');
//        },
//        errorElement: 'span',
//        errorClass: 'help-block',
//        errorPlacement: function(error, element) {
//            if(element.parent('.input-group').length) {
//                error.insertAfter(element.parent());
//            } else {
//                error.insertAfter(element);
//            }
//        }
//    });

    $scope.clearEmail = function () {
        $('.redAlertEmail').text('');
    };
    $scope.clearUsernameError = function () {
        $('#redAlert').text('');
    };

    function ValidateEmail(inputText)
    {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(inputText.match(mailformat))
        {
            //document.form1.text1.focus();
            return true;
        }
        else
        {
            //alert("You have entered an invalid email address!");
            //document.form1.text1.focus();
            return false;
        }
    }


    $scope.signUp = function (user) {
        //simple validation of Email
        //TODO confirmation Email
        $('.redAlertEmail').text('');
        if (!ValidateEmail($scope.user.email)){
            //console.log('not valid');
            $('.redAlertEmail').text('Invalid E-mail!');
            return;
        }




        //TODO user validation, e-mail explicitly
        auth.signUp(user).then(
            //if POST payload has been received
            function (payload) {
                if (payload.data.success) {

                    $modalInstance.close(payload.data);
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