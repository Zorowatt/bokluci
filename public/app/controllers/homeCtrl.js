app.controller('HomeCtrl',['$scope','$resource', function($scope, $resource) {


// Search suggestions
    $scope.searchBuffer = [];
    $scope.press = function(){
        //console.log($scope.search);
        $scope.searchBuffer = loadSearchBuffer($scope.search);
        //console.log($scope.searchBuffer);

    };
    function loadSearchBuffer(str) {
        var res = $resource('/api/search');
        return res.query({search: str})
    }
    $scope.select = function(selectedItem){
        //console.log(section);
        $scope.searchBuffer =[];
        $scope.search = selectedItem;
        $scope.goSearch();
    };
    //When Enter & TAB keyboard button been pressed
    $('body').keyup( function (e) {
        if(event.keyCode == 13){
            if ($scope.searchBuffer.length > 0) {
                $scope.searchBuffer = [];
                $scope.goSearch();
            }
        }
        if(event.keyCode == 9){
            if ($scope.searchBuffer.length > 0) {
                $scope.search = $scope.searchBuffer[0];
                $scope.searchBuffer=[];
                $scope.goSearch();
            }
        }
    });


    $scope.search = '';
    var pos = 0;
    $scope.step = 6;
    // Showing the Products and dealing with the Prev and Next buttons
    function load(skip, limit, search) {
        var res = $resource('/api');
        return res.query({s: skip ,l: limit, search: search})
    }
    //initial products load
    $scope.products = load(pos,$scope.step,$scope.search);

    //TODO Search hints list
    //filter the products
    $scope.goSearch = function(){
        //console.log($scope.search);
        $scope.products = load(pos,$scope.step,$scope.search);
    };

    // Return Pros and Cons comments count
    $scope.getNumber = function(el){
        var i = 0;
        el.forEach(function(ggg){
            if (!ggg.flagIsNew){
                i++;
             }
        });
        return i;
    };


    //Preview and Next buttons
    $scope.prev = function(){
        if (pos >= $scope.step) {
            pos = pos - $scope.step;
            load(pos, $scope.step, $scope.search).$promise.then(function (result) {
                $scope.products = result;
            });
        }
    };
    $scope.next = function(){
        pos = pos + $scope.step;
        load(pos,$scope.step,$scope.search).$promise.then(function(result){
            if (result.length === 0) {
                pos = pos - $scope.step;
            }
            else {
                $scope.products = result;
            };
        });
    };
}]);
