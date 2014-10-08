app.controller('LoginCtrl',['$scope', 'identity', 'auth','$location', function ($scope, identity, auth, $location) {

    $scope.identity = identity;
    $scope.user = {};



    $scope.login = function (user) {

//        //TODO 1st way
//        //authenticate the user
        auth.login(user).then(
            //if POST payload has been received
            function (payload) {
                if (payload.data.success) {
                    identity.currentUser = payload.data.user;
                }
                else{
                    $scope.user.username = '';
                    $scope.user.password = '';
                    alert('Wrong: username/pass');
                }
            },
            //if something wrong with the POST
            function (err) {
                console.log('something wrong: ' + err)
            });

        //TODO 2nd way
        //But that way AJAX requests works,
        //but this is not a good way to keep the business logig into the controller,
        //the controller purposes is only to communicate with the relevant view,
        // it should not deal with the AJAX requests!!!
        //therefor the separate service should be created

        //        $http.post('/login', user).success(function (response, err) {
        //            if (response.success){
        //                $scope.user = response.user;
        //
        //                identity.currentUser = response.user;
        //            }
        //            else{
        //
        //                //TODO current user logout
        //
        //                $scope.user.username = '';
        //                $scope.user.password = '';
        //                alert('Wrong: username/pass');
        //            }
        //        })




    };
    
    $scope.logout = function () {
        auth.logout().then(
            //if POST payload has been received
            function (payload) {
                if (payload.data.success) {
                    identity.currentUser = undefined;
                    $scope.user.username = '';
                    $scope.user.password = '';
                    $location.path('/'); //redirects to Home page after logout
                }
            },
            //if something wrong with the POST
            function (err) {
                console.log('something wrong happened during logging out on the server : ' + err)
            });


    }
}]);
