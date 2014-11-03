app.controller('ProductShowCtrl',['$scope', '$routeParams', '$resource', 'productsCRUD','$location','$modal'
    ,function($scope, $routeParams, $resource, productsCRUD, $location,$modal) {

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
        if($scope.commentPros) {
            var comment = {
                id: $scope.Product._id,
                pros: {
                    //userAdded: identity.currentUser.username,
                    content: $scope.commentPros,
                    flagIsNew: true
                }
            };
            productsCRUD.update(comment);
        }
        $scope.commentPros = '';
    };

    $scope.addCommentCons = function (){
        if($scope.commentCons) {
            var comment = {
                id: $scope.Product._id,
                cons: {
                    //userAdded: identity.currentUser.username,
                    content: $scope.commentCons,
                    flagIsNew: true
                }
            };
            productsCRUD.update(comment);
        }
        $scope.commentCons = '';
    };

}]);
