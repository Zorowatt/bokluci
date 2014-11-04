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
            if (newValue!==undefined && newValue.length>100){
                $scope.product.name=oldValue;
                return popAlert(0,'Моля темата да не е по-дълга от 100 символа!');
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
                document.getElementById("topic").focus();
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


app.constant('msdElasticConfig', {
    append: ''
})

app.directive('msdElastic', [
        '$timeout', '$window', 'msdElasticConfig',
        function($timeout, $window, config) {
            'use strict';

            return {
                require: 'ngModel',
                restrict: 'A, C',
                link: function(scope, element, attrs, ngModel) {

                    // cache a reference to the DOM element
                    var ta = element[0],
                        $ta = element;

                    // ensure the element is a textarea, and browser is capable
                    if (ta.nodeName !== 'TEXTAREA' || !$window.getComputedStyle) {
                        return;
                    }

                    // set these properties before measuring dimensions
                    $ta.css({
                        'overflow': 'hidden',
                        'overflow-y': 'hidden',
                        'word-wrap': 'break-word'
                    });

                    // force text reflow
                    var text = ta.value;
                    ta.value = '';
                    ta.value = text;

                    var append = attrs.msdElastic ? attrs.msdElastic.replace(/\\n/g, '\n') : config.append,
                        $win = angular.element($window),
                        mirrorInitStyle = 'position: absolute; top: -999px; right: auto; bottom: auto;' +
                            'left: 0; overflow: hidden; -webkit-box-sizing: content-box;' +
                            '-moz-box-sizing: content-box; box-sizing: content-box;' +
                            'min-height: 0 !important; height: 0 !important; padding: 0;' +
                            'word-wrap: break-word; border: 0;',
                        $mirror = angular.element('<textarea tabindex="-1" ' +
                            'style="' + mirrorInitStyle + '"/>').data('elastic', true),
                        mirror = $mirror[0],
                        taStyle = getComputedStyle(ta),
                        resize = taStyle.getPropertyValue('resize'),
                        borderBox = taStyle.getPropertyValue('box-sizing') === 'border-box' ||
                            taStyle.getPropertyValue('-moz-box-sizing') === 'border-box' ||
                            taStyle.getPropertyValue('-webkit-box-sizing') === 'border-box',
                        boxOuter = !borderBox ? {width: 0, height: 0} : {
                            width:  parseInt(taStyle.getPropertyValue('border-right-width'), 10) +
                                parseInt(taStyle.getPropertyValue('padding-right'), 10) +
                                parseInt(taStyle.getPropertyValue('padding-left'), 10) +
                                parseInt(taStyle.getPropertyValue('border-left-width'), 10),
                            height: parseInt(taStyle.getPropertyValue('border-top-width'), 10) +
                                parseInt(taStyle.getPropertyValue('padding-top'), 10) +
                                parseInt(taStyle.getPropertyValue('padding-bottom'), 10) +
                                parseInt(taStyle.getPropertyValue('border-bottom-width'), 10)
                        },
                        minHeightValue = parseInt(taStyle.getPropertyValue('min-height'), 10),
                        heightValue = parseInt(taStyle.getPropertyValue('height'), 10),
                        minHeight = Math.max(minHeightValue, heightValue) - boxOuter.height,
                        maxHeight = parseInt(taStyle.getPropertyValue('max-height'), 10),
                        mirrored,
                        active,
                        copyStyle = ['font-family',
                            'font-size',
                            'font-weight',
                            'font-style',
                            'letter-spacing',
                            'line-height',
                            'text-transform',
                            'word-spacing',
                            'text-indent'];

                    // exit if elastic already applied (or is the mirror element)
                    if ($ta.data('elastic')) {
                        return;
                    }

                    // Opera returns max-height of -1 if not set
                    maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;

                    // append mirror to the DOM
                    if (mirror.parentNode !== document.body) {
                        angular.element(document.body).append(mirror);
                    }

                    // set resize and apply elastic
                    $ta.css({
                        'resize': (resize === 'none' || resize === 'vertical') ? 'none' : 'horizontal'
                    }).data('elastic', true);

                    /*
                     * methods
                     */

                    function initMirror() {
                        var mirrorStyle = mirrorInitStyle;

                        mirrored = ta;
                        // copy the essential styles from the textarea to the mirror
                        taStyle = getComputedStyle(ta);
                        angular.forEach(copyStyle, function(val) {
                            mirrorStyle += val + ':' + taStyle.getPropertyValue(val) + ';';
                        });
                        mirror.setAttribute('style', mirrorStyle);
                    }

                    function adjust() {
                        var taHeight,
                            taComputedStyleWidth,
                            mirrorHeight,
                            width,
                            overflow;

                        if (mirrored !== ta) {
                            initMirror();
                        }

                        // active flag prevents actions in function from calling adjust again
                        if (!active) {
                            active = true;

                            mirror.value = ta.value + append; // optional whitespace to improve animation
                            mirror.style.overflowY = ta.style.overflowY;

                            taHeight = ta.style.height === '' ? 'auto' : parseInt(ta.style.height, 10);

                            taComputedStyleWidth = getComputedStyle(ta).getPropertyValue('width');

                            // ensure getComputedStyle has returned a readable 'used value' pixel width
                            if (taComputedStyleWidth.substr(taComputedStyleWidth.length - 2, 2) === 'px') {
                                // update mirror width in case the textarea width has changed
                                width = parseInt(taComputedStyleWidth, 10) - boxOuter.width;
                                mirror.style.width = width + 'px';
                            }

                            mirrorHeight = mirror.scrollHeight;

                            if (mirrorHeight > maxHeight) {
                                mirrorHeight = maxHeight;
                                overflow = 'scroll';
                            } else if (mirrorHeight < minHeight) {
                                mirrorHeight = minHeight;
                            }
                            mirrorHeight += boxOuter.height;

                            ta.style.overflowY = overflow || 'hidden';

                            if (taHeight !== mirrorHeight) {
                                ta.style.height = mirrorHeight + 'px';
                                scope.$emit('elastic:resize', $ta);
                            }

                            // small delay to prevent an infinite loop
                            $timeout(function() {
                                active = false;
                            }, 1);

                        }
                    }

                    function forceAdjust() {
                        active = false;
                        adjust();
                    }

                    /*
                     * initialise
                     */

                    // listen
                    if ('onpropertychange' in ta && 'oninput' in ta) {
                        // IE9
                        ta['oninput'] = ta.onkeyup = adjust;
                    } else {
                        ta['oninput'] = adjust;
                    }

                    $win.bind('resize', forceAdjust);

                    scope.$watch(function() {
                        return ngModel.$modelValue;
                    }, function(newValue) {
                        forceAdjust();
                    });

                    scope.$on('elastic:adjust', function() {
                        initMirror();
                        forceAdjust();
                    });

                    $timeout(adjust);

                    /*
                     * destroy
                     */

                    scope.$on('$destroy', function() {
                        $mirror.remove();
                        $win.unbind('resize', forceAdjust);
                    });
                }
            };
        }
    ]);