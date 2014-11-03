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