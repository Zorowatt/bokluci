app.controller('LoginCtrl',['$scope', 'identity', 'auth','$modal','$location', function ($scope, identity, auth, $modal,$location) {

    $scope.identity = identity;
    $scope.user = {};


        //Not in use only for examples!!!

//    $scope.login = function (user) {
//
//       //TODO 1st way
//       // authenticate the user
//        auth.login(user).then(
//            //if POST payload has been received
//            function (payload) {
//                if (payload.data.success) {
//                    identity.currentUser = payload.data.user;
//                }
//                else{
//                    $scope.user.username = '';
//                    $scope.user.password = '';
//                    alert('Wrong: username/pass');
//                }
//            },
//            //if something wrong with the POST
//            function (err) {
//                console.log('something wrong: ' + err)
//            });
//
//        //TODO 2nd way
//        //But that way AJAX requests works,
//        //but this is not a good way to keep the business logig into the controller,
//        //the controller purposes is only to communicate with the relevant view,
//        // it should not deal with the AJAX requests!!!
//        //therefor the separate service should be created
//
//        //        $http.post('/login', user).success(function (response, err) {
//        //            if (response.success){
//        //                $scope.user = response.user;
//        //
//        //                identity.currentUser = response.user;
//        //            }
//        //            else{
//        //
//        //                //TODO current user logout
//        //
//        //                $scope.user.username = '';
//        //                $scope.user.password = '';
//        //                alert('Wrong: username/pass');
//        //            }
//        //        })
//
//    };
    
    $scope.logout = function () {
        auth.logout().then(
            //if POST payload has been received
            function (payload) {
                if (payload.data.success) {
                    identity.currentUser = undefined;

                    $scope.user.username = '';
                    $scope.user.password = '';
                    $location.path('/');
                }
            },
            //if something wrong with the POST
            function (err) {
                console.log('something wrong happened during logging out on the server : ' + err)
            });


    };

    $scope.oldUser = function (size) {
        var modalInstance = $modal.open({
            templateUrl: '/p/partials/modalLogin',
            controller: 'ModalLoginCtrl',
            size: size
        });

        modalInstance.result.then(function (user) {
            if(user == 's'){

                forgottenPass();

                return;
            }
            if (user) {

                identity.currentUser = user;
            }
        }, function () {
            //console.log('Something wrong with user logIn!')
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.newUser = function (size) {
        var modalInstance = $modal.open({
            templateUrl: '/p/partials/modalSignup',
            controller: 'ModalSignupCtrl',
            size: size
        });

        modalInstance.result.then(function (payload) {

            if(payload.success){
                alert(payload.reason);

            }
            $location.path('/');
        });
//            if () {
//
////                angular.extend($scope.user,userReceived);
////                identity.currentUser = userReceived;
//
//            }
//        }, function () {
//            console.log('Something wrong with user signUp!')
//            //$log.info('Modal dismissed at: ' + new Date());
//        });
    };


    function forgottenPass() {
        var modalInstance = $modal.open({
            templateUrl: '/p/partials/modalForgottenPass',
            controller: 'ModalForgottenPassCtrl',
            size: 'sm'
        });

        modalInstance.result.then(function (payload) {

            if(payload){
                alert(payload);
            }
            //$location.path('/');
        });
    }




}]);
