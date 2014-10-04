app.controller('ProductShowCtrl',['$scope', '$routeParams', '$resource', 'productsCRUD',
    function($scope, $routeParams, $resource, productsCRUD ) {

    var p = $resource('/api/product/:id',{id: $routeParams.id});
    p.get().$promise.then(function(product) {
        $scope.Product = product;
    });

    $scope.addCommentPros = function (){
        if($scope.commentPros) {
            var comment = {
                id: $scope.Product._id,
                pros: {
                    userAdded: 'TODO userAdded',
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
                    userAdded: 'TODO userAdded',
                    content: $scope.commentCons,
                    flagIsNew: true
                }
            };
            productsCRUD.update(comment);
        }
        $scope.commentCons = '';
    };

}]);
