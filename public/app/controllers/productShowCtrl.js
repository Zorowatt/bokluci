app.controller('ProductShowCtrl',['$scope', '$routeParams', '$resource', 'productsCRUD',
    function($scope, $routeParams, $resource, productsCRUD) {

    //$scope.identity = identity; //this is only to show Add Product button if logged user exists




    var p = $resource('/api/product/:id',{id: $routeParams.id});
    p.get().$promise.then(function(product) {
        $scope.Product = product;
    });

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
