app.controller('ProductCtrl',['$scope', '$http',  'productsCRUD','$upload','identity' , function($scope, $http,  productsCRUD, $upload, identity) {


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
    $scope.error = 'No file is selected!';

    //$('.prevImg').attr('src','');

    $scope.removeImage = function(){
        $scope.imageExist = false;
        $scope.error = 'No file is selected!';
        //$('.prevImg').attr('src','');
        $scope.product.filedata = '';
        //$scope.$apply();
    };

    $scope.onFileSelect = function ($file) {
            fff = $file;
            var file = $file[0];
            var f = true;
            if (file.type.indexOf('image') == -1) {
                $scope.error = 'image extension not allowed, please choose a JPEG or PNG file.';
                f = false;
                // this string represents Red Dot
                //$scope.product.filedata = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
            }
            if (file.size > 5000000){
                $scope.error ='File size cannot exceed 5 MB!';
                f = false;
            }
            if (f) {
                //$scope.error ='File OK and ready for uploading!';
                $scope.product.filename = file.name;
                $scope.imageExist = true;
                $scope.error = 'Selected file name is :  '+file.name;
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
            if (confirm('Готовисте ли сте да изпратите този продукт?')) {
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
                $upload.upload({
                url: '/upload_image',
                file: fff[0],
                data: pp,
                progress: function(e){}
            }).then(function(data, status, headers, config) {


                $('#uiLockId').remove();

                alert('done!');
            });

                $('<div></div>').attr('id', 'uiLockId').css({
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'z-index': 1000,
                    'opacity': 0.8,
                    'width':'100%',
                    'height':'100%',
                    'color':'white',
                    'background-color':'orange'
                }).html('').appendTo('body');




                $scope.product.name = '';
                $scope.product.productModel = '';
                $scope.product.maker = '';
                $scope.product.origin = '';
                $scope.product.reseller.name = '';
                $scope.product.reseller.town = '';
                $scope.product.reseller.price = '';
                $scope.product.reseller.dateBought = '';
                $scope.proscon = '';
                $scope.conscon = '';
                //$('.prevImg').attr('src','');
                $scope.imageExist = false;
                $scope.error = 'No file is selected!';
                $scope.product.filedata = '';
            }
        }
        //if no image exists
        else{
            if (confirm('Готовисте ли сте да изпратите този продукт?')) {
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
                $upload.upload({
                    url: '/upload_image',
                    //file: fff[0],
                    data: pp,
                    progress: function(e){}
                }).then(function(data, status, headers, config) {
                    // file is uploaded successfully
                    //console.log(data);
                });
                $scope.product.name = '';
                $scope.product.productModel = '';
                $scope.product.maker = '';
                $scope.product.origin = '';
                $scope.product.reseller.name = '';
                $scope.product.reseller.town = '';
                $scope.product.reseller.price = '';
                $scope.product.reseller.dateBought = '';
                $scope.proscon = '';
                $scope.conscon = '';
                //$('.prevImg').attr('src','');
                $scope.imageExist = false;
                $scope.error = 'No file is selected!';
                $scope.product.filedata = '';
            }
        }
    }
}]);
