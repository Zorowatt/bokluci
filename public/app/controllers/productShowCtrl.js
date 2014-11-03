app.controller('ProductShowCtrl',['$scope', '$routeParams', '$resource', 'productsCRUD','$location','$modal','$http'
    ,function($scope, $routeParams, $resource, productsCRUD, $location,$modal,$http) {

    //$scope.identity = identity; //this is only to show Add Product button if logged user exists

    var p = $resource('/api/topic/:id',{id: $routeParams.id});
    p.get().$promise.then(function(product) {
        if(product.missing){
            $location.path('/');
        }
        $scope.Product = product;
        //console.log('-----'+$scope.Product.picture[0].filename);
    });


    $scope.showMe = function () {
        var modalInstance = $modal.open({
            templateUrl: '/p/partials/showMe',
            controller: 'ShowMeCtrl'
            //,backdrop: 'static'
            //,keyboard: false
            //,size: 'sm'
            ,resolve: {
               message : function () {
                   return $scope.Product.thumbnail;
               }
            }
        });
        modalInstance.result.then(function (result) {
            if (result == 'close') {
                $modalInstance.dismiss('close');
            }

        });
    };



    $scope.addCommentPros = function (){
        var modalInstance = $modal.open({
            templateUrl: '/p/partials/comments',
            controller: 'CommentsCtrl'
            ,resolve: {
                message : function () {
                    return 'Моля добавете вашето мнение!';
                }
            }
        });
        modalInstance.result.then(function (result) {
            if(result){
                var pp = {
                    id: $routeParams.id,
                    pros: {
                        content: result
                    }
                };
                $http.post('/api/update/',pp).success(function(response) {
                    console.log(response);
                    if (response.success) {
                        var modalInstance = $modal.open({
                            templateUrl: '/p/partials/confirmMessage',
                            controller: 'ConfirmMessageCtrl'
                            ,size: 'sm'
                            ,resolve: {
                                message : function () {
                                    return 'Вашето мнение бе добавено успешно!';
                                }
                            }
                        });
                    }
                    else {
                        var modalInstance = $modal.open({
                            templateUrl: '/p/partials/confirmMessage',
                            controller: 'ConfirmMessageCtrl'
                            ,size: 'sm'
                            ,resolve: {
                                message : function () {
                                    return 'Добавянето беше неуспешно! Моля опитайте по-късно.';
                                }
                            }
                        });
                    }
                });
            }
        });
    };

    $scope.addCommentCons = function (){
        var modalInstance = $modal.open({
            templateUrl: '/p/partials/comments',
            controller: 'CommentsCtrl'
            ,resolve: {
                message : function () {
                    return 'Моля добавете вашите препоръки!';
                }
            }
        });
        modalInstance.result.then(function (result) {
            if(result){
                var pp = {
                    id: $routeParams.id,
                    cons: {
                        content: result
                    }
                };
                $http.post('/api/update/',pp).success(function(response) {
                    if (response.success) {
                        var modalInstance = $modal.open({
                            templateUrl: '/p/partials/confirmMessage',
                            controller: 'ConfirmMessageCtrl'
                            ,size: 'sm'
                            ,resolve: {
                                message : function () {
                                    return 'Вашите препоръки бяха добавени успешно!';
                                }
                            }
                        });
                    }
                    else {
                        var modalInstance = $modal.open({
                            templateUrl: '/p/partials/confirmMessage',
                            controller: 'ConfirmMessageCtrl'
                            ,size: 'sm'
                            ,resolve: {
                                message : function () {
                                    return 'Добавянето беше неуспешно! Моля опитайте по-късно.';
                                }
                            }
                        });
                    }
                });
            }
        });
//        if($scope.commentCons) {
//            var comment = {
//                id: $scope.Product._id,
//                cons: {
//                    //userAdded: identity.currentUser.username,
//                    content: $scope.commentCons,
//                    flagIsNew: true
//                }
//            };
//            productsCRUD.update(comment);
//        }
//        $scope.commentCons = '';
    };

}]);
