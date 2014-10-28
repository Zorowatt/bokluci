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


