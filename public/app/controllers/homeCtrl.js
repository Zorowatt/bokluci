app.controller('HomeCtrl',['$scope','$resource','$http','$q','identity','$location','notify', function($scope, $resource, $http, $q, identity, $location,notify) {
    $scope.identity = identity; //this is only to show Add Product button if logged user exists


    $scope.addProduct = function () {
        if (!identity.isAuthenticated()) {
            notify.config({duration : 2000});
            notify({ message:'Трябва да сте логнат, за да можете да добавяте!'} );
            return;
        }
        $location.path('/addProduct');
    };


// Showing the Products and dealing with the Prev and Next buttons
    $scope.search = '';
    var pos = 0;
    $scope.step = 8;

    function load(skip, limit, search) {
        var res = $resource('/api');
        return res.query({s: skip ,l: limit, search: search});
    }
    //initial products load
    $scope.products =load(pos,$scope.step,$scope.search);
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
            }
        });
    };

//deals with the search box typeahead
    $scope.getProd = function(val) {
        return $http.get('/api/search', {
            params: {
                search: val
            }
        }).then(function(response){
            return response.data;
            });
    };
    //When Enter keyboard button been pressed
    $('body').keyup( function (e) {
        if(event.keyCode == 13){
            if ($(".search").is(":focus")) {

                $scope.goSearch();
            }
        }
    });
    //Search filter of the products
    $scope.goSearch = function(){
        $scope.search = $scope.search.trim();


//        //TODO 1st way
//        $http.get('/api',{params: {s: pos, l: $scope.step, search: $scope.search}}).then(function(res) {
//            $scope.products = res.data;
//        }, function(err) {
//            console.log('Resource reading failed: '+ err);
//        });


        //TODO 2nd way
        $http.get('/api', {params: {s: pos, l: $scope.step, search: $scope.search}})
            .success(function (data, status, error, config) { // .success(data,status,header,config)
                if (data.length > 0) {
                    $scope.products = data;

                }
            })
            .error(function (err) { // .error(data,status,header,config)
                console.log('Resource reading failed: ' + err);
            });

        $(".search").blur();
        //document.getElementsByClassName(".products")[0].focus();
        $( "ul li:nth-child(1)").focus();



        //TODO 3rd way to load the resource
//    var p = $resource('/api');
//    p.query({s: pos, l: $scope.step, search: $scope.search}).$promise.then(function (product) {
//        if (product.length > 0) {
//            $scope.products = product;
//            $scope.searchBuffer = '';
//        }
//    },
//        function (error) {
//            console.log('Resource reading failed: ' + error);
//        });

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






    // disable input auto zoom in mobile devices
//    var $viewportMeta = $('meta[name="viewport"]');
//    $('input, select, textarea').bind('focus blur', function(event) {
//        $viewportMeta.attr('content', 'width=device-width,initial-scale=1,maximum-scale=' +        (event.type == 'blur' ? 10 : 1));
//    });


// TODO gets any element on click

//    function getEl(){
//        var ev = arguments[0] || window.event,
//            origEl = ev.target || ev.srcElement;
//        console.log(origEl.tagName);
//    }
//    document.onclick = getEl;


// TODO Get Geolocation w/o promises

//    var options = {
//        enableHighAccuracy: true,
//        timeout: 5000,
//        maximumAge: 0
//    };
//
//    function success(pos) {
//        var crd = pos.coords;
//
//        console.log('Your current position is:');
//        console.log('Latitude : ' + crd.latitude);
//        console.log('Longitude: ' + crd.longitude);
//        console.log('More or less ' + crd.accuracy + ' meters.');
//    };
//
//    function error(err) {
//        console.warn('ERROR(' + err.code + '): ' + err.message);
//    };
//
//    navigator.geolocation.getCurrentPosition(success, error, options);


// TODO Shows geolocation w/o promises

//  //TODO v tozi primer ako browsera se zabavi s cheteneto na geolokaciqta
//  //ciloto prilojenie shte stoi i chaka.
//    var locationElement = document.getElementById('location-element');
//
//    function visualizeGeolocation(imageCreationFunction){
//        navigator.geolocation.getCurrentPosition(
//            //when success
//            function(position){
//                parseLatAndLongCoords(position, imageCreationFunction,
//                    //if error
//                    function(errorMessage){
//                        console.log('Could not parse coordinates:' + errorMessage);
//                    }
//                );
//            },
//            //when error
//            function(error){
//                console.log('Could not access geolocation:' + error);
//            }
//        );
//    }
//
//    function parseLatAndLongCoords(geolocationPosition, success, error) {
//        if(geolocationPosition.coords){
//            var latAndLong = {lat: geolocationPosition.coords.latitude, long: geolocationPosition.coords.longitude};
//            success(latAndLong);
//        }
//        else{
//            error('Could not find coords object. Are you sure you are passing navigator.geolocation.getCurrentPosition');
//        }
//    }
//
//    function createGeolocationImage(coordsObj) {
//        var imgElement = document.createElement('img');
//
//
//        var imgSrc = 'http://maps.googleapis.com/maps/api/staticmap?center='+coordsObj.lat+','+coordsObj.long+'&zoom=15' +
//            '&size=500x500&sensor=false';
//        imgElement.setAttribute('src',imgSrc);
//        locationElement.appendChild(imgElement);
//    }
//    visualizeGeolocation(createGeolocationImage);

//TODO Show geolocation with promises

//    var locationElement = document.getElementById('location-element');
//
//    getGeolocationPositionPromise()
//        .then(parseLatAndLongCoords)
//        .then(createGeolocationImage)
//
//    function getGeolocationPositionPromise() {
//        var deffered = $q.defer();
//        navigator.geolocation.getCurrentPosition(
//            function(position){
//                deffered.resolve(position);
//            },
//            function (error) {
//             deffered.reject(error);
//            }
//        );
//        return deffered.promise;
//    }
//    function parseLatAndLongCoords(geolocationPosition) {
//        if (geolocationPosition.coords){
//            return {lat: geolocationPosition.coords.latitude, long: geolocationPosition.coords.longitude};
//        }
//        else{
//            throw {message:'No coords element found', name: 'UserException'};
//        }
//    }
//    function createGeolocationImage(coordsObj) {
//        var imgElement = document.createElement('img');
//        var imgSrc = 'http://maps.googleapis.com/maps/api/staticmap?center='+coordsObj.lat+','+coordsObj.long+'&zoom=15' +
//            '&size=500x500&sensor=false';
//        imgElement.setAttribute('src',imgSrc);
//        locationElement.appendChild(imgElement);
//    }
}]);
