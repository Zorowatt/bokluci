//this service will make the AJAX requests related with the user authentication
app.factory('auth',['$http', function ($http) {
    return{
        login: function (user) {
            return  $http.post('/login', user);
//            //we are going to use a promise which will return the result when
//            //the request is being received
//
//            var deferred = $q.defer();
//            $http.post('/login', user).success(function (response, err) {
//                if (response.success){
//
//                    deferred.resolve(true);
//
//                    identity.currentUser = response.user;
//                }
//                else{
//                    deferred.resolve(false);
//
//                }
//            });
//
//            return deferred.promise;
        },
        logout: function () {
            return  $http.post('/logout');
        }
    }
}]);