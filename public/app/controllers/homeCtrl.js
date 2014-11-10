app.controller('HomeCtrl',['$scope','$resource','$http','$q','$location','$modal','$timeout'
    , function($scope, $resource, $http, $q, $location,$modal,$timeout) {

    //check if the topic name inside thumbnail is too long
    $scope.name = function (name) {
        if (name.length<=17) return name;
        return name.substr(0,17)+' ...';
    };
    $scope.more = 'ОЩЕ';


    $scope.nothing = false;
    $scope.info = 'Засега няма информация за това което търсите!';

     //after selecting an item from typeahead
    $scope.sel = function () {
        $scope.goSearch();
    };

    //When Enter keyboard button been pressed
    $scope.ent= function () {
        $scope.goSearch();
    };

    $scope.addProduct = function () {
        //TODO before
//        if (!identity.isAuthenticated()) {
//            notify.config({duration : 2000});
//            notify({ message:'Трябва да сте логнат, за да можете да добавяте!'} );
//            return;
//        }
//        $location.path('/addProduct');

        //TODO after

        var modalInstance = $modal.open({
            templateUrl: '/p/partials/add',
            controller: 'AddCtrl'
            ,backdrop: 'static'
            ,keyboard: false
            ,windowClass: "modal fade in"
        });
        modalInstance.result.then(function (result) {

//            if (user == 'signUp') {
//                var modalInstance = $modal.open({
//                    templateUrl: '/p/partials/modalSignup',
//                    controller: 'ModalSignupCtrl'
//                });
//                modalInstance.result.then(function (payload) {
//                    if (payload.success) {
//                        alert(payload.reason);
//                    }
//                    $location.path('/');
//                });
//                return;
//            }
        })

    };


// Showing the Products and dealing with the Prev and Next buttons
    $scope.search = '';
    var pos = 0;
    $scope.step = 6;


//        console.log($cookieStore.get('home.l'));
//        console.log($cookies.home);

    function load(skip, limit, search) {
        var res = $resource('/api');
        return res.query({s: skip ,l: limit, search: search});
    }
    //initial products load
    $scope.products =load(pos,$scope.step,$scope.search);
//Preview and Next buttons
    $scope.prev = function(){
//        if (pos >= $scope.step) {
//            pos = pos - $scope.step;
//            var res = $resource('/prev');
//            res.query();
//            $resource('/api').query.$promise.then(function (result) {
//                $scope.products = result;
//            });
//
//        }


        if (pos >= $scope.step) {
            pos = pos - $scope.step;
           // $cookies.home= {l:pos,s:$scope.step,search:$scope.search};
            //$timeout(function () {
                load(pos, $scope.step, $scope.search).$promise.then(function (result) {
                    $scope.products = result;
                    window.scrollTo(0, 0);
                });
            //},10000)

        }
    };




    $scope.next = function(){

//        var res = $resource('/next');
//        res.query();
//        $resource('/api').query().$promise.then(function(result){
//            if (result.length === 0) {
//
//            }
//            else {
//                $scope.products = result;
//                pos = pos + $scope.step;
//            }
//        });


        pos = pos + $scope.step;
      //$cookies.home = 'l'+pos+'s'+$scope.step+'search'+$scope.search;
        //$timeout(function () {
        load(pos,$scope.step,$scope.search).$promise.then(function(result){
            if (result.length === 0) {
                $scope.more = 'КРАЙ';
                pos = pos - $scope.step;
            }
            else {
               //window.scrollTo(0, 0);
                //$scope.products = result;

                for(i=0;i<result.length;i++){
                    $scope.products.push(result[i]);
                }
                if (i<6){
                    $scope.more = 'КРАЙ';
                }
                //console.log(document.body.scrollHeight);
//                $timeout(function () {
//                    window.scrollTo(0,document.body.scrollHeight);
//                },1000);


            }
        });
       // },10000);
    };


//deals with the search box typeahead
    $scope.getProd = function(val) {

        return $http.post('/api/search', {
            search: val
        }).then(function(response){

            var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

            var length = width<400 ? 30 : 55;
            var result = response.data;
            if (result !== undefined) {
                for (i = 0; i < result.length; i++) {
                    if (result[i].length > length) {
                        result[i] = result[i].substr(0, length);
                    }
                }
            }
            return response.data;
            });
    };


    //TODO press Enter w/o jquery
//    $('body').keyup( function (e) {
//        if(event.keyCode == 13){
//            if ($(".search").is(":focus")) {
//
//                $scope.goSearch();
//            }
//        }
//    });


//check if the topic is new(published less than a week)
   $scope.checkIsNew = function (date) {
       var f = new Date(date).getTime();
       var d = new Date().getTime();
        if (d<f+7*86400000){
            return true;
        }
       return false;
   };



    //Search filter of the products
    $scope.goSearch = function(){
        window.scrollTo(0,0);
        $scope.nothing = false;
        $scope.search = $scope.search.trim();
        pos=0;

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

                    //TODO replace search content with name of the selected choise
                    //$scope.search = $scope.products[0].name;

                    return $scope.products = data;

                }

                $scope.nothing = true;
                $scope.products='';
            })
            .error(function (err) { // .error(data,status,header,config)
                console.log('Resource reading failed: ' + err);
            });

        //TODO w/o jquery
//        $(".search").blur();
//        //document.getElementsByClassName(".products")[0].focus();
//        $( "ul li:nth-child(1)").focus();



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

        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        if (width<400) {
            $scope.search = $scope.search.substr(0, 20);
        }
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