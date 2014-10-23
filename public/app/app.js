var app = angular.module('app',['ngResource','ngRoute','angularFileUpload','ui.bootstrap','cgNotify','angularSpinner']);


app.config(['$locationProvider','$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);

    var routeUserChecks = {
//        adminRole: {
//            authenticate: function(auth) {
//                return auth.isAuthorizedForRole('admin');
//            }
//        },
        authenticated: {
            authenticate: function(auth) {
                return auth.isAuthenticated();
            }
        }
    };



    $routeProvider
        .when('/productShow/:id',{
            templateUrl: '/p/partials/productShow',
            controller: 'ProductShowCtrl'
        })
        .when('/addProduct', {
            templateUrl: 'p/partials/productAdd',
            controller: 'ProductCtrl',
              //can not show this view if user not logged
            resolve: routeUserChecks.authenticated
        })
        .when('/', {
            templateUrl: '/home',
            controller: 'HomeCtrl'
        })
        .when('/recover', {
            templateUrl: '/p/partials/recover',
            controller: 'RecoverCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

}]);

app.run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function(ev, current, previous, rejection) {
        if (rejection === 'not authorized') {
            $location.path('/');
        }
    })
}]);

app.config(['$tooltipProvider', function($tooltipProvider){
    $tooltipProvider.setTriggers({
        'mouseenter': 'mouseleave',
        'click': 'click',
        'focus': 'blur',
        'never': 'mouseleave',
        'show': 'hide'
    });
}]);









//app.directive('ngFileSelect', [ '$parse', '$timeout', function($parse, $timeout) {
//    return function(scope, elem, attr) {
//        var fn = $parse(attr['ngFileSelect']);
//        if (elem[0].tagName.toLowerCase() !== 'input' || (elem.attr('type') && elem.attr('type').toLowerCase()) !== 'file') {
//            var fileElem = angular.element('<input type="file">');
//            for (var i = 0; i < elem[0].attributes.length; i++) {
//                fileElem.attr(elem[0].attributes[i].name, elem[0].attributes[i].value);
//            }
//            if (elem.attr("data-multiple")) fileElem.attr("multiple", "true");
//            fileElem.css("top", 0).css("bottom", 0).css("left", 0).css("right", 0).css("width", "100%").
//                css("opacity", 0).css("position", "absolute").css('filter', 'alpha(opacity=0)');
//            elem.append(fileElem);
//            if (elem.css("position") === '' || elem.css("position") === 'static') {
//                elem.css("position", "relative");
//            }
//            elem = fileElem;
//        }
//        elem.bind('change', function(evt) {
//            var files = [], fileList, i;
//            fileList = evt.__files_ || evt.target.files;
//            if (fileList != null) {
//                for (i = 0; i < fileList.length; i++) {
//                    files.push(fileList.item(i));
//                }
//            }
//            $timeout(function() {
//                fn(scope, {
//                    $files : files,
//                    $event : evt
//                });
//            });
//        });
//        // removed this since it was confusing if the user click on browse and then cancel #181
////		elem.bind('click', function(){
////			this.value = null;
////		});
//
//        // removed because of #253 bug
//        // touch screens
////		if (('ontouchstart' in window) ||
////				(navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
////			elem.bind('touchend', function(e) {
////				e.preventDefault();
////				e.target.click();
////			});
////		}
//    };
//} ]);

