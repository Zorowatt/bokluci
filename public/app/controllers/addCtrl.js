app.controller('AddCtrl',['$scope','$modalInstance','$modal','$upload','$timeout','$activityIndicator'
    , function ($scope,$modalInstance,$modal,$upload, $timeout,$activityIndicator) {


        $scope.uploadSpin = false;
        $scope.imageSpin = false;


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
        if (newValue!==undefined && newValue.length>30){
            $scope.product.name=oldValue;
            return popAlert(0,'Моля темата да не е по-дълга от 30 символа!');
        }
    });



    $scope.ent = function () {
//        alert('enter Pressed');
    };




















    //show labels if IE version less than 10
    $scope.titles = true;
    //check for IE version to be less than 10
//    var ie = (function (){
//        if (window.ActiveXObject === undefined) return null;
//        if (!document.querySelector) return 7;
//        if (!document.addEventListener) return 8;
//        if (!window.atob) return 9;
//        if (!document.__proto__) return 10;
//        return 11;
//    })();
    if (!document.__proto__){
        $scope.titles = true;
    }

//    //spinner configuration
//    var opts = {
//        lines: 7, // The number of lines to draw
//        length: 20, // The length of each line
//        width: 10, // The line thickness
//        radius: 10, // The radius of the inner circle
//        corners: 1, // Corner roundness (0..1)
//        rotate: 0, // The rotation offset
//        direction: 1, // 1: clockwise, -1: counterclockwise
//        color: '#000', // #rgb or #rrggbb or array of colors
//        speed: 1, // Rounds per second
//        trail: 60, // Afterglow percentage
//        shadow: false, // Whether to render a shadow
//        hwaccel: false, // Whether to use hardware acceleration
//        className: 'spinner', // The CSS class to assign to the spinner
//        zIndex: 2e9, // The z-index (defaults to 2000000000)
//        top: '25%', // Top position relative to parent
//        left: '50%' // Left position relative to parent
//    };
//    var target = document.getElementById('spin');
//    var spinner = new Spinner(opts);

    //$scope.imageLabel = 'Няма избрана снимка';
    $scope.imageExist = false;
    $scope.product = {};
    var selectedFile = undefined;

    $scope.removeImage = function(){


        $scope.imageExist = false;
        $scope.product.filedata = '';
        selectedFile = undefined;
        window.scrollTo(0, 0);
        $scope.imageMessage='Няма Снимка';
    };
    $scope.closeMe = function () {
        var modalInstance = $modal.open({
            templateUrl: '/p/partials/confirmMessage',
            controller: 'ConfirmMessageCtrl'
            ,backdrop: 'static'
            ,keyboard: false
            ,size: 'sm'
            ,resolve: {
               message : function () {
                   return 'Желаете ли да излезете?';
               }
            }
        });
        modalInstance.result.then(function (result) {
            if (result == 'close') {
                $activityIndicator.stopAnimating();
                $modalInstance.close('close');
            }

        });
    };
    $scope.addImage = function ($file) {
        $scope.proppername = '';
        selectedFile = $file[0];
        if (selectedFile===undefined){return;}

        if (selectedFile.type!=='image/jpeg' && selectedFile.type!=='image/png') {
            //TODO
            return popAlert(1,'Снимката може да бъде само .JPEG или .PNG формат!');
//            $scope.proppername = 'Снимката може да бъде само .JPEG или .PNG формат!';
//            return;
        }
        if (selectedFile.size > 5000000){
            return popAlert(1,'Снимката трябва да е по-малка от 5 МВ!');
//            $scope.proppername ='Снимката трябва да е по-малка от 5 МВ!';
//            return;
        }
        //$scope.product.filename = selectedFile.name;

        //angular.element('#name').focus();

        $scope.imageMessage = 'Снимката се зарежда...';

        $scope.imageSpin = true;
        $activityIndicator.startAnimating();
        //spinner.spin(target);
        $upload.upload({
            url: '/convert',
            file: selectedFile
        })
            .progress(function () {
            })
            .error(function (err) {
                $scope.imageExist = false;
                alert(err)
            })
            .then(function (data, status, headers, config) {

                $scope.imageSpin = false;
                $activityIndicator.stopAnimating();


                //spinner.stop(target);
                $scope.imageExist = true;
                $scope.img=data.data;



            });


    };
    $scope.upload = function () {


        //TODO validate title, pros and cons


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
                flagIsNew: true}],
            cons:[{
//                userAdded: identity.currentUser.username,
                dateAdded: new Date(),
                content: $scope.conscon || '--',
                flagIsNew: true}],
//            id : 99,
//            userAdded : identity.currentUser.username,
            dateAdded : new Date(),
            flagIsNew : true,
            flagNewCommentAdded : true,
            keyWords: ['n/a'],
            category: ['n/a'],
            picture : [{
                filename : !!selectedFile ? selectedFile.name : 'noPicture',
                dateAdded: new Date()
//               userAdded: identity.currentUser.username
                }]
        };


        //window.scrollTo(0, 0);
        //spinner.spin(target);
        $scope.uploadSpin = true;
        $activityIndicator.startAnimating();

        if (selectedFile!==undefined) {
            //uploads data w/ image
            $upload.upload({
                url: '/upload_image',
                file: selectedFile,
                data: pp
            })
            .progress(function () {
            })
            .error(function () {
                alert(err)
            })
            .then(function (data, status, headers, config) {
                //spinner.stop(target);
                $scope.uploadSpin = false;
                $activityIndicator.stopAnimating();
                $modalInstance.dismiss();
            });

        }else{
            //uploads data w/o image
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
                //spinner.stop(target);
                $modalInstance.dismiss();
            });
        }
    }
}]);