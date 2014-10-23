app.controller('ProductCtrl',['$scope', '$http',  'productsCRUD','$upload','identity', 'usSpinnerService','$location' , function($scope, $http,  productsCRUD, $upload, identity, usSpinnerService, $location) {
    $scope.mainShow = true;

    var fff = [];
   $scope.imageExist = false;

    var p = {
        name : '',
        productModel: '',
        maker: '',
        origin: '',
        reseller: {
            name: '',
            town: '',
            price: '',
            dateBought: ''
        }

    };
    $scope.product = p;
    $scope.proscon = '';
    $scope.conscon = '';
    $scope.error = 'Няма Снимка';

    //$('.prevImg').attr('src','');

    $scope.removeImage = function(){
        $scope.imageExist = false;
        $scope.error = 'Няма Снимка';
        //$('.prevImg').attr('src','');
        $scope.product.filedata = '';
        //$scope.$apply();
    };

    $scope.onFileSelect = function ($file) {



            fff = $file;
            var file = $file[0];
            var f = true;
            if (file.type.indexOf('image') == -1) {
                $scope.error = 'Снимката може да бъде само в .JPEG или .PNG формат!';
                f = false;
                // this string represents Red Dot
                //$scope.product.filedata = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
            }
            if (file.size > 5000000){
                $scope.error ='Снимката трябва да е по-малка от 5 МВ!';
                f = false;
            }
            if (f) {
                //$scope.error ='File OK and ready for uploading!';
                $scope.product.filename = file.name;
                $scope.imageExist = true;
                $scope.error = 'Избрана е снимка!';
                $('#name').focus();
            }
    };

    $scope.addProduct = function (product) {

        if(!$scope.product.name){
            alert('Важно е да въведете наименование?');
            document.getElementById("name").focus();
            return;
        }


        //if image exists
        if ($scope.imageExist){
            if (confirm('Готови ли сте да изпратите този продукт?')) {
                // Save it!
                var pp = {
                    name : $scope.product.name,
                    productModel: $scope.product.productModel || '--',
                    maker: $scope.product.maker || '--',
                    origin: $scope.product.origin || '--',
                    reseller: {
                        name: $scope.product.reseller.name || '--',
                        town: $scope.product.reseller.town || '--',
                        price: $scope.product.reseller.price || '--',
                        dateBought: $scope.product.reseller.dateBought || '--'
                    },
                    pros: [{userAdded: identity.currentUser.username,
                        dateAdded: new Date(),
                        content: $scope.proscon || '--',
                        flagIsNew: true}],
                    cons: [{userAdded: identity.currentUser.username,
                        dateAdded: new Date(),
                        content: $scope.conscon || '--',
                        flagIsNew: true}],
                    id : 99,
                    userAdded : identity.currentUser.username,
                    dateAdded : new Date(),
                    flagIsNew : true,
                    flagNewCommentAdded : true,
                    picture:[{
                        filename : $scope.product.filename,
                        dateAdded: new Date(),
                        userAdded: identity.currentUser.username
                    }],
                    keyWords: ['n/a'],
                    category: ['n/a']
                };

                //Uploads product
                //productsCRUD.create(pp);

                //Uploads image/as file and product/as data
                usSpinnerService.spin('spinner-1');
                //$('#panel').css({'min-height':window.screen.width - 55});
                $('#panel').css({'min-height':window.innerHeight - 150});
                $scope.mainShow = false;
                window.scrollTo(0, 0);

                $upload.upload({
                        url: '/upload_image',
                        file: fff[0],
                        data: pp,
                        progress: function(e){}
                    })
                    .progress(function(evt) {
                        //TODO show % progress
//                        $scope.loaded = parseInt(100.0 * evt.loaded / evt.total);
//                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
//                        console.log(evt.loaded );
                    })
                    .error(function () {
                        alert(err)
                    })
                    .then(function(data, status, headers, config) {
                        usSpinnerService.stop('spinner-1');
                        //alert('done!');
                        $scope.mainShow = true;
                        $location.path('/');
                    });

//                $scope.product.name = '';
//                $scope.product.productModel = '';
//                $scope.product.maker = '';
//                $scope.product.origin = '';
//                $scope.product.reseller.name = '';
//                $scope.product.reseller.town = '';
//                $scope.product.reseller.price = '';
//                $scope.product.reseller.dateBought = '';
//                $scope.proscon = '';
//                $scope.conscon = '';
//                //$('.prevImg').attr('src','');
//                $scope.imageExist = false;
//                $scope.error = 'No file is selected!';
//                $scope.product.filedata = '';
            }
        }
        //if no image exists
        else{
            if (confirm('Готови ли сте да изпратите този продукт?')) {
                // Save it!
                var pp = {
                    name : $scope.product.name,
                    productModel: $scope.product.productModel || '--',
                    maker: $scope.product.maker || '--',
                    origin: $scope.product.origin || '--',
                    reseller: {
                        name: $scope.product.reseller.name || '--',
                        town: $scope.product.reseller.town || '--',
                        price: $scope.product.reseller.price || '--',
                        dateBought: $scope.product.reseller.dateBought || '--'
                    },
                    pros: [{userAdded: identity.currentUser.username,
                        dateAdded: new Date(),
                        content: $scope.proscon || '--',
                        flagIsNew: true}],
                    cons: [{userAdded: identity.currentUser.username,
                        dateAdded: new Date(),
                        content: $scope.conscon || '--',
                        flagIsNew: true}],
                    picture:[{
                        filename : 'noPicture',
                        dateAdded: new Date(),
                        userAdded: identity.currentUser.username
                    }],
                    id : 99,
                    userAdded : identity.currentUser.username,
                    dateAdded : new Date(),
                    flagIsNew : true,
                    flagNewCommentAdded : true,
                    keyWords: ['n/a'],
                    category: ['n/a']
                };

                //productsCRUD.create(pp);

                //Uploads product/as data

                usSpinnerService.spin('spinner-1');
                //$('#panel').css({'min-height':window.screen.width - 55});
                $('#panel').css({'min-height':window.innerHeight - 150});
                $scope.mainShow = false;
                window.scrollTo(0, 0);

                $upload.upload({
                    url: '/upload_image',
                    //file: fff[0],
                    data: pp,
                    progress: function(e){}
                }).then(function(data, status, headers, config) {
                    usSpinnerService.stop('spinner-1');
                    //alert('done!');
                    $scope.mainShow = true;
                    $location.path('/');
                })
//                $scope.product.name = '';
//                $scope.product.productModel = '';
//                $scope.product.maker = '';
//                $scope.product.origin = '';
//                $scope.product.reseller.name = '';
//                $scope.product.reseller.town = '';
//                $scope.product.reseller.price = '';
//                $scope.product.reseller.dateBought = '';
//                $scope.proscon = '';
//                $scope.conscon = '';
//                //$('.prevImg').attr('src','');
//                $scope.imageExist = false;
//                $scope.error = 'No file is selected!';
//                $scope.product.filedata = '';
            }
        }
    }
}]);
