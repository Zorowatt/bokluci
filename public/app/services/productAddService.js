app.factory('productsCRUD', function($http, $q, $resource) {
    return {
        search: function(string) {
            var deferred = $q.defer();
            $http.get('/api/search/',string).success(function(response) {
                if (response.success) {
//                    var user = new UsersResource();
//                    angular.extend(user, response.user);
//                    identity.currentUser = user;
                    deferred.resolve(true);
                }
                else {
                    deferred.resolve(false);
                }
            });
            return deferred.promise;
        },

        create: function(product) {
            var deferred = $q.defer();
            var prod = $resource('/api/products/');
            var p = new prod(product);
            p.$save().then(function() {
                //identity.currentUser = user;
                deferred.resolve();
            }, function(response) {
                deferred.reject(response);
            });
            return deferred.promise;
        },
        update: function(product) {
            var deferred = $q.defer();
             $http.post('/api/update/',product).success(function(response) {
                if (response.success) {
//                    var user = new UsersResource();
//                    angular.extend(user, response.user);
//                    identity.currentUser = user;
                    deferred.resolve(true);
                }
                else {
                    deferred.resolve(false);
                }
            });
            return deferred.promise;
        }

//        login: function(user){
//            var deferred = $q.defer();
//
//            $http.post('/login', user).success(function(response) {
//                if (response.success) {
//                    var user = new UsersResource();
//                    angular.extend(user, response.user);
//                    identity.currentUser = user;
//                    deferred.resolve(true);
//                }
//                else {
//                    deferred.resolve(false);
//                }
//            });
//
//            return deferred.promise;
//        },
//        logout: function() {
//            var deferred = $q.defer();
//
//            $http.post('/logout').success(function() {
//                identity.currentUser = undefined;
//                deferred.resolve();
//            })
//
//            return deferred.promise;
//        },
//        isAuthenticated: function() {
//            if (identity.isAuthenticated()) {
//                return true;
//            }
//            else {
//                return $q.reject('not authorized');
//            }
//        },
//        isAuthorizedForRole: function(role) {
//            if (identity.isAuthorizedForRole(role)) {
//                return true;
//            }
//            else {
//                return $q.reject('not authorized');
//            }
//        }
    }
});
