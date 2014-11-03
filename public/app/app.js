var app = angular.module('app',['ngResource','ngRoute'
    ,'angularFileUpload','ui.bootstrap','ngActivityIndicator']);


app.config(['$locationProvider','$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);

//    var routeUserChecks = {
////        adminRole: {
////            authenticate: function(auth) {
////                return auth.isAuthorizedForRole('admin');
////            }
////        },
//        authenticated: {
//            authenticate: function(auth) {
//                return auth.isAuthenticated();
//            }
//        }
//    };



    $routeProvider

        .when('/topic/:id',{
            templateUrl: '/p/partials/productShow',
            controller: 'ProductShowCtrl'
        })
        .when('/', {
            templateUrl: '/home',
            controller: 'HomeCtrl'
        })
//        .when('/addProduct', {
//            templateUrl: 'p/partials/productAdd',
//            controller: 'ProductCtrl'
//              //can not show this view if user not logged
//            //resolve: routeUserChecks.authenticated
//        })

//        .when('/recover', {
//            templateUrl: '/p/partials/recover',
//            controller: 'RecoverCtrl'
//        })
        .otherwise({
            redirectTo: '/'
        });

}]);

//app.run(['$rootScope', '$location', function($rootScope, $location) {
//    $rootScope.$on('$routeChangeError', function(ev, current, previous, rejection) {
//        if (rejection === 'not authorized') {
//            $location.path('/');
//        }
//    })
//}]);

app.config(['$tooltipProvider', function($tooltipProvider){
    $tooltipProvider.setTriggers({
        'mouseenter': 'mouseleave',
        'click': 'click',
        'focus': 'blur',
        'never': 'mouseleave',
        'show': 'hide'
    });
    $tooltipProvider.options({
        placement: 'top',
        animation: true,
        popupDelay: 700,
        appendToBody: false
    });
}]);

app.config(['$activityIndicatorProvider', function ($activityIndicatorProvider) {
    $activityIndicatorProvider.setActivityIndicatorStyle('CircledDark');
}]);


//Deal with the Enter press into the modals
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
app.directive('customPopover', function () {
    return {
        restrict: 'A',
        template: '<span>{{label}}</span>',
        link: function (scope, el, attrs) {
            scope.label = attrs.popoverLabel;

            $(el).popover({
                trigger: 'click',
                html: true,
                content: attrs.popoverHtml,
                placement: attrs.popoverPlacement
            });
        }
    };
});
//this is to prevent typeahead /search suggestion / auto select when Enter key being pressed
app.config(["$provide", function ($provide) {
    /**
     * decorates typeahead directive so that it won't autoselect the first element.
     * This is a temporary fix until ui-bootstrap provides this functionality built-in.
     */
    $provide.decorator("typeaheadDirective", ["$delegate","$timeout",function($delegate,$timeout){

        var prevCompile = $delegate[$delegate.length -1].compile;
        $delegate[$delegate.length -1].compile = function(){
            var link = prevCompile.apply($delegate,Array.prototype.slice.call(arguments,0));

            return function(originalScope,elem,attr) {
                var result = link.apply(link,Array.prototype.slice.call(arguments,0));
                //the link creates a new child scope, we need to have access to that one.
                var scope = originalScope.$$childTail;
                var prevSelect = scope.select;

                scope.select = function(activeIdx){
                    if (activeIdx < 0) {
                        scope.matches = [];
                        elem.attr('aria-expanded', false);
                        $timeout(function() { elem[0].focus(); }, 0, false);
                    } else {
                        prevSelect.apply(scope, Array.prototype.slice.call(arguments, 0));
                    }
                };
                //we don't have access to a function that happens after getMatchesAsync
                //so we need to listen on a consequence of that function
                scope.$watchCollection("matches",function(){
                    scope.activeIdx = -1;
                });
                return result;
            }
        };
        return $delegate;
    }]);
}]);
app.controller('ConfirmMessageCtrl',['$scope','$modalInstance','message','$timeout', function ($scope,$modalInstance,message,$timeout) {
    $scope.message = message;
    $scope.closeMe = function () {
        $modalInstance.close('close');
    };
    $timeout(function () {
        $modalInstance.close('close');
    }, 3000);
}]);
app.controller('ShowMeCtrl',['$scope','$modalInstance','message'
    , function ($scope,$modalInstance,message) {
        $scope.message = message;
        $scope.closeMe = function () {
            $modalInstance.dismiss('close');
        };
    }]);
app.controller('AddCtrl',['$scope','$modalInstance','$modal','$upload','$timeout','$activityIndicator'
    , function ($scope,$modalInstance,$modal,$upload, $timeout,$activityIndicator) {
        $scope.uploadSpin = false;
        $scope.imageSpin = false;
        $scope.fileId = 'na';
        $scope.thumbId = 'na';
        $scope.adding = false;
        $scope.imageExistGet=true;
        $scope.alert=[];
        $scope.imageMessage='Няма Снимка';

        function popAlert(alertNumber,message) {
            $scope.alert[alertNumber] = message;
            $timeout(function () {
                $scope.alert[alertNumber] = '';
            }, 3000);
        }

        //validation for the topic
        $scope.$watch('product.name', function(newValue, oldValue) {
            if (newValue!==undefined && newValue.length>50){
                $scope.product.name=oldValue;
                return popAlert(0,'Моля темата да не е по-дълга от 50 символа!');
            }
        });
        $scope.ent = function () {};

        $scope.titles = true;
        if (!document.__proto__){
            $scope.titles = true;
        }
        $scope.imageExist = false;
        $scope.product = {};
        var selectedFile = undefined;

        $scope.removeImage = function(){

            $scope.imageExistGet=true;
            $scope.imageExist = false;
            $scope.product.filedata = '';
            selectedFile = undefined;
            window.scrollTo(0, 0);
            $scope.imageMessage='Няма Снимка';
        };
        $scope.closeMe = function () {
            if (!$scope.adding) {return $modalInstance.dismiss('close');}
            var modalInstance = $modal.open({
                templateUrl: '/p/partials/confirmMessage',
                controller: 'ConfirmMessageCtrl'
                ,size: 'sm'
                ,resolve: {
                    message : function () {
                        return 'Моля изчакайте снимката да се зареди!';
                    }
                }
            });
        };
        $scope.addImage = function ($file) {

            $scope.fileId = 'na';
            $scope.thumbId = 'na';
            $scope.imageExistGet=false;
            $scope.proppername = '';
            selectedFile = $file[0];
            if (selectedFile===undefined){return;}

            if ((selectedFile.type.indexOf('image') == -1)) {
                //TODO
                return popAlert(1,'Снимката трябва да бъде в подходящ формат - .JPEG,.PNG ...!');
            }
            if (selectedFile.size > 5000000){
                return popAlert(1,'Снимката трябва да е по-малка от 5 МВ!');
            }
            $scope.adding = true;
            $scope.imageMessage = 'Снимката се зарежда...';

            $scope.imageSpin = true;
            $activityIndicator.startAnimating();
            $upload.upload({
                url: '/convert',
                file: selectedFile
            })
                .progress(function (evt) {
                    var t =evt.total ;
                    var l = evt.loaded;
                    var p = Math.round(l/t*100);
                    $scope.imageMessage = p+'%';
                })
                .error(function (err) {
                    $scope.imageExist = false;
                    alert(err)
                })
                .then(function (data, status, headers, config) {
                    $scope.imageSpin = false;
                    $activityIndicator.stopAnimating();
                    $scope.imageExist = true;
                    if (data.data==''){
                        $scope.imageExistGet=true;
                        $scope.adding = false;
                        $scope.imageSpin = false;
                        $scope.imageExist = false;
                        return popAlert(1,'Тази снимка не се разпознава!  Моля добавете друга снимка.');
                    }
                    $scope.adding = false;
                    var t = data.data.substr(-40);
                    $scope.fileId = t.slice(20);
                    $scope.thumbId = t.substr(0,20);
                    $scope.img=data.data.slice(0,-40);
                });


        };
        $scope.upload = function () {
            if(!$scope.product.name){
                popAlert(0,'Важно е да въведете тема, наименование, описание ...');
                document.getElementById("name").focus();
                return;
            }
            if(!$scope.proscon && !$scope.conscon){
                document.getElementById("mnenie").focus();
                popAlert(2,'Моля напишете мнението си и/или препоръка?');
                return;
            }
            //prepares product data for uploading
            var pp = {
                name : $scope.product.name,
                pros: [{
//                userAdded: identity.currentUser.username,
                    dateAdded: new Date(),
                    content: $scope.proscon || '--',
                    flagIsNew: true
//                    ,comments: [{
//                        comment: '--',
//                        flagIsNew: true
//                    }]
                }],
                cons:[{
//                userAdded: identity.currentUser.username,
                    dateAdded: new Date(),
                    content: $scope.conscon || '--',
                    flagIsNew: true
//                    ,comments: [{
//                        comment: '--',
//                        flagIsNew: true
//                    }]
                }],
//            id : 99,
//            userAdded : identity.currentUser.username,
                dateAdded : new Date(),
                flagIsNew : true,
                flagNewCommentAdded : true,
//                keyWords: ['n/a'],
//                category: ['n/a'],
                thumbnail : $scope.thumbId
//                picture : [{
//                    filename : $scope.fileId,
//
//                    //filename : !!selectedFile ? selectedFile.name : 'noPicture',
//                    dateAdded: new Date()
////               userAdded: identity.currentUser.username
//                }]
            };
            $upload.upload({
                url: '/upload_image',
                data: pp
            })
                .progress(function () {
                })
                .error(function () {
                    alert(err)
                })
                .then(function (data, status, headers, config) {
                    $modalInstance.dismiss();
                    var modalInstance = $modal.open({
                        templateUrl: '/p/partials/confirmMessage',
                        controller: 'ConfirmMessageCtrl'
                        ,size: 'sm'
                        ,resolve: {
                            message : function () {
                                return 'Вашата тема бе добавена успешно!';
                            }
                        }
                    });
                });
        }
    }]);
app.controller('CommentsCtrl',['$scope','$modalInstance','message'
    , function ($scope,$modalInstance,message) {
        $scope.message = message;
        $scope.comment = '';
        $scope.closeMe = function () {
            $modalInstance.dismiss('close');
        };
        $scope.add = function () {
            $modalInstance.close($scope.comment);
        };
    }]);